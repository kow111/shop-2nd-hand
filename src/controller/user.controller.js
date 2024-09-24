const {
  updateUserService,
  getUserByIdService,
} = require("../service/user.service");

const putUpdateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(userId);
    const data = req.body;
    await updateUserService(userId, data);
    return res.status(200).json({
      DT: null,
      EM: "Update user successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getUserByIdUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await getUserByIdService(userId);
    return res.status(200).json({
      DT: user,
      EM: null,
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  putUpdateUser,
  getUserByIdUser,
};
