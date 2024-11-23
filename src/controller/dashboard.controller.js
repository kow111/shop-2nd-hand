const {
  getRevenueChartService,
  getDashboardStatsService,
} = require("../service/dashboard.service");

const getRevenueChart = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const { dates, revenues } = await getRevenueChartService(fromDate, toDate);
    return res.status(200).json({
      DT: { dates, revenues },
      EM: "Lấy dữ liệu biểu đồ doanh thu thành công",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRevenueChart,
  getDashboardStats,
};
