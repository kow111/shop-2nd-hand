const {
  updateColorService,
  createColorService,
  getColorService,
} = require("../service/color.service");

const postCreateColor = async (req, res) => {
  try {
    const data = req.body;
    await createColorService(data);
    return res.status(200).json({
      DT: null,
      EM: "Tạo màu sắc thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getAllColor = async (req, res) => {
  try {
    const rs = await getColorService();
    return res.status(200).json({
      DT: rs,
      EM: "Lấy danh sách màu sắc thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateColor = async (req, res) => {
  try {
    const colorId = req.params.colorId;
    const data = req.body;
    await updateColorService(colorId, data);
    return res.status(200).json({
      DT: null,
      EM: "Cập nhật màu sắc thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = { postCreateColor, getAllColor, putUpdateColor };
