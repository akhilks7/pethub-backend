// 1. express
const express = require("express")
const { registercontroller, loginController, updateProfilePicture, updateProfileController, updatepasswordController, deleteuserController, updateuserstatusController } = require("./controller/usercontroller")
const { addnewpetController, getallAdminsellpets, updatesellpetController, deletesellpetController, reportfoundpetController, reportlostpetController, reportStraypetController, getallAdminDonatepets, getallAdminlostpets, getallAdminfoundpets, getallAdminUsers, getallpets, getallusersellpets, getalluserDonatepets, getalluserStraypets, getalluserlostpets, getalluserfoundpets, getalluseradoptpets, getalluserstraypets, getalluserfoundpetscount, getalluserlostpetscount, getalluserstraypetscount, reportAdoptpetController, getallAdminstrayanimals, deletepetController, updatepetstatusController, getalluserhomeadoptpets, getalluserhomesellpets, getalluserhomelostpetscount, getalluserhomefoundpetscount, updateuserpetController, makesellpetpaymentcontroller } = require("./controller/petontroller")
const adminjwtMiddleware = require("./middleware/adminjwtmiddleware")
const jwtMiddleware = require("./middleware/jwtmiddleware")
const multerConfig = require("./middleware/imagemulterMiddleware")


const router = express.Router()

// ------------common------------------
// register
router.post("/register", registercontroller)

// login
router.post("/login", loginController)

// update profile picture
router.post("/update-profile-picture", multerConfig.single("profile"), jwtMiddleware, updateProfilePicture)

// --------------------------------admin-----------------------------------------
// add selling pets
router.post("/addnewpet", multerConfig.array("uploadImages", 5), adminjwtMiddleware, addnewpetController);

// get all selling pets
router.get("/admin-sell-pets", adminjwtMiddleware, getallAdminsellpets)

// get all donate pets
router.get("/admin-donate-pets", adminjwtMiddleware, getallAdminDonatepets)

// get all lost pets
router.get("/admin-lost-pets", adminjwtMiddleware, getallAdminlostpets)

// get all found pets
router.get("/admin-found-pets", adminjwtMiddleware, getallAdminfoundpets)

// get all stary animals
router.get("/admin-stray-animals", adminjwtMiddleware, getallAdminstrayanimals)

// get all users
router.get("/admin-all-users", adminjwtMiddleware, getallAdminUsers)

// get all users
router.get("/admin-all-pets", adminjwtMiddleware, getallpets)

// update selling pets
router.put("/admin-update-sell-pets", multerConfig.array("uploadImages", 5), adminjwtMiddleware, updatesellpetController);

// delete  pets
router.delete("/admin-delete-pet", adminjwtMiddleware, deletepetController)

// delete user
router.delete("/admin-delete-user", adminjwtMiddleware, deleteuserController)

// update  pets status
router.put("/admin-update-pet-status", adminjwtMiddleware, updatepetstatusController);

// update  user status
router.put("/admin-update-user-status", adminjwtMiddleware, updateuserstatusController);

// -----------------------------user-------------------------------------
// report found pet
router.post("/report-found-pet", multerConfig.array("uploadImages", 5), jwtMiddleware, reportfoundpetController);

// report lost pet
router.post("/report-lost-pet", multerConfig.array("uploadImages", 5), jwtMiddleware, reportlostpetController);

// report stray pet
router.post("/report-stray-pet", multerConfig.array("uploadImages", 5), jwtMiddleware, reportStraypetController);

router.post("/report-adopt-pet", multerConfig.array("uploadImages", 5), jwtMiddleware, reportAdoptpetController);

// get all selling pets
router.get("/user-sell-pets", jwtMiddleware, getallusersellpets)

// get all donate pets
router.get("/user-donate-pets", jwtMiddleware, getalluserDonatepets)

// get all stray pets
router.get("/user-stray-pets", jwtMiddleware, getalluserStraypets)

// get all lost pets
router.get("/user-lost-pets", jwtMiddleware, getalluserlostpets)

// get all found pets
router.get("/user-found-pets", jwtMiddleware, getalluserfoundpets)

// Update user profile (username, bio, phone, location)
router.put("/update-profile", jwtMiddleware, updateProfileController);

router.put("/update-password", jwtMiddleware, updatepasswordController);

router.get("/user-all-pets", jwtMiddleware, getallpets);

router.get("/user-all-adopt-pets", jwtMiddleware, getalluseradoptpets);

router.get("/user-all-found-pets", jwtMiddleware, getalluserfoundpetscount);

router.get("/user-all-lost-pets", jwtMiddleware, getalluserlostpetscount);

router.get("/user-all-stray-pets", jwtMiddleware, getalluserstraypetscount);


router.get("/user-all-home-adopt-pets", jwtMiddleware, getalluserhomeadoptpets);

router.get("/user-all-home-sell-pets", jwtMiddleware, getalluserhomesellpets);

router.get("/user-all-home-lost-pets", jwtMiddleware, getalluserhomelostpetscount);

router.get("/user-all-home-found-pets", jwtMiddleware, getalluserhomefoundpetscount);

router.put("/updatepet", multerConfig.array("uploadImages", 5), updateuserpetController);

// delete  pets
router.delete("/user-delete-pet", jwtMiddleware, deletepetController)

router.put("/user-make-payment", jwtMiddleware, makesellpetpaymentcontroller);

module.exports = router 