const { getCartItemService } = require("../service/cart.service");

const getCartItem = async (req, res) => {
  try {
    const rs = await getCartItemService(req.user.userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get cart item successfully",
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
};
