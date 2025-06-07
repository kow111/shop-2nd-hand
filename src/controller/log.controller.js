const { getAllLogsService } = require("../service/log.service");

const getAllLog = async (req, res) => {
  try {
    const { page, type } = req.query;
    let rs = await getAllLogsService({ page, type });
    return res.status(200).json({
      DT: rs,
      EM: "Lấy tất cả log thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getAllLog,
};
