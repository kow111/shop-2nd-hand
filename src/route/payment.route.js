const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller");

router.post('/', paymentController.payment);
router.get('/result', paymentController.paymentResult);

module.exports = router;
