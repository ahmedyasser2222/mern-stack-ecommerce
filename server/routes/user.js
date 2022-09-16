const router=require("express").Router()
const User=require("../controller/userController")
const {isAdmin ,isAuthenticatedUser}=require("../middelware/auth")

// delete product
router.delete("/:id" ,isAdmin , User.deleteUser)
// get User
router.get("/:id" ,isAdmin , User.getUserById)
// update User
router.put("/:id" ,isAuthenticatedUser , User.updateUser)
// get Users
router.get("/" ,isAdmin , User.getUsers)
// get count 
router.get("/c/count", isAdmin ,User.countUser)
// get profile
router.get("/me/profile" ,isAuthenticatedUser , User.getProfile)
// get user by search
router.post("/s/user"  , User.getUserBySearch)



module.exports=router