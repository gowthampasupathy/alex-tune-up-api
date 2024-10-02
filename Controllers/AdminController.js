const Users = require('../models/Users');
const bcrypt=require('bcrypt')
const jsonwebtoken=require('jsonwebtoken')
const cookieParser=require('cookie-parser');
const Service = require('../models/Service');
const Bookings = require('../models/Bookings');
const nodemailer=require('nodemailer')
const randomString=require('randomstring')
const path='./Otp.json'
const fs=require('fs');

//To Create new User
exports.createUser=async(req,res)=>{
    const {name,email,phonenumber,password,role,formatdate}=req.body;
    bcrypt.hash(password,10)
    .then(hash=>{
        Users.create({name,phonenumber,password:hash,email,role,registereddate:formatdate})
        .then((user)=>res.json("Account Created"))
        .catch((er)=>res.json(er))
    }).catch((er)=>res.json)
}
//To Verify Admin
exports.CheckAdmin=async(req,res)=>{
    const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ status: "Unauthorized" });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.json({ status: "Token Missing" });
  }
    const decoded = jsonwebtoken.verify(token, "jwt-secret-key");
    if (decoded.role === "admin") {
      return res.json({ status: "Success" });
    } else {
      return res.json({ status: "Not Admin" });
    }
  }
//To Check User Exist Or Not
exports.checkUser=async(req,res)=>{
    const {email,password}=req.body;
    Users.findOne({email:email})
    .then((result)=>{
        if(result){
            bcrypt.compare(password,result.password,(error,response)=>{
                if(response){
                    const usertoken=jsonwebtoken.sign({email:result.email,role:result.role,id:result.id},"jwt-secret-key",{expiresIn:'1d'})
                    return res.json({status:"success",role:result.role,token:usertoken,uid:result.id,useremail:result.email})
                }else{
                    return res.json("Not a valid password")
                }
            })
        }else{
            return res.json("Email Does Not Exist")
        }
    })
    .catch((error)=>{
        res.json(error)
    })

}

// Generate OTP
function generateOtp(){
    return randomString.generate({length:4,charset:'numeric'});
}

//Nodemail Transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "kumarautos105@gmail.com",
      pass: "vvma jbup dgze hkla",
    },
  });

  //Function to send mail
  async function sendotp(email,otp) {
    const info = await transporter.sendMail({
      from: 'alextuneup@gmail.com', 
      to: email, 
      subject: "Gmail Verification OTP", 
      text: `Please Enter this OTP = ${otp} for verify your gmail`,
    });
    console.log("Message sent: %s", info.messageId);
  }
// Save OTP and email
function storeOtp(email, otp) {
    let data = {};
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    }
    data[email] = otp;
    fs.writeFileSync(path, JSON.stringify(data));
}

// Get OTP and email
function getOtp() {
    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path));
    }
    return {};
}

// Request OTP
exports.requestOtp = async (req, res) => {
     const { email } = req.body; 
    // const email="717821f116@kce.ac.in"
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const otp = generateOtp();
    await sendotp(email,otp);
    storeOtp(email, otp);
    res.json("Email Sent To User")
};
//TO Verify OTP
exports.verifyOtp=async(req,res)=>{
     const {email,otp}=req.body
    const myotp=getOtp()
    console.log(req.body)
    const userotp=String(otp).trim()
    if(!myotp.hasOwnProperty(email)){
        return res.json("Email Not Found")
    }
    if(myotp[email]===userotp){
        delete myotp[email]
        fs.writeFileSync(path, JSON.stringify(myotp));
        res.json("OTP Verified")
    }else{
        res.json("OTP not valid")
    }
}

//TO Create New Service
exports.createService=async(req,res)=>{
    const{imageurl,serviceTitle,cost,duration,details}=req.body;
    Service.create({imageurl:imageurl,serviceTitle:serviceTitle,cost:cost,duration:duration,details:details})
    .then((result)=>res.json("service created"))
    .catch((error)=>res.json(error))
}
//Get All Service Details
exports.getallService=async(req,res)=>{
    Service.find({})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//Get One Service Details
exports.getoneService=async(req,res)=>{
    const id=req.body
    Service.find({id:id})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
// Delete One Service By Id
exports.deleteService=async(req,res)=>{
    const {id}=req.params
    Service.findByIdAndDelete(id)
    .then((result)=>res.json("Service Deleted Successfully"))
    .catch((error)=>res.json(error))
}

//Update Service by Id
exports.updateService=async(req,res)=>{
    const id=req.params.id
    const{service}=req.body;
    const oldservice =await Service.findById(id)
    if(!oldservice){
        return res.json("Service Not Found")
    }
    oldservice.coverimageurl=service.coverimageurl
    oldservice.detailimageurl=service.detailimageurl
    oldservice.servicetitle=service.servicetitle
    oldservice.totalcost=service.totalcost
    oldservice.duration=service.duration
    oldservice.servicedetails=service.servicedetails
    await oldservice.save();
    return res.json("Service Updated Successfully")

}
//Get All User Information
exports.getUserinfo=async(req,res)=>{
    Users.find({role:"user"})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//Get All User Booking by status
exports.getBookingdetails=async(req,res)=>{
    const bookingstatus=req.params.bookingstatus
    Bookings.find({status:bookingstatus})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//Get All Service Details
exports.getServicedetails=async(req,res)=>{
    Service.find({})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//Get Service Details By Title
exports.getServicebyId=async(req,res)=>{
    const id=req.params.id
    Service.findById(id)
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//TO Send Mail As Service completed

async function sendcompletedmail(email) {
    const info = await transporter.sendMail({
      from: 'alextuneup@gmail.com', 
      to: email, 
      subject: "Your Bike Service Is Completed", 
      text: `Service For Your Bike Is Completed You can Take Your Bike Tomorrow`,
    });
    console.log("Message sent: %s", info.messageId);
  }

//Update Booking Status
exports.updateBookingstatus=async(req,res)=>{
    const id=req.params.id
    const {status}=req.body
    const booking=await Bookings.findById(id)
    if(!booking){
        return res.json("Booking Not Found")
    }
    booking.status=status
    await booking.save()
    if(status==="completed"){
        await sendcompletedmail(booking.email)
    }
    return res.json("Booking Updated")

}
//TO Save Service Details
exports.saveService=async(req,res)=>{
    const{coverimageurl,detailimageurl,servicetitle,duration,serviceinfo,totalcost}=req.body
    Service.create({coverimageurl:coverimageurl,detailimageurl:detailimageurl,servicetitle:servicetitle,totalcost:totalcost,duration:duration,servicedetails:serviceinfo})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}

//Get Service Details By Id
exports.getdata = async (req, res) => {
    const id = req.params.id;
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service Info Not Found" });
        }
        return res.json(service.servicedetails);
};