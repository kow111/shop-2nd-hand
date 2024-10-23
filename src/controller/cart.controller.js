const {
  getCartItemService,
  updateCartItemService,
} = require("../service/cart.service");

const getCartItem = async (req, res) => {
  try {
    const rs = await getCartItemService(req.user.userId);
    return res.status(200).json({
      DT: rs,
      EM: "Lấy giỏ hàng thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateCartItem = async (req, res) => {
  try {
    const rs = await updateCartItemService(req.user.userId, req.body);
    return res.status(200).json({
      DT: rs,
      EM: "Cập nhật giỏ hàng thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getCartItem,
  putUpdateCartItem,
};
