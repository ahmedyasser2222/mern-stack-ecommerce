const Order=require("../model/Order")
const Product=require("../model/Products")

const asyncErrorPattern=require("../middelware/asyncError");
const ErrorHander=require("../utile/errorhandler")


const setOrder=asyncErrorPattern(
    async(req,res,nxt)=>{
        req.body.userId = req.user._id
        await new Order(req.body).save()
        res.status(200).json({message:"Order Successfully"})
    }
)
const getAllOrdersbyAdmin=asyncErrorPattern(
    async(req,res,nxt)=>{
        const orders=await Order.find({})
        if(!orders)  nxt(new ErrorHander("Not Found orders",401))
        
        let products=[]
        for(let i=0 ; i<orders.length ; i++){
            let list=[]
            for(let j=0 ; j<orders[i].products.length ; j++){
                let p=await Product.findById(orders[i].products[j].productId)
                list.push(p)
            }
            products[i]=list
        }
        res.status(200).json({orders ,products})
    }
)
const deleteOrder=asyncErrorPattern(
    async(req,res,nxt)=>{
         const order =await Order.findOneAndDelete({_id:req.params.id})
         if(!order) return nxt(new ErrorHander("Order not found",401))
         res.status(200).json({message:"Order deleted , Successfully"})
    }
)
const getMyOrders=asyncErrorPattern(
    async(req,res,nxt)=>{
        const orders=await Order.find({userId:req.user._id}).exec()
        if(!orders) return nxt(new ErrorHander("you not have orders",401))
        let products=[]
        for(let i=0 ; i< orders.length || 0 ;i++){
            let p=[]
            for(let j=0 ; j < orders[i].products.length ; j++){
                let product=await Product.findById(orders[i].products[j].productId)
                 p.push(product)                  
            }
            products[i]=p
        }
      
        res.status(200).json({message:"success" , orders ,products})
    }
)


module.exports={setOrder , getAllOrdersbyAdmin ,deleteOrder , getMyOrders}