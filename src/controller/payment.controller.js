const { createPaymentService } = require('../service/payment.service');
const querystring = require('qs');

const payment = async (req, res) => {
    try {
        const rs = await createPaymentService(req.body);
        return res.status(200).json({
            DT: rs,
            EM: "Tạo link thanh toán thành công"
        });
    }
    catch (error) {
        res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

const paymentResult = async (req, res) => {
    try {
        const vnp_Params = req.query;
        return res.redirect(`http://localhost:5173/payment/result?${querystring.stringify(vnp_Params)}`);
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

module.exports = { payment, paymentResult };