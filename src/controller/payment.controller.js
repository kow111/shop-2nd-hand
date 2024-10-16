const { createPaymentService } = require('../service/payment.service');

const payment = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentUrl = await createPaymentService({ amount });
        res.json({ paymentUrl });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const paymentResult = async (req, res) => {
    try {
        const rs = req.query;
        if (rs.vnp_ResponseCode == '00') {
            return res.status(200).json({
                DT: rs,
                EM: "Thanh toán thành công",
            });
        }
        return res.status(400).json({
            DT: rs,
            EM: "Thanh toán thất bại",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

module.exports = { payment, paymentResult };