const BranchStock = require("../model/branch.stock.model");
const Product = require("../model/product.model");
const mongoose = require("mongoose");


const getStockByBranchService = async (branchId) => {
  try {
    const stock = await BranchStock.find({ branch: branchId }).populate("product");
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

const updateStockService = async (branchId, productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (product.quantity < quantity) {
      throw new Error("Số lượng sản phẩm không đủ");
    }
    if (!product.stock || product.stock.length === 0) {
      product.stock = [];
      product.stock.push({
        branch: branchId,
        quantity: Number(quantity),
      });
      product.quantity -= Number(quantity);
    } else {
      const index = product.stock.findIndex(
        (item) => item.branch.toString() === branchId
      );
      if (index === -1) {
        product.stock.push({
          branch: branchId,
          quantity: Number(quantity),
        });
      } else {
        product.stock[index].quantity += Number(quantity);
      }
      product.quantity -= Number(quantity);
    }
    let updateStock = await product.save();
    return updateStock;
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
