const {
    postStockRequestService,
    getStockRequestService,
    updateStockRequestStatusService,
    updateProductStatusService,
    deleteStockRequestService,
    getPendingStockByBranchAndProductService
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

const updateStockRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        await updateStockRequestStatusService(requestId, status);
        return res.status(200).json({
            DT: null,
            EM: "Cập nhật trạng thái yêu cầu điều chuyển thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const updateProductStatus = async (req, res) => {
    try {
        const { requestId, productId, status } = req.body;
        await updateProductStatusService(requestId, productId, status);
        return res.status(200).json({
            DT: null,
            EM: "Cập nhật trạng thái sản phẩm thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const deleteStockRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        await deleteStockRequestService(requestId);
        return res.status(200).json({
            DT: null,
            EM: "Xóa yêu cầu điều chuyển thành công",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const getPendingStockByBranchAndProduct = async (req, res) => {
    try {
        const { branchId, productId } = req.query;
        const pendingStockRequest = await getPendingStockByBranchAndProductService(branchId, productId);
        return res.status(200).json({
            DT: pendingStockRequest,
            EM: "Lấy số lượng hàng đang cần thành công",
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
    updateStockRequestStatus,
    updateProductStatus,
    deleteStockRequest,
    getPendingStockByBranchAndProduct
};