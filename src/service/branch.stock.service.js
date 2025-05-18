const BranchStock = require("../model/branch.stock.model");
const mongoose = require("mongoose");
const Order = require("../model/order.model");

const getStockByBranchService = async (branchId) => {
  try {
    const stock = await BranchStock.find({ branch: branchId }).populate(
      "product"
    );
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStockByBranchAndProductService = async (branchId, productId) => {
  try {
    const stock = await BranchStock.findOne({
      branch: branchId,
      product: productId,
    });
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStockByBranchAndManyProductService = async (branchId, productIds) => {
  try {
    const productOutOfStock = [];

    // Kiểm tra branchId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      throw new Error("branchId không hợp lệ");
    }
    branchId = new mongoose.Types.ObjectId(branchId);

    // Kiểm tra productIds có tồn tại không
    if (!productIds || typeof productIds !== "string") {
      throw new Error("productIds không hợp lệ");
    }

    // Nếu productIds là một chuỗi chứa nhiều ID, ta tách thành mảng
    productIds = productIds.split(",").map((id) => id.trim());

    // Chuyển từng productId thành ObjectId
    productIds = productIds
      .map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.log(`ProductId không hợp lệ: ${id}`);
          return null; // Bỏ qua nếu không hợp lệ
        }
        return new mongoose.Types.ObjectId(id);
      })
      .filter(Boolean); // Loại bỏ các giá trị null

    for (const item of productIds) {
      const branchStock = await BranchStock.findOne({
        branch: branchId,
        product: item,
      });

      if (branchStock && branchStock.quantity === 0) {
        productOutOfStock.push(item);
      }
    }

    return productOutOfStock;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStockByProductService = async (productId) => {
  try {
    const stock = await BranchStock.find({ product: productId }).populate(
      "branch"
    );
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateStockService = async (branchId, productId, quantity, type) => {
  try {
    const stock = await BranchStock.findOne({
      branch: branchId,
      product: productId,
    });
    if (!stock && type === "decrease") {
      throw new Error("Sản phẩm không tồn tại trong kho");
    }
    if (!stock) {
      const newStock = await BranchStock.create({
        branch: branchId,
        product: productId,
        quantity: Number(quantity),
      });
      return newStock;
    } else {
      if (type === "decrease" && stock.quantity < Number(quantity)) {
        throw new Error("Số lượng tồn kho không đủ");
      }
      if (type === "decrease") {
        stock.quantity -= Number(quantity);
      }
      if (type === "increase") {
        let quantityToAdd = Number(quantity); // số lượng vừa nhập thêm
        let quantityAvailable = quantityToAdd;

        // Tìm các đơn hàng còn chờ sản phẩm
        const orders = await Order.find({
          branch: branchId,
          status: { $nin: ["SHIPPED", "DELIVERED", "CANCELLED"] },
          "pendingProducts.product": productId,
        });

        for (const order of orders) {
          let updated = false;

          // Lọc ra các pendingProducts thuộc productId
          const newPending = [];
          for (const item of order.pendingProducts) {
            if (
              item.product.toString() === productId.toString() &&
              quantityAvailable >= item.quantity
            ) {
              // Đủ hàng → chuyển sang products
              order.products.push({
                image: item.image,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                priceAtCreate: item.priceAtCreate,
              });

              quantityAvailable -= item.quantity;
              updated = true;
            } else {
              newPending.push(item);
            }
          }

          if (updated) {
            order.pendingProducts = newPending;
            await order.save();
          }
          if (quantityAvailable <= 0) break;
        }

        stock.quantity += quantityAvailable;
        await stock.save();
      }
      await stock.save();
    }
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getStockByBranchService,
  updateStockService,
  getStockByBranchAndProductService,
  getStockByProductService,
  getStockByBranchAndManyProductService,
};
