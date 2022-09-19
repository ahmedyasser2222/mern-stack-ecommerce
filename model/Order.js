const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name:{type:String , required:true , min:5},
    mobileNumber:{type:String , required:true},
    mobileNumber2:{type:String},
    governorate:{type:String , required:true},
    address:{type:String ,required:true , min:5},
    notes:{type:String },
    price:{type:Number , default:0 , required:true},
    countProducts:{type:Number , default:0, required:true},
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema)
