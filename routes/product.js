const router=require("express").Router()
const Product=require("../controller/productController")
const validProduct=require("../middelware/productValid")
const {isAdmin ,isAuthenticatedUser} =require("../middelware/auth")
// add product
router.post("/" ,validProduct , isAdmin , Product.addProduct)
// delete product
router.delete("/:id" ,isAdmin , Product.deleteProduct)
// get product
router.get("/:id" , Product.getProductById)
// update product
router.put("/:id" ,isAdmin , Product.updateProduct)
// get products
router.get("/" , Product.getProducts)
//
router.get("/p/filter", Product.getProductsByFilter)
router.get("/home/sort" , Product.getProductsToHome)
router.post("/s/product" , Product.getProductBySearch)

module.exports=router