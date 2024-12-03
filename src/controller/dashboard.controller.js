const {
  getRevenueChartService,
  getDashboardStatsService,
  getOrderStatusDistributionService,
  getRevenueChartByMonthService,
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

const getRevenueChartByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    const { months, revenues } = await getRevenueChartByMonthService(year);
    return res.status(200).json({
      DT: { months, revenues },
      EM: "Lấy dữ liệu biểu đồ doanh thu theo tháng thành công",
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

const getOrderStatusDistribution = async (req, res) => {
  try {
    const orderStatusDistribution = await getOrderStatusDistributionService();
    return res.status(200).json({
      DT: orderStatusDistribution,
      EM: "Lấy dữ liệu phân phối trạng thái đơn hàng thành công",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRevenueChart,
  getDashboardStats,
  getOrderStatusDistribution,
  getRevenueChartByMonth,
};
