const validator=require("../utile/product")
module.exports=(req,res,nxt)=>{
    req.body.price =parseInt(req.body.price)
    req.body.amount =Number(req.body.amount)
    const valid=validator(req.body)    
    if(!valid) return res.status(401).json({msg:"Data not valid"})

    nxt()
}