const { addChangeOrderStatusJob } = require("../queues/order.queue");
const { updateCartItemService } = require("../service/cart.service");
const {
  createOrderService,
  cancelOrderService,
  changeOrderStatusService,
  getOrderByUserService,
  getOrderByIdService,
  getProductUserPurchasedService,
  getOrderByAdminService,
} = require("../service/order.service");

const postCreateOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    } = req.body;
    const userId = req.user.userId;
    let data = {
      userId,
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    };
    let rs = await createOrderService(data);
    addChangeOrderStatusJob({
      orderId: rs._id,
    });
    await updateCartItemService(userId, {
      deleteProduct: products.map((product) => product.productId),
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

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    let rs = await getOrderByIdService(orderId);
    return res.status(200).json({
      DT: rs,
      EM: "Get order by id successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getProductUserPurchased = async (req, res) => {
  try {
    const userId = req.user.userId;
    let rs = await getProductUserPurchasedService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get product user purchased successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getOrderByAdmin = async (req, res) => {
  try {
    const { page } = req.query;
    let rs = await getOrderByAdminService({ page });
    return res.status(200).json({
      DT: rs,
      EM: "Get order by admin successfully",
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
  getOrderById,
  getProductUserPurchased,
  getOrderByAdmin,
};
