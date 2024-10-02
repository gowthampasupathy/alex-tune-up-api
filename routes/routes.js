const express=require('express')
const router=express.Router()
const controller=require('../Controllers/AdminController')
const UserController=require('../Controllers/UserController')


//Sign up TO Create new Account
router.post("/signup",controller.createUser);

//Login code
router.post("/login",controller.checkUser);
//Verify User
router.get("/home",UserController.ChechUser)
//Verify Admin
router.get("/bookings",controller.CheckAdmin);

//Get All User Information
router.get("/getuser",controller.getUserinfo)
//Get All Bookings By Status
router.get("/getbookingdetails/:bookingstatus",controller.getBookingdetails)

//Get All Service Details
router.get("/getservicedetails",controller.getServicedetails)

//Get service Details By Id
router.get("/getservicebyId/:id",controller.getServicebyId)
//Update Service Details
router.put("/updateservicebyId/:id",controller.updateService)

//DElete Service By ID
router.delete("/deletebyId/:id",controller.deleteService)

// TO request OTP
router.post("/getotp",controller.requestOtp)
//TO Verify OTP
router.post("/verifyotp",controller.verifyOtp)
//Get User Email by Id
router.get("/getemail/:userid",UserController.getemail)

//TO Save Service Service information
router.post('/SaveServiceData',UserController.SaveServiceData)
//To Get no of days and cost for service
router.get("/getservicedays/:title",UserController.getservicedays)
///TO Get User Information
router.get("/getUserinfo/:userid",UserController.getUserinfo)
//TO Get User Booking History
router.get("/getBookinghistory/:id",UserController.getBookinghistory)
// TO Update Booking Status
router.put("/updateBookingstatus/:id",controller.updateBookingstatus)
//TO Save Service Details
router.post("/saveService",controller.saveService);
//TO Get Service Details By Id
router.get("/getdata/:id",controller.getdata)
module.exports = router;