const BranchStock = require("../model/branch.stock.model");
const mongoose = require("mongoose");


const getStockByBranchService = async (branchId) => {
  try {
    const stock = await BranchStock.find({ branch: branchId });
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
    if (!productIds) {
      throw new Error("productIds không được để trống");
    }

    // Nếu productIds không phải là mảng thì chuyển thành mảng
    if (!Array.isArray(productIds)) {
      productIds = [productIds]; // Chuyển thành mảng nếu là chuỗi
    }

    // Chuyển từng productId thành ObjectId
    productIds = productIds.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`❌ ProductId không hợp lệ: ${id}`);
        return null; // Bỏ qua nếu không hợp lệ
      }
      return new mongoose.Types.ObjectId(id);
    }).filter(Boolean); // Xóa các giá trị null

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
    const stock = await BranchStock.findOne({
      branch: branchId,
      product: productId,
    });
    if (!stock) {
      const newStock = await BranchStock.create({
        branch: branchId,
        product: productId,
        quantity: Number(quantity),
      });
      return newStock;
    } else {
      stock.quantity += Number(quantity);
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
