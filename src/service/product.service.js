const Product = require("../model/product.model");

const createProductService = async (data) => {
  try {
    const {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    } = data;
    let rs = await Product.create({
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProductService,
};
