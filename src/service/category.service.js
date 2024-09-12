const Category = require("../model/category.model");

const createCategoryService = async (data) => {
  try {
    const rs = await Category.create(data);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCategoryService,
};
