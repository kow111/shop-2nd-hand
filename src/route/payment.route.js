const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller");

router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/vnpay_ipn', paymentController.vnpayIPN);

module.exports = router;
