const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: [true ,"title must be uniqe"] },
    desc: { type: String, required: true  },
    image: { type: String  },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    amount:{type :Number , default:0},
    order:{type :Number , default:0}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
