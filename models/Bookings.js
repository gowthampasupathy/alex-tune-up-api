const mongoose =require('mongoose')

const bookingSchema =mongoose.Schema({
    name:String,
    mobilenumber:String,
    email:String,
    bikenumber:String,
    serviceplan:[String],
    recieveddate:String,
    deliverydate:String,
    cost:Number,
    status:String,
})
module.exports=mongoose.model("Bookings",bookingSchema)