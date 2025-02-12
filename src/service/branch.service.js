const Branch = require("../model/branch.model");

const createBranchService = async (data) => {
  const { address } = data;
  try {
    const branch = await Branch.create({
      address,
    });
    return branch;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBranchService = async () => {
  try {
    const branches = await Branch.find();
    return branches;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBranchService = async (id, data) => {
  const { address } = data;
  try {
    const branch = await Branch.findByIdAndUpdate(
      id,
      {
        address,
      },
      { new: true }
    );
    return branch;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createBranchService,
  getBranchService,
  updateBranchService,
};
