const jwt=require("jsonwebtoken")
const asyncErrorPattern=require("../middelware/asyncError");
const User=require("../model/User")
const Cart=require("../model/Cart")
const ErrorHander=require("../utile/errorhandler")


const isAdmin=(req,res,nxt)=>{
        const token=req.headers.token
        if(!token) res.status(401).json({msg:"no token"})
        const payload= jwt.verify(token , process.env.JWT_SEC)
        if(!payload.isAdmin) return nxt(new ErrorHander("you haveent permisen to make this operation", 400));
        nxt()
    }

const isAuthenticatedUser =async (req, res, nxt) => {
        try {
            const token = req.headers.token ;
            if (!token || token == "null")  return nxt(new ErrorHander("Please Sign In ", 402));
            const decodedData = jwt.verify(token, process.env.JWT_SEC);
            req.user = await User.findOne({_id:decodedData.id}).exec();
            if(!req.user) return nxt(new ErrorHander("User Not Found",401))
            nxt()
        } catch (error) {
            console.log(error.message)
            nxt(new ErrorHander("Interval Server Error !" , 500))
        }
      }



module.exports={isAdmin , isAuthenticatedUser}