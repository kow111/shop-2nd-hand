const { addChangeOrderStatusJob } = require("../queues/order.queue");
const {
  createOrderService,
  cancelOrderService,
  changeOrderStatusService,
  getOrderByUserService,
} = require("../service/order.service");

const postCreateOrder = async (req, res) => {
  try {
    const { products, totalAmount, paymentMethod, name, phone, address } =
      req.body;
    const userId = req.user.userId;
    let data = {
      userId,
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
    };
    let rs = await createOrderService(data);
    addChangeOrderStatusJob({
      orderId: rs._id,
    });
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

const getOrderByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    let rs = await getOrderByUserService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get order by user successfully",
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
  getOrderByUser,
};
