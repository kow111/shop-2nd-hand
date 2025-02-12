const {
  getBranchService,
  createBranchService,
  updateBranchService,
} = require("../service/branch.service");

const getBranchs = async (req, res) => {
  try {
    const branchs = await getBranchService();
    return res.status(200).json({
      DT: branchs,
      EM: "Lấy danh sách chi nhánh thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const createBranch = async (req, res) => {
  try {
    const data = req.body;
    const branch = await createBranchService(data);
    return res.status(200).json({
      DT: branch,
      EM: "Tạo chi nhánh mới thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const branch = await updateBranchService(id, data);
    return res.status(200).json({
      DT: branch,
      EM: "Cập nhật chi nhánh thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getBranchs,
  createBranch,
  updateBranch,
};
