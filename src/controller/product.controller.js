const {
  createProductService,
  getProductService,
  getProductByIdService,
  updateProductService,
} = require("../service/product.service");
const { validationResult } = require("express-validator");

const postCreateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ DT: null, EM: errorMessages[0] });
  }
  try {
    const data = req.body;
    let rs = await createProductService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Tạo sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const {
      search,
      sortOrder,
      page,
      category,
      selectedOptionStock,
      selectedOptionPrice,
      color,
      condition,
    } = req.query;

    let rs = await getProductService({
      search,
      sortOrder,
      page,
      category,
      selectedOptionStock,
      selectedOptionPrice,
      color,
      condition,
    });
    return res.status(200).json({
      DT: rs,
      EM: "Tìm kiếm sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let rs = await getProductByIdService(id);
    return res.status(200).json({
      DT: rs,
      EM: "Lấy sản phẩm theo id thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      description,
      size,
      category,
      quantity,
      price,
      color,
      condition,
    } = req.body;
    let data = {
      productName,
      description,
      size,
      category,
      quantity,
      price,
      color,
      condition,
    };
    let { actions } = req.body;
    let rs = await updateProductService(id, data, actions);
    return res.status(200).json({
      DT: rs,
      EM: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  postCreateProduct,
  getProduct,
  getProductById,
  putUpdateProduct,
};
