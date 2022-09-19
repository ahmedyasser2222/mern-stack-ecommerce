const Cart=require("../model/Cart")
const Product=require("../model/Products")
const asyncErrorPattern=require("../middelware/asyncError")
const ErrorHander=require("../utile/errorhandler")
// return nxt(new ErrorHander("Product not added", 404));

const addToCart=asyncErrorPattern(
    async(req,res,nxt)=>{
        const userCart=await Cart.findOne({userId : req.user._id})
        if(!userCart){
                await  new Cart({userId:req.user._id , products :req.body.products}).save()
                res.status(200).json({message:"Successfull"})  
        }
        let products=userCart.products
        for(let i=0 ; i <products.length ; i++){
            if(products[i].productId == req.body.products[0].productId)
            return nxt(new ErrorHander("this product already exist in cart", 400));
        }
        products.push(...req.body.products)
        userCart.products = products
        await userCart.save()
        res.status(200).json({message:"Successfull"})
    }
)
const countProductsById=asyncErrorPattern(
    async(req,res,nxt)=>{
        const countUserCart=await Cart.findOne({userId:req.user._id})
        if(!countUserCart) return nxt(new ErrorHander("Not Found User", 400));
        res.status(200).json({count:countUserCart.products.length , message:"successfully"})
     }
)
const getProducts=asyncErrorPattern(
    async(req,res,nxt)=>{
        const products=[]
        console.log(req.user)
        const data=await Cart.findOne({userId : req.user._id})
        if(!data) return nxt(new ErrorHander("Not Found Products",401))
        for(let i=0 ; i < data.products.length ; i++){
         const product =await Product.findById(data.products[i].productId) 
         if(product)
          products.push({productId:product._id , image:product.image , title:product.title , price:product.price ,quantity:1})
        }
        res.status(200).json(products)
    }
)
const deleteProduct=asyncErrorPattern(
    async(req,res,nxt)=>{
        const cartUser=await Cart.findOne({userId : req.params.userId})
        if(!cartUser) return nxt(new ErrorHander("User not have ProductS",401))
        if(cartUser.products.length === 1){
          const user= await Cart.findOneAndDelete({userId : req.params.userId})
          if(!user) return nxt(new ErrorHander("Faild to delete Product ",400))
            res.status(200).json({message:"Product deleted , Successfully"})
        }
        for(let i=0 ; i < cartUser.products.length ; i++){
            if(cartUser.products[i].productId == req.params.productId){
                    cartUser.products.splice(i,1)
                     await  cartUser.save()
                     res.status(200).json({message:"Product deleted , Successfully"})
            }
        }
        res.status(401).json({message:"product not found"})
    }
)

module.exports={addToCart ,countProductsById ,getProducts , deleteProduct}