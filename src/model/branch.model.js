const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
