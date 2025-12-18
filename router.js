// 1. express
const express = require("express")
const { registercontroller, loginController } = require("./controller/usercontroller")
const { addnewpetController, getallAdminsellpets, updatesellpetController } = require("./controller/petontroller")
const adminjwtMiddleware = require("./middleware/adminjwtmiddleware")

const router =express.Router()

// ------------common------------------
// register
router.post("/register", registercontroller)

// login
router.post("/login", loginController)

// -------------admin-------------
// add selling pets
router.post("/addnewpet",adminjwtMiddleware,addnewpetController)

// get all selling pets
router.get("/admin-sell-pets",adminjwtMiddleware,getallAdminsellpets)
// update selling pets
router.put("/admin-update-sell-pets",adminjwtMiddleware,updatesellpetController)

module.exports = router 