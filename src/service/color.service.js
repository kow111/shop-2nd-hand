const Color = require("../model/color.model");

const createColorService = async (data) => {
  try {
    const rs = await Color.create(data);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getColorService = async () => {
  try {
    const rs = await Color.find();
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateColorService = async (id, data) => {
  try {
    const rs = await Color.findByIdAndUpdate(id, data, { new: true });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createColorService,
  getColorService,
  updateColorService,
};
