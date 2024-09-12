const { createCategoryService } = require("../service/category.service");
const { createProductService } = require("../service/product.service");

const postCreateCategory = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    let data = {
      name,
    };
    let rs = await createCategoryService(data);
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
  postCreateCategory,
};
