const Validator=require("../utile/register")

module.exports=(req ,res ,nxt)=>{
    const valid=Validator(req.body)
    if(!valid) return res.status(401).json({msg:"Data Not Valid"})
    nxt()
}