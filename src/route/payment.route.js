const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller");

router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/vnpay_verify', paymentController.vnpayVerify);
// router.get('/vnpay_ipn', paymentController.vnpayIpn);

module.exports = router;
