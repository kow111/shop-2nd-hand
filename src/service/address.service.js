const Address = require("../model/address.model");

const createAddressService = async (data) => {
  // console.log(data);
  try {
    // Lấy danh sách địa chỉ của người dùng
    const existingAddresses = await getAddressByUserService(data.user);
    // Kiểm tra số lượng địa chỉ
    if (existingAddresses.length === 6) {
      throw new Error("Số lượng địa chỉ tối đa là 6");
    }
    console.log(existingAddresses);
    // Kiểm tra xem địa chỉ đã tồn tại chưa
    const addressExists = existingAddresses.some(
      (existingAddress) =>
        existingAddress.name === data.name &&
        existingAddress.phone === data.phone &&
        existingAddress.address === data.address &&
        existingAddress.city === data.city &&
        existingAddress.district === data.district &&
        existingAddress.ward === data.ward
    );
    if (addressExists) {
      throw new Error("Địa chỉ đã tồn tại");
    }
    // Đặt địa chỉ đầu tiên làm mặc định
    if (existingAddresses.length === 0) {
      data.isDefault = true;
    }
    let address = await Address.create(data);

    return address;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAddressService = async (id, data) => {
  try {
    const existingAddresses = await getAddressByUserService(data.user);
    const addressExists = existingAddresses.some(
      (existingAddress) =>
        existingAddress.name === data.name &&
        existingAddress.phone === data.phone &&
        existingAddress.address === data.address &&
        existingAddress.city === data.city &&
        existingAddress.district === data.district &&
        existingAddress.ward === data.ward
    );
    if (addressExists) {
      throw new Error(
        "Địa chỉ đã tồn tại, vui lòng không trùng tên, số điện thoại, địa chỉ, phường, quận, thành phố."
      );
    }
    let address = await Address.findByIdAndUpdate(id, data);
    return address;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAddressService = async (id) => {
  try {
    let rs = await Address.findByIdAndDelete(id);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAddressByUserService = async (userId) => {
  try {
    let rs = await Address.find({ user: userId });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setDefaultAddressService = async (userId, addressId) => {
  try {
    await Address.updateMany({ user: userId }, { isDefault: false });
    let rs = await Address.findByIdAndUpdate(addressId, { isDefault: true });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createAddressService,
  updateAddressService,
  deleteAddressService,
  getAddressByUserService,
  setDefaultAddressService,
};
