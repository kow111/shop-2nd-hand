const vnpayService = require('../service/payment.service');
const Order = require("../model/order.model");

function createPaymentUrl(req, res) {
    const { amount, orderId, returnUrl } = req.body;
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        const paymentUrl = vnpayService.createPaymentUrl(amount, ipAddr, orderId, returnUrl);
        res.json({ paymentUrl });
    } catch (error) {
        res.status(400).json({ message: "Có lỗi xảy ra trong quá trình tạo URL thanh toán." + error });
    }
}

const vnpayVerify = async (req, res) => {
    try {
        const vnp_Params = req.query;
        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];
        let rs = await vnpayService.updatePaymentStatus(orderId, rspCode);
        return res.status(200).json({
            DT: rs,
            EM: "Cập nhật trạng thái thanh toán thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

// function vnpayIpn(req, res) {
//     const vnp_Params = req.query;
//     const orderId = vnp_Params['vnp_TxnRef'];
//     const rspCode = vnp_Params['vnp_ResponseCode'];

//     if (vnpayService.verifyChecksum(vnp_Params)) {
//         const order = Order.findOne({ orderId: orderId });
//         if (order) { // checkOrderId from DB
//             if (order.paymentStatus === "PENDING") { // paymentStatus from DB
//                 if (rspCode === '00') {
//                     order.paymentStatus = 'PAID';
//                     order.save();
//                     res.status(200).json({ RspCode: '00', Message: 'Thanh toán thành công' });
//                 } else {
//                     order.paymentStatus = 'FAILED';
//                     order.save();
//                     res.status(200).json({ RspCode: '00', Message: 'Thanh toán thất bại' });
//                 }
//             } else {
//                 res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
//             }
//         } else {
//             res.status(200).json({ RspCode: '01', Message: 'Order Not Found' });
//         }
//     } else {
//         res.status(200).json({ Message: "Invalid Checksum", RspCode: "97" });
//     }
// }


module.exports = { createPaymentUrl, vnpayVerify };
