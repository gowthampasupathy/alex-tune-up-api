const Service = require('../models/Service');
const Bookings = require('../models/Bookings');
const nodemailer=require('nodemailer')
const Users = require('../models/Users');
const jsonwebtoken=require('jsonwebtoken')

//To Verify User
exports.ChechUser=async(req,res)=>{
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ status: "Unauthorized" });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.json({ status: "Token Missing" });
  }
    const decoded = jsonwebtoken.verify(token, "jwt-secret-key");
    if (decoded.role === "user") {
      return res.json({ status: "Success" });
    } else {
      return res.json({ status: "Not User" });
    }
}

//TO Save Service Service information
exports.SaveServiceData=async(req,res)=>{
    const{name,bikenumber,mobilenumber,startdate,enddate,service,totalcost,status,email}=req.body
    await sendmail(email,name,mobilenumber,bikenumber,enddate)
    await Bookings.create({name:name,email:email,mobilenumber:mobilenumber,bikenumber:bikenumber,serviceplan:service,recieveddate:startdate,deliverydate:enddate,cost:totalcost,status:status})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//To Get no of days and cost for service
exports.getservicedays=async(req,res)=>{
    const servicetitle=req.params.title;
    Service.find({servicetitle:servicetitle})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
}
//Get user email by id
exports.getemail=async(req,res)=>{
  const id=req.params.userid
  Users.findById(id)
  .then((result)=>res.json(result.email))
  .catch((error)=>res.json(error))
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
 async function sendmail(email,name,mobilenumber,bikenumber,enddate) {
  console.log("emial sending")
    const info = await transporter.sendMail({
      from: email, 
      to: '717821f116@kce.ac.in', 
      subject: "Hello !!! New Booking Received" , 
      html:`<b>Order Information</b>
      <h1>Name:${name}</h1><h1>Mobile Number:${mobilenumber}</h1>
      <h1>Bike Number:${bikenumber}</h1><h1>Delivery Date:${enddate}</h1>`,
    });
    console.log("Message sent: %s", info.messageId);
  }

  //Get User Information
  exports.getUserinfo=async(req,res)=>{
    const id=req.params.userid
    Users.findById(id)
  .then((result)=>res.json(result))
  .catch((error)=>res.json(error))
  }
  //Get User Booking History
  exports.getBookinghistory=async(req,res)=>{
    const id=req.params.id;
    const user=await Users.findById(id)
    Bookings.find({email:user.email})
    .then((result)=>res.json(result))
    .catch((error)=>res.json(error))
  }
