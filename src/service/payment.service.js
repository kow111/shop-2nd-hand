const querystring = require('qs');
const crypto = require('crypto');

// URL thanh toán VNPAY
const VNPAY_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNPAY_TMN_CODE = 'VI14NZI3';
const VNPAY_HASH_SECRET = 'N43J8WMNSI55AYC71EEDMQ10IE0JDWE7';

// Hàm tạo URL thanh toán
const createPaymentService = (orderData) => {
    const { amount } = orderData;
    // Thời gian hiện tại
    const date = new Date();
    orderId = date.toISOString().slice(0, 19).replace(/T/, '').replace(/:/g, '').replace(/-/g, '');
    // Tạo dữ liệu thanh toán
    const vnp_Params = {
        vnp_Version: '2.0.0',
        vnp_Command: 'pay',
        vnp_TmnCode: VNPAY_TMN_CODE,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId, // Mã đơn hàng
        vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`, // Thông tin đơn hàng
        vnp_OrderType: '200000', // Loại đơn hàng
        vnp_Amount: (amount * 100).toString(), // Số tiền (VND, nhân với 100)
        vnp_ReturnUrl: 'http://localhost:3000/api/v1/payment/result', // URL trả về
        vnp_IpAddr: "192.168.0.102", // Địa chỉ IP
        vnp_CreateDate: date.toISOString().slice(0, 19).replace(/T/, '').replace(/:/g, '').replace(/-/g, ''), // Ngày tạo
    };

    const sortedParams = Object.keys(vnp_Params).sort().reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
    }, {});

    // Tạo chữ ký
    const signData = querystring.stringify(sortedParams, { encode: false });
    let hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // Thêm chữ ký vào tham số
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${VNPAY_URL}?${querystring.stringify(vnp_Params, { encode: false })}`;

    return paymentUrl;
};


module.exports = { createPaymentService };
