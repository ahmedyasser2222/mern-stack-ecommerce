const nodeMailer=require("nodemailer")

module.exports=async(email ,subject , text)=>{
    try {
         const transport=nodeMailer.createTransport({
            host:process.env.HOST ,
            service:process.env.SERVICE,
            port:Number(process.env.EMAIL_PORT) ,
            secure:Boolean(process.env.SECURE) ,
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
         });
         await transport.sendMail({
            from:process.env.USER,
            to:email ,
            subject:subject,
            text:text
         });
         console.log("email send Successfuly")
    } catch (error) {
        console.log("email NOT send Successfuly")
        console.log(error)
    }
}