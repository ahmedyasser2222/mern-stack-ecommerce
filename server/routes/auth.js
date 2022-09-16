const router = require("express").Router();
const User=require("../controller/userController")
const validRegister=require("../middelware/registerValid")
const validLogin=require("../middelware/loginValid")
const {isAuthenticatedUser}=require("../middelware/auth")
const Users = require("../model/User");
const Token=require("../model/token")
const joi=require("joi");
const bcrypt=require("bcrypt")


//REGISTER
router.post("/register", validRegister ,User.register);
//LOGIN
router.post('/login',validLogin ,User.login );
// verify token
router.get("/:id/verify/:token" , User.verifyEmail)
// passworde Reset
router.post("/resetpassword" , User.resetPassword)
// verify url 
router.get("/:id/:token" , async(req,res)=>{
    try {
        
        const user =await Users.findOne({_id:req.params.id})
        if(!user) return res.status(400).json({msg:"Invalid Link 1)"})
         const token=await Token.findOne({
            userId:user._id ,
            token:req.params.token
         })
         if(!token) return res.status(400).json({msg:"Invalid Link 2"})
         res.status(200).json({msg:"Valid URL "})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"error"})
    }
})
//reset password
router.post("/:id/:token" ,async(req,res)=>{
    try {
         const passwordSchema=joi.object({
            password:joi.string().required().label("Password")
         })
         const {error}=passwordSchema.validate(req.body)
         if(error) return res.status(400).json({msg:error.details[0].message})
           

         const user =await Users.findOne({_id:req.params.id})
        if(!user) return res.status(400).json({msg:"Invalid Link 1)"})
         const token=await Token.findOne({
            userId:user._id ,
            token:req.params.token
         })
         if(!token) return res.status(400).json({msg:"Invalid Link 2"})

        if(!user.verified)  user.verified = true

         const hashPassword=await bcrypt.hash(req.body.password ,10)

         user.password=hashPassword
         await user.save()
         await token.remove()
         res.status(200).json({msg:"password reset successfully " , user})

    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"error"})
    }
})
// updaet password
router.put("/update-password",isAuthenticatedUser ,User.updatePassword)
module.exports = router;
