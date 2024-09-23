const { createOrderService } = require("../service/order.service");

const postCreateOrder = async (req, res) => {
  try {
    const { products, totalAmount, paymentMethod, address } = req.body;
    const userId = req.user.userId;
    let data = {
      userId,
      products,
      totalAmount,
      paymentMethod,
      address,
    };
    let rs = await createOrderService(data);
    return res.status(200).json({
      DT: rs,
      EM: "Create order successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};
module.exports = {
  postCreateOrder,
};