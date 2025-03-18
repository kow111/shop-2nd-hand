const {
    postStockRequestService,
    getStockRequestService,
} = require('../service/branch.stock.request.service');

const postStockRequest = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { branch, products } = req.body;
        const stockRequest = await postStockRequestService(branch, products, userId);
        return res.status(200).json({
            DT: stockRequest,
            EM: "Tạo yêu cầu điều chuyển thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const getStockRequest = async (req, res) => {
    try {
        const filter = req.query;
        const stockRequests = await getStockRequestService(filter);
        return res.status(200).json({
            DT: stockRequests,
            EM: "Lấy danh sách yêu cầu điều chuyển thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

module.exports = {
    postStockRequest,
    getStockRequest,
};