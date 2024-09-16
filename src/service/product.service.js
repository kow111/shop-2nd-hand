const Product = require("../model/product.model");
const removeAccents = require("remove-accents");

const createProductService = async (data) => {
  try {
    const {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    } = data;
    let rs = await Product.create({
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductService = async (filter = {}) => {
  try {
    const query = {};
    if (filter.search) {
      const searchQuery = filter.search.trim().toLowerCase();
      query.$or = [
        { productName: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }
    let sort = {};
    if (filter.sortOrder === "asc") {
      sort.price = 1; // Sắp xếp giá từ thấp đến cao
    } else if (filter.sortOrder === "desc") {
      sort.price = -1; // Sắp xếp giá từ cao đến thấp
    }
    const products = await Product.find(query).sort(sort);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProductService,
  getProductService,
};
