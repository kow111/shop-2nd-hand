const vnpayService = require('../service/payment.service');
const config = require('../config/vnpay.config.json');
const querystring = require('qs');
const crypto = require('crypto');
const Order = require('../model/order.model.js');

async function createPaymentUrl(req, res) {
    const { amount, orderId, returnUrl } = req.body;
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        const paymentUrl = await vnpayService.createPaymentUrl(amount, ipAddr, orderId, returnUrl);
        return res.status(200).json({
            DT: paymentUrl,
            EM: "Tạo URL thanh toán thành công",
        });
    } catch (error) {
        res.status(400).json({ message: "Lỗi: " + error });
    }
}

async function vnpayIPN(req, res) {
    // console.log('IPN: ', req.query);
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'].split('-ATTEMPT')[0];
    const order = await Order.findById(orderId);
    let rspCode = vnp_Params['vnp_ResponseCode'];
    let amount = vnp_Params['vnp_Amount'] / 100;
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = config.vnp_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) { //kiểm tra checksum
        if (order) {
            if (order.totalAmount == amount) {
                if (order.paymentStatus == "PENDING") {
                    if (rspCode == "00") {
                        order.paymentStatus = 'PAID';
                        order.save();
                        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' })
                    }
                    else {
                        order.paymentStatus = 'FAILED';
                        order.save();
                        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' })
                    }
                }
                else {
                    res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' })
                }
            }
            else {
                res.status(200).json({ RspCode: '04', Message: 'Invalid amount' })
            }
        }
        else {
            res.status(200).json({ RspCode: '01', Message: 'Order Not Found' })
        }
    }
    else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = { createPaymentUrl, vnpayIPN };
