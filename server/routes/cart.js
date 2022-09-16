const router=require("express").Router()
const Cart=require("../controller/cartController")
const {isAuthenticatedUser} =require("../middelware/auth")
 

router.post("/",isAuthenticatedUser, Cart.addToCart)
router.get("/count", isAuthenticatedUser , Cart.countProductsById)
router.get("/",isAuthenticatedUser ,Cart.getProducts)
router.delete("/delete/:userId/:productId" , Cart.deleteProduct)

module.exports=router