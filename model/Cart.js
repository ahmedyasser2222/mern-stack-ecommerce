let mongoose = require("mongoose");

let CartSchema = new mongoose.Schema(
  {
    userId:String ,
    products: [
      {
        productId:{
          type:String ,
          required:true ,
          unique:false
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }
    ]
  },
  {timestamps :true}
);

module.exports = mongoose.model("cart", CartSchema)
