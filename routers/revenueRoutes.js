const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// Định nghĩa route lấy tổng doanh thu
router.get("/total", revenueController.getTotalRevenue);

module.exports = router;
