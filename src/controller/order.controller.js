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
  changeOrderPaymentStatusService,
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
      EM: "Tạo đơn hàng thành công",
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
      EM: "Hủy đơn hàng thành công",
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
      EM: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putChangeOrderPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    let rs = await changeOrderPaymentStatusService(orderId, status);
    return res.status(200).json({
      DT: rs,
      EM: "Cập nhật trạng thái thanh toán đơn hàng thành công",
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
      EM: "Lấy đơn hàng của người dùng thành công",
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
      EM: "Lấy đơn hàng theo id thành công",
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
      EM: "Lấy sản phẩm đã mua của người dùng thành công",
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
    const { page, status } = req.query;
    let rs = await getOrderByAdminService({ page, status });
    return res.status(200).json({
      DT: rs,
      EM: "Lấy đơn hàng của admin thành công",
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
  putChangeOrderPaymentStatus,
};
