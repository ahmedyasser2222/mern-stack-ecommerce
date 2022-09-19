const asyncErrorPattern = require("../middelware/asyncError");
const Users = require("../model/User");
const bcrypt = require("bcrypt");
const Token = require("../model/token");
const sendEmail = require("../utile/nodeMailer");
const crypto = require("crypto");
const joi = require("joi");
const ErrorHander = require("../utile/errorhandler");
const Product = require("../model/Products");
const Order = require("../model/Order");
const User = require("../model/User");

const register = asyncErrorPattern(async (req, res, nxt) => {
  let user = await Users.findOne({ email: req.body.email }).exec();
  if (user) return nxt(new ErrorHander("This User already exist", 400));
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;
  user = await new Users(req.body).save();
  const token = await new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const url = `${process.env.BASE_URL}${user._id}/verify/${token.token}`;
  await sendEmail(user.email, "Verify Email", url);
  res.status(200).json({ msg: "An Email sent to your account please verify" });
});
const login = asyncErrorPattern(async (req, res, nxt) => {
  const user = await Users.findOne({ email: req.body.email }).exec();
  if (!user) return nxt(new ErrorHander("Error in Email or Password", 400));
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return nxt(new ErrorHander("Error in Email or Password", 400));
  if (!user.verified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "Verify Email", url);
    }
    res
      .status(200)
      .json({ msg: "An Email sent to your account please verify" });
  }
  const token = user.getToken();
  res.status(200).json({ msg: "success", user, token });
});
const updateUser = asyncErrorPattern(async (req, res, nxt) => {
  const user = await Users.findOneAndUpdate(req.params.id, req.body, {
    returnOriginal: false,
  });
  if (!user) return nxt(new ErrorHander("User not found", 400));
  res.status(200).json({ msg: "User updated " });
});
const deleteUser = asyncErrorPattern(async (req, res, nxt) => {
  const user = await Users.findOneAndDelete({ _id: req.params.id });
  if (!user) return nxt(new ErrorHander("User not found", 400));
  res.status(200).json({ msg: "User deleted " });
});
const getUserById = asyncErrorPattern(async (req, res, nxt) => {
  const user = await Users.find({ _id: req.params.id });
  if (!user) return nxt(new ErrorHander("User not found", 400));
  res.status(200).json({ msg: "success", user });
});
const getUsers = asyncErrorPattern(async (req, res, nxt) => {
  const users = await Users.find();
  if (!users) return nxt(new ErrorHander("Users not found", 400));
  res.status(200).json({ msg: "success", users });
});
const verifyEmail = asyncErrorPattern(async (req, res, nxt) => {
  const user = await Users.findOne({ _id: req.params.id });
  if (!user) return nxt(new ErrorHander("In Valid Link", 400));
  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) return nxt(new ErrorHander("In Valid token", 400));
  await Users.findOneAndUpdate({ _id: user._id }, { verified: true });
  await token.remove();
  res.status(200).send({ msg: "Email Verifed Successfully", user });
});
const resetPassword = asyncErrorPattern(async (req, res, nxt) => {
  const emailSchema = joi.object({
    email: joi.string().email().required(),
  });
  const { error } = emailSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  console.log(req.body);
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "email not have account " });
  let token = await Token.findOne({ userId: user._id });
  if (!token) {
    token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
  }
  const url = `http://localhost:3000/resetpassword/${user._id}/${token.token}`;
  await sendEmail(user.email, "Password Reset ", url);
  res
    .status(200)
    .json({ msg: "password reset link send to your gmail account" });
});
const countUser = asyncErrorPattern(async (req, res, nxt) => {
  const countUser = await Users.count({});
  const countProducts = await Product.count({});
  const countOrders = await Order.count({});
  const orders=await Order.aggregate([
    {
      $group: {
        _id: "",
        count: {
          $sum: "$price"
        }
      }
    } 
  ])
  res.status(200).json({ countUser, countProducts, countOrders ,totalPrice:orders[0].count});
});
const getProfile = asyncErrorPattern(async (req, res, nxt) => {
    const user=await User.findById(req.user._id)
    if(!user) nxt(new ErrorHander("Not Found User",401))
    res.status(200).json({user})
});
const updatePassword=asyncErrorPattern(async(req,res,nxt)=>{
  const user=await User.findById(req.user._id)
  const comperedPassword=await bcrypt.compare(req.body.curentPassword , user.password)
  if(!comperedPassword) return nxt(new ErrorHander("Password not Correct ! "))
  const newPassword=await bcrypt.hash(req.body.newPassword ,10 )
  const updatedUser=await User.findOneAndUpdate({_id:req.user._id},{password:newPassword})
  res.status(200).json({message:"Sucessfull"})
})
const getUserBySearch = asyncErrorPattern(async (req, res, nxt) => {
  const users = await User.find({ name: { $regex : req.body.search , $options: '$i'} }).exec()
  if(!users) return res.status(401).json({success:false})
  res.status(200).json({ users });
});

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  verifyEmail,
  resetPassword,
  countUser,
  getProfile,
  updatePassword,
  getUserBySearch
};
