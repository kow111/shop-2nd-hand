const BranchStockRequest = require('../model/branch.stock.request.model');
const mongoose = require('mongoose');

const postStockRequestService = async (branch, products, userId) => {
    try {
        const formattedProducts = products.map(product => ({
            product: product,
            status: "pending"
        }));

        const request = await BranchStockRequest.create({
            branch,
            products: formattedProducts,
            createdBy: userId,
        });
        return request;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getStockRequestService = async (filter = {}) => {
    try {
        const matchStage = {};

        if (filter.branch) {
            matchStage.branch = new mongoose.Types.ObjectId(filter.branch);
        }
        if (filter.status) {
            matchStage.status = filter.status;
        }

        const pipeline = [
            { $match: matchStage },

            // Lấy thông tin chi nhánh
            {
                $lookup: {
                    from: "branches",
                    localField: "branch",
                    foreignField: "_id",
                    as: "branchInfo",
                },
            },
            { $unwind: "$branchInfo" },

            // Lấy thông tin người tạo yêu cầu
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByInfo",
                },
            },
            { $unwind: "$createdByInfo" },

            // Lấy thông tin sản phẩm từ Product
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },

            // Lấy thông tin tồn kho từ BranchStock
            {
                $lookup: {
                    from: "branchstocks",
                    let: { branchId: "$branch", productIds: "$products" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$branch", "$$branchId"] },
                                        { $in: ["$product", "$$productIds"] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "branchStockDetails",
                },
            },

            // Lọc theo trạng thái sản phẩm nếu có
            ...(filter.productStatus
                ? [
                    {
                        $match: {
                            "productDetails.status": filter.productStatus,
                        },
                    },
                ]
                : []),

            // Sắp xếp theo ngày tạo hoặc branch
            {
                $sort: {
                    [filter.sortBy || "createdAt"]: filter.sortOrder === "asc" ? 1 : -1,
                },
            },

            // Chỉ lấy các trường quan trọng
            {
                $project: {
                    _id: 1,
                    status: 1,
                    createdAt: 1,
                    "branchInfo._id": 1,
                    "branchInfo.name": 1,
                    "createdByInfo._id": 1,
                    "createdByInfo.username": 1,
                    productDetails: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        status: 1,
                    },
                    branchStockDetails: {
                        product: 1,
                        quantity: 1,
                    },
                },
            },
        ];

        const requests = await BranchStockRequest.aggregate(pipeline);
        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    postStockRequestService,
    getStockRequestService
};