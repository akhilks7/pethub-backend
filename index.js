/// import env
require("dotenv").config()

// 1. express
const express = require("express")

// 2.USE express
const pethubserver = express()

// 3. port
const port = 3000

//4. tell server to listen
pethubserver.listen(port,()=>{
    console.log(`running at ${port}`); 
})

// 5.import cors
const cors =require("cors")

// 6.tell server to use cors
pethubserver.use(cors())

// connecting db
require("./db/connection")


// tell server to convert data to json 
pethubserver.use(express.json())

// 
pethubserver.get("/",(req,res)=>{
    res.status(200).send(`running sucessfully and waiting`)
})

// import router
const router =require("./router")

// telling server to use this router
pethubserver.use(router)
