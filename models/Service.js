const mongoose =require('mongoose')
const serviceSchema=mongoose.Schema({
    coverimageurl:String,
    detailimageurl:String,
    servicetitle:String,
    totalcost:Number,
    duration:Number,
    servicedetails:[
        {
            details:String,
            cost:Number,
        }
    ]

})
module.exports=mongoose.model("Service",serviceSchema)