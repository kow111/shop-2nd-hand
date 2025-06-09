const BranchStock = require("../model/branch.stock.model");
const mongoose = require("mongoose");
const Order = require("../model/order.model");
const { addLogService } = require("./log.service");

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

const getStockByBranchAndManyProductService = async (branchId, products) => {
  try {
    console.log(products);
    const productOutOfStock = [];

    // Kiểm tra branchId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      throw new Error("branchId không hợp lệ");
    }
    branchId = new mongoose.Types.ObjectId(branchId);

    for (const item of products) {
      const branchStock = await BranchStock.findOne({
        branch: branchId,
        product: new mongoose.Types.ObjectId(item.product._id),
      });

      if (branchStock && branchStock.quantity < item.quantity) {
        productOutOfStock.push(item.product._id);
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

const updateStockService = async (
  branchId,
  productId,
  quantity,
  type,
  userId
) => {
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
      // Ghi log khi tạo mới kho
      await addLogService({
        user: userId,
        product: productId,
        branch: branchId,
        quantity: Number(quantity),
        action: "ADD",
      });
      return newStock;
    } else {
      if (type === "decrease" && stock.quantity < Number(quantity)) {
        throw new Error("Số lượng tồn kho không đủ");
      }
      if (type === "decrease") {
        stock.quantity -= Number(quantity);
        // Ghi log khi giảm số lượng kho
        await addLogService({
          user: userId,
          product: productId,
          branch: branchId,
          quantity: Number(quantity),
          action: "REMOVE",
        });
      }
      if (type === "increase") {
        let quantityToAdd = Number(quantity); // số lượng vừa nhập thêm
        await addLogService({
          user: userId,
          product: productId,
          branch: branchId,
          quantity: quantityToAdd,
          action: "ADD",
        });

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
              if (!order.products) {
                order.products = [];
              }
              order.products.push({
                product: item.product,
                image: item.image,
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                priceAtCreate: item.priceAtCreate,
              });

              quantityAvailable -= item.quantity;
              // await addLogService({
              //   user: userId,
              //   product: productId,
              //   branch: branchId,
              //   quantity: item.quantity,
              //   action: "REMOVE",
              // });
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
