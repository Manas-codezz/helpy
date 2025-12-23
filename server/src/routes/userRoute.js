const express = require("express");
const router = express.Router();
const {  
    signupUser,
    loginUser,
    otpLogin,
    googleLogin,
    getUserProfile,
    getAllUser,
    updateUserProfile,
    deleteUser,
    blockUnblockUser,
    changePassword,} = require("../controllers/userController");
    let authentication = require("../middlewares/authMiddleware");
    let authorization = require("../middlewares/authorization")


    // Public Routes
    router.post("/signup" , signupUser);
    router.post("/login" , loginUser);
    router.get("/profile", authentication , getUserProfile);
    router.get("/allUsers" , authentication, authorization("admin") , getAllUser)

// block unblock user
router.put("/user/block/:userId",
    authentication,authorization("admin"),
    blockUnblockUser
)
router.put("/change-password",authentication,changePassword)

    module.exports = router;



    
