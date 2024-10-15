const {
  updateUserService,
  getUserByIdService,
  getUserService,
  updateUserAdminService,
  addFavouriteService,
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

const getUser = async (req, res) => {
  try {
    const { page } = req.query;
    const rs = await getUserService({ page });
    return res.status(200).json({
      DT: rs,
      EM: null,
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateUserAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    await updateUserAdminService(userId, data);
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

const putUpdateFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;
    const rs = await addFavouriteService(userId, productId);
    return res.status(200).json({
      DT: rs,
      EM: "Add favourite successfully",
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
  getUser,
  putUpdateUserAdmin,
  putUpdateFavorite,
};
