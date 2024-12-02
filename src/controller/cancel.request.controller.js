const {
  createCancelRequestService,
  getCancelRequestService,
  getCancelRequestAdminService,
  approveCancelRequestService,
  rejectCancelRequestService,
  deleteCancelRequestService,
} = require("../service/cancel.request.service");

const postCancelRequest = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user.userId;
    const rs = await createCancelRequestService({ orderId, userId, reason });
    res.json(rs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCancelRequestUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rs = await getCancelRequestService(userId);
    res.json(rs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCancelRequestAdmin = async (req, res) => {
  try {
    const rs = await getCancelRequestAdminService();
    res.json(rs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putApproveCancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    await approveCancelRequestService(requestId);
    res.status(200).json({ message: "Đã chấp nhận yêu cầu hủy đơn hàng." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const putRejectCancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    await rejectCancelRequestService(requestId);
    res.status(200).json({ message: "Đã từ chối yêu cầu hủy đơn hàng" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    await deleteCancelRequestService(requestId);
    res.status(200).json({ message: "Đã xóa yêu cầu hủy đơn hàng" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postCancelRequest,
  getCancelRequestUser,
  getCancelRequestAdmin,
  putRejectCancelRequest,
  putApproveCancelRequest,
  deleteCancelRequest,
};
