const CancelRequest = require("../model/cancel.request.model");
const Order = require("../model/order.model");
const { addNotificationJob } = require("../queues/notification.queue");
const { cancelOrderService } = require("./order.service");

const createCancelRequestService = async (data) => {
  try {
    const { orderId, userId, reason } = data;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Đơn hàng đã bị hủy");
    }
    if (order.status === "DELIVERED" || order.status === "SHIPPED") {
      throw new Error("Không thể hủy đơn hàng đã giao hoặc đang giao");
    }
    const cancelRequest = await CancelRequest.findOne({ order: orderId });
    if (cancelRequest) {
      throw new Error("Đơn hàng đã có yêu cầu hủy");
    }
    const rs = await CancelRequest.create({
      order: orderId,
      user: userId,
      reason,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCancelRequestService = async (userId) => {
  try {
    const rs = await CancelRequest.find({ user: userId }).populate("order");
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCancelRequestAdminService = async () => {
  try {
    const rs = await CancelRequest.find().populate({
      path: "order",
      populate: {
        path: "products.product",
        model: "Product",
      },
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const approveCancelRequestService = async (cancelRequestId) => {
  try {
    const cancelRequest = await CancelRequest.findById(cancelRequestId);
    if (!cancelRequest) {
      throw new Error("Không tìm thấy yêu cầu hủy");
    }
    const order = await Order.findById(cancelRequest.order);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Đơn hàng đã bị hủy");
    }
    await cancelOrderService(order._id, order.user);
    await CancelRequest.findByIdAndDelete(cancelRequestId);
    addNotificationJob({
      userId: order.user,
      orderId: order._id,
      newStatus: "CANCELLED",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const rejectCancelRequestService = async (cancelRequestId) => {
  try {
    await CancelRequest.findByIdAndDelete(cancelRequestId);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCancelRequestService = async (cancelRequestId) => {
  try {
    console.log(cancelRequestId);
    await CancelRequest.findByIdAndDelete(cancelRequestId);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCancelRequestService,
  getCancelRequestService,
  getCancelRequestAdminService,
  approveCancelRequestService,
  rejectCancelRequestService,
  deleteCancelRequestService,
};
