const {
  createCategoryService,
  getCategoryService,
  updateCategoryService,
} = require("../service/category.service");

const postCreateCategory = async (req, res) => {
  try {
    const { name } = req.body;
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

const getAllCategory = async (req, res) => {
  try {
    let rs = await getCategoryService();
    return res.status(200).json({
      DT: rs,
      EM: "Get all category successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let data = {
      name,
    };

    let rs = await updateCategoryService(id, data);
    return res.status(200).json({
      DT: rs,
      EM: "Update category successfully",
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
  getAllCategory,
  putUpdateCategory,
};
