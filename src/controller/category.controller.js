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
      EM: "Tạo danh mục thành công",
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
      EM: "Lấy danh mục thành công",
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
      EM: "Cập nhật danh mục thành công",
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
