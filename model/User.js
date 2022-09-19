const mongoose = require("mongoose");
const jwt=require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean,default: false},
    verified:{type: Boolean,default: false},
    order:{type: Number,default: 0},
  },
  { timestamps: true }
);
 
UserSchema.method("getToken" , function(){
  const token =jwt.sign({
    id:this._id ,
    isAdmin : this.isAdmin
  } ,process.env.JWT_SEC ,{expiresIn :"10d"} )
  return token
})

module.exports = mongoose.model("users", UserSchema);
