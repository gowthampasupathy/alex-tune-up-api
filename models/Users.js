const mongoose =require('mongoose')
const usersschema=mongoose.Schema({
    name:String,
    email:String,
    phonenumber:Number,
    registereddate:String,
    password:String,
    role:String,
})
module.exports=mongoose.model("User",usersschema)