const {
  createAddressService,
  updateAddressService,
  deleteAddressService,
  getAddressByUserService,
  setDefaultAddressService,
} = require("../service/address.service");
const axios = require("axios");

const postCreateAddress = async (req, res) => {
  try {
    let address = req.body;
    address.user = req.user.userId;
    await createAddressService(address);
    return res.status(200).json({
      DT: null,
      EM: "Tạo địa chỉ thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const data = req.body;
    data.user = req.user.userId;
    await updateAddressService(addressId, data);
    return res.status(200).json({
      DT: null,
      EM: "Cập nhật địa chỉ thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    await deleteAddressService(addressId);
    return res.status(200).json({
      DT: null,
      EM: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getAddressByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rs = await getAddressByUserService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Lấy địa chỉ thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    await setDefaultAddressService(userId, addressId);
    return res.status(200).json({
      DT: null,
      EM: "Đăt địa chỉ mặc định thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const checkAddress = async (req, res) => {
  let { city, district, ward, specificAddress } = req.query;
  if (district == "Quận Thủ Đức") {
    district = "Thành phố Thủ Đức";
  }
  const address = `${specificAddress}, ${ward}, ${district}, ${city}, Vietnam`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
  try {
    const rs = await axios.get(url);
    if (rs.data.length > 0) {
      return res.status(200).json({
        DT: null,
        EM: "Địa chỉ tồn tại",
      });
    }
    else {
      return res.status(400).json({
        DT: null,
        EM: "Địa chỉ không tồn tại",
      });
    }
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: "Lỗi khi kiểm tra địa chỉ: " + error.message,
    });
  }
};

module.exports = {
  postCreateAddress,
  putUpdateAddress,
  deleteAddress,
  getAddressByUser,
  setDefaultAddress,
  checkAddress,
};
