const authRouter=require("./auth")
const productRouter=require("./product")
const userRouter=require("./user")
const orderRouter=require("./order")
const cartRouter=require("./cart")


module.exports=(app)=>{
app.use("/api/auth" ,authRouter)
app.use("/api/product", productRouter)
app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)
app.use("/api/cart", cartRouter)
}