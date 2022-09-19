const Ajv=require("ajv")
const ajv=new Ajv()

const schema={
    type:"object",
    properties:{
        title: { type: "string", minLength:3  },
        desc: { type: "string", minLength:10 },
        categories: { type: "array" },
        size: { type: "string" },
        color: { type: "string" },
        price: { type: "number"  },
        amount: { type: "integer" }
    },
    required:["title" , "desc" ,"categories" ,"size" , "color" ,"price" ,"amount"]
}
module.exports=ajv.compile(schema)

