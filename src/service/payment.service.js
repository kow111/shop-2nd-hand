const moment = require('moment');
const config = require('../config/vnpay.config.json');
const querystring = require('qs');
const crypto = require('crypto');
const Order = require('../model/order.model.js');

async function createPaymentUrl(amount, ipAddr, orderId, returnUrl) {
    try {
        const order = await Order.findById(orderId);
        if (order === null) {
            throw new Error('Không tìm thấy đơn hàng');
        }
        if (order.paymentStatus == 'PAID') {
            throw new Error('Đơn hàng đã được thanh toán');
        }

        const tmnCode = config.vnp_TmnCode;
        const secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const currCode = 'VND';

        const baseOrderId = orderId;
        const randomAttempt = Math.floor(100000 + Math.random() * 900000);
        const TxnRef = `${baseOrderId}-ATTEMPT${randomAttempt}`;

        let vnp_Params = {
            'vnp_Version': '2.0.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': currCode,
            'vnp_TxnRef': TxnRef,
            'vnp_OrderInfo': `Thanh toán đơn hàng ${TxnRef}`,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate,
        };

        vnp_Params = sortObject(vnp_Params);
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;

        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        return vnpUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}


module.exports = { createPaymentUrl };
