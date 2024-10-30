const moment = require('moment');
const config = require('../config/vnpay.config.json');
const querystring = require('qs');
const crypto = require('crypto');
const Order = require("../model/order.model");

function createPaymentUrl(amount, ipAddr, orderId, returnUrl) {
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const currCode = 'VND';

    let vnp_Params = {
        'vnp_Version': '2.0.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': currCode,
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': `Thanh toán đơn hàng ${orderId}`,
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
}

function verifyChecksum(vnp_Params) {
    console.log('vnp_Params1', vnp_Params);
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    console.log('vnp_Params2', vnp_Params);
    const secretKey = config.vnp_HashSecret;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    console.log('signed', signed);
    console.log('secureHash', secureHash);
    return secureHash === signed;
}

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

const updatePaymentStatus = async (orderId, rspCode) => {
    let order = Order.findOne({ orderId });
    if (!order)
        throw new Error('Đơn hàng không tồn tại');
    if (rspCode === '00') {
        order.paymentStatus = 'PAID';
    }
    else {
        order.paymentStatus = 'FAILED';
    }
    let rs = order.save();
    return rs;
}

module.exports = { createPaymentUrl, verifyChecksum, updatePaymentStatus };
