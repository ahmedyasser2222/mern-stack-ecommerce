const router=require("express").Router()
const  Order=require("../controller/orderController")
const {isAuthenticatedUser , isAdmin} =require("../middelware/auth")

router.post("/" , isAuthenticatedUser, Order.setOrder )         // make order
router.get("/" ,isAdmin ,Order.getAllOrdersbyAdmin )            // get all order by admin 
router.delete("/:id" , isAuthenticatedUser , Order.deleteOrder) // delete order by user or admin 
router.get("/user" ,isAuthenticatedUser , Order.getMyOrders )   // get order by user 


module.exports=router
