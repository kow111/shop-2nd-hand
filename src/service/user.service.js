const User = require("../model/user.model");
const updateUserService = async (userId, data) => {
  try {
    const { username, phone, gender, address, image } = data;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (gender && ["MALE", "FEMALE", "OTHER"].includes(gender)) {
      user.gender = gender;
    }
    if (address) user.address = address;
    if (image) user.image = image;

    await user.save();
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateEmailService = async (userId, data) => {
  try {
    const { email } = data;
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Cập nhật email
    user.email = email;
    await user.save();
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = {
  updateUserService,
  updateEmailService,
};