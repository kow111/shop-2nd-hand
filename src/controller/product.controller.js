const { createProductService } = require("../service/product.service");

const postCreateProduct = async (req, res) => {
  try {
    const { productName, price, description, image } = req.body;
    let data = {
      productName,
      price,
      description,
      imageBanner,
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
