const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  position: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
