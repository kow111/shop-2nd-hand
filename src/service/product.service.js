const { default: mongoose, Types } = require("mongoose");
const Product = require("../model/product.model");
const { addLogService } = require("./log.service");

const createProductService = async (data) => {
  try {
    const {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      original_price,
      price,
      color,
      condition,
    } = data;
    let rs = await Product.create({
      productName,
      description,
      size,
      category,
      quantity,
      images,
      original_price,
      price,
      color,
      condition,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductService = async (filter = {}) => {
  try {
    // const limit = 10;
    // let skip = 0;
    // const query = {};
    // if (filter.search) {
    //   const searchQuery = filter.search.trim().toLowerCase();
    //   query.$or = [
    //     { productName: { $regex: searchQuery, $options: "i" } },
    //     { description: { $regex: searchQuery, $options: "i" } },
    //   ];
    // }
    // if (filter.page) {
    //   skip = (filter.page - 1) * limit;
    // }
    // if (filter.category) {
    //   query.category = {
    //     $in: filter.category,
    //   };
    // }
    // if (filter.color) {
    //   query.color = {
    //     $in: filter.color,
    //   };
    // }
    // if (filter.condition) {
    //   query.condition = {
    //     $in: filter.condition,
    //   };
    // }
    // let sort = {};
    // if (filter.sortOrder === "1") {
    //   sort.price = 1;
    // } else if (filter.sortOrder === "2") {
    //   sort.price = -1;
    // }

    // sort._id = 1;

    // if (filter.selectedOptionStock) {
    //   if (filter.selectedOptionStock == 0) {
    //     query.quantity = 0;
    //   } else if (filter.selectedOptionStock == 1) {
    //     query.quantity = { $lt: 10 };
    //   } else if (filter.selectedOptionStock == 2) {
    //     query.quantity = { $gt: 0 };
    //   }
    // }

    // if (filter.selectedOptionPrice) {
    //   if (filter.selectedOptionPrice == 0) {
    //     query.price = { $lt: 100000 };
    //   } else if (filter.selectedOptionPrice == 1) {
    //     query.price = { $gte: 100000, $lte: 500000 };
    //   } else if (filter.selectedOptionPrice == 2) {
    //     query.price = { $gte: 500000, $lte: 1000000 };
    //   } else if (filter.selectedOptionPrice == 3) {
    //     query.price = { $gt: 1000000 };
    //   }
    // }

    // const totalItems = await Product.countDocuments(query);
    // const totalPages = Math.ceil(totalItems / limit);

    // const products = await Product.find(query)
    //   .limit(limit)
    //   .skip(skip)
    //   .sort(sort)
    //   .populate("category", "name")
    //   .populate("color");
    // if (filter.selectedBranch && filter.selectedBranch != 0) {
    //   const productInBranch = await getStockByBranchService(
    //     filter.selectedBranch
    //   );

    //   if (!Array.isArray(productInBranch)) {
    //     throw new Error("getStockByBranchService did not return an array!");
    //   }

    //   let auditedProduct = products.map((product) => {
    //     const productStock = productInBranch.find(
    //       (stock) => stock.product._id.toString() === product._id.toString()
    //     );

    //     product = product.toObject();
    //     product.stockInBranch = productStock ? productStock.quantity : 0;
    //     return product;
    //   });
    //   return {
    //     products: auditedProduct,
    //     totalPages,
    //   };
    // }
    const pipeline = [];
    let selectedBranchId = null;
    if (filter.selectedBranch && filter.selectedBranch != 0) {
      selectedBranchId = new mongoose.Types.ObjectId(filter.selectedBranch);
    }
    // 1. Lọc theo search (nếu có)
    if (filter.search) {
      const searchQuery = filter.search.trim().toLowerCase();
      pipeline.push({
        $match: {
          $or: [
            { productName: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
          ],
        },
      });
    }

    // 2. Lọc theo các thuộc tính của sản phẩm
    if (filter.category) {
      pipeline.push({
        $match: {
          category: {
            $in: filter.category.map((id) => new Types.ObjectId(id)),
          },
        },
      });
    }
    if (filter.color) {
      pipeline.push({
        $match: { color: new Types.ObjectId(filter.color) },
      });
    }
    if (filter.condition) {
      pipeline.push({
        $match: { condition: filter.condition },
      });
    }
    if (filter.selectedOptionPrice !== undefined) {
      if (filter.selectedOptionPrice == 0) {
        pipeline.push({ $match: { price: { $lt: 100000 } } });
      } else if (filter.selectedOptionPrice == 1) {
        pipeline.push({ $match: { price: { $gte: 100000, $lte: 500000 } } });
      } else if (filter.selectedOptionPrice == 2) {
        pipeline.push({ $match: { price: { $gte: 500000, $lte: 1000000 } } });
      } else if (filter.selectedOptionPrice == 3) {
        pipeline.push({ $match: { price: { $gt: 1000000 } } });
      }
    }

    // 3. Join (populate) danh mục
    pipeline.push({
      $lookup: {
        from: "categories", // tên collection của danh mục
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });
    // 4. Join (populate) màu sắc
    pipeline.push({
      $lookup: {
        from: "colors", // tên collection của màu sắc
        localField: "color",
        foreignField: "_id",
        as: "color",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$color",
        preserveNullAndEmptyArrays: true,
      },
    });

    // 5. Xử lý filter theo chi nhánh và số lượng tồn kho
    if (filter.selectedBranch && filter.selectedBranch != 0) {
      // Join thông tin tồn kho từ collection stocks
      pipeline.push({
        $lookup: {
          from: "branchstocks", // collection lưu thông tin tồn kho
          localField: "_id",
          foreignField: "product",
          as: "stockInfo",
        },
      });
      // Lọc stock của chi nhánh cụ thể
      pipeline.push({
        $addFields: {
          branchStock: {
            $filter: {
              input: "$stockInfo",
              as: "stock",
              cond: { $eq: ["$$stock.branch", selectedBranchId] },
            },
          },
        },
      });
      pipeline.push({
        $addFields: {
          stockInBranch: {
            $ifNull: [{ $arrayElemAt: ["$branchStock.quantity", 0] }, 0],
          },
        },
      });
      // Nếu có filter số lượng theo stock
      if (filter.selectedOptionStock !== undefined) {
        pipeline.push({
          $match: {
            stockInBranch:
              filter.selectedOptionStock == 0
                ? 0
                : filter.selectedOptionStock == 1
                ? { $lt: 10 }
                : filter.selectedOptionStock == 2
                ? { $gt: 0 }
                : { $exists: true },
          },
        });
      }
    } else {
      // Nếu không chọn chi nhánh, filter số lượng áp dụng trên field quantity của sản phẩm
      if (filter.selectedOptionStock !== undefined) {
        if (filter.selectedOptionStock == 0) {
          pipeline.push({ $match: { quantity: 0 } });
        } else if (filter.selectedOptionStock == 1) {
          pipeline.push({ $match: { quantity: { $lt: 10 } } });
        } else if (filter.selectedOptionStock == 2) {
          pipeline.push({ $match: { quantity: { $gt: 0 } } });
        }
      }
    }

    // 6. Sắp xếp
    let sort = {};
    if (filter.sortOrder === "1") {
      sort.price = 1;
    } else if (filter.sortOrder === "2") {
      sort.price = -1;
    }
    sort._id = 1;

    // 7. Phân trang
    const limit = parseInt(filter.limit) || 10;
    const skip = filter.page ? (filter.page - 1) * limit : 0;
    pipeline.push({
      $facet: {
        products: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    });
    // Thực thi pipeline
    const result = await Product.aggregate(pipeline);
    // Lấy kết quả từ facet
    const products = result[0].products;
    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].count
      : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductByIdService = async (id) => {
  try {
    let rs = await Product.findById(id);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductService = async (id, data, imageActions, userId) => {
  try {
    let product = await Product.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    if (data) {
      if (data.productName) product.productName = data.productName;
      if (data.description) product.description = data.description;
      if (data.size) product.size = data.size;
      if (data.category) product.category = data.category;
      if (data.quantity < 0) {
        throw new Error("Số lượng sản phẩm không hợp lệ");
      }
      if (data.quantity) {
        if (product.quantity !== data.quantity) {
          // Log the change in quantity
          if (product.quantity < data.quantity) {
            await addLogService({
              user: userId,
              product: product._id,
              branch: null,
              quantity: data.quantity - product.quantity,
              action: "ADD",
            });
          } else {
            await addLogService({
              user: userId,
              product: product._id,
              branch: null,
              quantity: product.quantity - data.quantity,
              action: "REMOVE",
            });
          }
        }
        product.quantity = data.quantity;
      }
      if (data.original_price < 0) {
        throw new Error("Giá gốc sản phẩm không hợp lệ");
      }
      if (data.original_price) product.original_price = data.original_price;
      if (data.price < 0) {
        throw new Error("Giá sản phẩm không hợp lệ");
      }
      if (data.price) product.price = data.price;
      if (data.color) product.color = data.color;
      if (data.condition) product.condition = data.condition;
    }
    if (imageActions && imageActions.length > 0) {
      imageActions.forEach((actionObj) => {
        const { action, url, oldUrl, newUrl } = actionObj;
        switch (action) {
          case "add":
            product.images.push(url);
            break;
          case "delete":
            product.images = product.images.filter((image) => image !== url);
            break;
          case "replace":
            const index = product.images.indexOf(oldUrl);
            if (index !== -1) {
              product.images[index] = newUrl;
            }
            break;
          default:
            throw new Error("Invalid action");
        }
      });
    }

    let updatedProduct = await product.save();

    return updatedProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProductService,
  getProductService,
  getProductByIdService,
  updateProductService,
};
