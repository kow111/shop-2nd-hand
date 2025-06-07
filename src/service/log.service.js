const Log = require("../model/log.model");

const addLogService = async (log) => {
  try {
    const newLog = await Log.create(log);
    return newLog;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getLogsByBranchService = async (branchId) => {
  try {
    const logs = await Log.find({ branch: branchId }).populate("user");
    return logs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getLogsByUserService = async (userId) => {
  try {
    const logs = await Log.find({ user: userId }).populate("branch");
    return logs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllLogsService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;
    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }
    const totalLogs = await Log.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);
    const logs = await Log.find()
      .skip(skip)
      .limit(limit)
      .populate("user", "username email")
      .populate("branch")
      .populate("product", "productName")
      .sort({ createdAt: -1 });
    return {
      data: logs,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addLogService,
  getLogsByBranchService,
  getLogsByUserService,
  getAllLogsService,
};
