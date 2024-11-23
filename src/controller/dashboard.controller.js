const { getRevenueChartService } = require("../service/dashboard.service");

const getRevenueChart = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const { dates, revenues } = await getRevenueChartService(fromDate, toDate);
    return res
      .status(200)
      .json({
        DT: { dates, revenues },
        EM: "Lấy dữ liệu biểu đồ doanh thu thành công",
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRevenueChart,
};
