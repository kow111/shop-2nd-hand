const Product = require("../model/product.model");

const createProductService = async (data) => {
  try {
    const { name, price, description, image } = data;
    let rs = await Product.create({
      name,
      price,
      description,
      image,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProductService,
};
