const BranchStock = require("../model/branch.stock.model");
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

const getStockByProductService = async (productId) => {
  try {
    const stock = await BranchStock.find({ product: productId });
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
        quantity,
      });
      return newStock;
    } else {
      stock.quantity += quantity;
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
};
