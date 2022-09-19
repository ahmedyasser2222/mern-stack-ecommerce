const Ajv=require("ajv")
const ajv=new Ajv()

const schema={
    type:"object",
    properties:{
        name:{
            type:"string",
            maxLength:15,
            minLength:3
        },
        email:{
            type:"string",
        },
        password:{
            type:"string"
        }
    },
    required:["email" , "name" , "password"]
}
module.exports=ajv.compile(schema)