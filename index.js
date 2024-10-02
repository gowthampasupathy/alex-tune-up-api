const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser = require('cookie-parser')
const routes=require('./routes/routes')
const url="mongodb+srv://Gowtham:6374013119@cluster0.ki41eq9.mongodb.net/Bikeservice?retryWrites=true&w=majority"
mongoose.connect(url).then(()=>{
    const app=express()
    app.use(cors({
        origin:["http://localhost:3000","https://alextuneup.vercel.app/"],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }))
    app.use(express.json())
    app.use("/",routes)
    app.listen(3001,()=>{
        console.log("Success")
    })
})



