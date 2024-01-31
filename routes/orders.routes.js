const express = require('express');

const { addOrder, getOrders } = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', getOrders);

router.post('/', addOrder);

module.exports = router;
