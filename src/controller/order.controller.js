const {
  createOrderService,
  cancelOrderService,
} = require("../service/order.service");

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

const putCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    let rs = await cancelOrderService(orderId, userId);
    return res.status(200).json({
      DT: rs,
      EM: "Cancel order successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putChangeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    let rs = await changeOrderStatusService(orderId, status);
    return res.status(200).json({
      DT: rs,
      EM: "Change order status successfully",
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
  putCancelOrder,
  putChangeOrderStatus,
};
