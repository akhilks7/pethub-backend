// 1. express
const express = require("express")
const { registercontroller, loginController } = require("./controller/usercontroller")
const { addnewpetController } = require("./controller/petontroller")
const adminjwtMiddleware = require("./middleware/adminjwtmiddleware")

const router =express.Router()

// ------------common------------------
// register
router.post("/register", registercontroller)

// login
router.post("/login", loginController)

// -------------admin-------------

router.post("/addnewpet",adminjwtMiddleware,addnewpetController)


module.exports = router 