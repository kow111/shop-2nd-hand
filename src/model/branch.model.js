const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
