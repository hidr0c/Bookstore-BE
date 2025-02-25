const Revenue = require('../models/revenue');

// Hàm lấy tổng doanh thu
exports.getTotalRevenue = async (req, res) => {
  try {
    const allRevenues = await Revenue.find({});
    const totalRevenue = allRevenues.reduce((total, record) => total + record.totalAmount, 0);

    res.status(200).json({
      status: 'success',
      totalRevenue,
      totalRecords: allRevenues.length,
      orders: allRevenues, // Trả về danh sách các đơn hàng đã tạo doanh thu
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: err.message });
  }
};
