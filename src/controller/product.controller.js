const { createProductService } = require("../service/product.service");
const { validationResult } = require("express-validator");

const postCreateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ DT: null, EM: errorMessages[0] });
  }
  try {
    const {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    } = req.body;
    let data = {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    };

    let rs = await createProductService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Create product successfully",
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
};
