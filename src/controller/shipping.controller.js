const { default: axios } = require("axios");

const CalculateShipping = async (req, res) => {
  try {
    const { province, district, weight, pick_province, pick_district, value } =
      req.query;
    const API_SERVICE =
      "https://services.giaohangtietkiem.vn/services/shipment/fee";
    const rsAPI = await axios.get(API_SERVICE, {
      params: {
        pick_province: pick_province,
        pick_district: pick_district,
        weight: weight,
        value: value,
        province: province,
        district: district,
      },
      headers: {
        Token: process.env.API_KEY,
      },
    });
    return res.status(200).json({
      DT: rsAPI.data,
      EM: "Tính phí ship thành công",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  CalculateShipping,
};
