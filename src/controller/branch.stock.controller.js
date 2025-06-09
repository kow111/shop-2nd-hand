const {
  getStockByBranchService,
  updateStockService,
  getStockByProductService,
  getStockByBranchAndProductService,
  getStockByBranchAndManyProductService,
} = require("../service/branch.stock.service");

const getStockByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const products = await getStockByBranchService(branchId);
    return res.status(200).json({
      DT: products,
      EM: "Lấy danh sách sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const products = await getStockByProductService(productId);
    return res.status(200).json({
      DT: products,
      EM: "Lấy danh sách sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getStockByBranchAndProduct = async (req, res) => {
  try {
    const { branchId, products } = req.params;
    const stock = await getStockByBranchAndProductService(branchId, products);
    return res.status(200).json({
      DT: stock,
      EM: "Lấy sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getStockByBranchAndManyProduct = async (req, res) => {
  try {
    const { branchId, products } = req.query;
    const stock = await getStockByBranchAndManyProductService(
      branchId,
      products
    );
    return res.status(200).json({
      DT: stock,
      EM: "Lấy sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { branchId, productId } = req.params;
    const { quantity, type } = req.body;
    const userId = req.user.userId;
    const stock = await updateStockService(
      branchId,
      productId,
      quantity,
      type,
      userId
    );
    return res.status(200).json({
      DT: stock,
      EM: "Cập nhật kho thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getStockByBranch,
  updateStock,
  getStockByProduct,
  getStockByBranchAndProduct,
  getStockByBranchAndManyProduct,
};
