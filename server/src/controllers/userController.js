const jwt = require("jsonwebtoken");
const  bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const { isValid , isValidName , isValidEmail, isValidPassword , isValidContact} = require("../utils/validator");
const { mongoose } = require("mongoose");


// Signup User (Manual)
const signupUser = async( req, res) => {
    try {
        let data = req.body;
        let { name, email, phone , password   , authProvider } = data;

       // Validtion
        if(!data || Object.keys(data).length === 0){
            return res.status(400).json({ msg: "Bad Request ! No Data Provided."});
        }
         
        
        if(!isValid(authProvider)){
            return res.status(400).json({ msg:  "Auth  Provider is Required"})
        }

        if(!["google" , "phone" , "manual"].includes(authProvider)){
            return res.status(400).json({ msg:  " Invalid Auth  Provider "})

        }
        
        if(authProvider !== "manual"){
              return res.status(400).json({ msg: "Use Respective login API for google or OTP Authentication" });

        }

        if(authProvider === "manual"){
            // Name Validation
            if (!isValid(name)) {
              return res.status(400).json({ msg: "Name is Required" });
            }
        
            if (!isValidName(name)) {
              return res.status(400).json({ msg: "Invalid Name" });
            }
        
            // Email Validation
            if (!isValid(email)) {
              return res.status(400).json({ msg: "Email is Required" });
            }
        
            if (!isValidEmail(email)) {
              return res.status(400).json({ msg: "Invalid Email" });
            }
        
            let duplicateEmail = await userModel.findOne({ email });
        
            if (duplicateEmail) {
              return res.status(400).json({ msg: "Email Already Exists" });
            }
        
            // Contact Number Validation
            if (!isValid(phone)) {
              return res.status(400).json({ msg: "Contact Number is Required" });
            }
        
            if (!isValidContact(phone)) {
              return res.status(400).json({ msg: "Invalid Contact Number" });
            }
        
            let duplicatePhone = await userModel.findOne({ phone });
            if (duplicatePhone) {
              return res.status(400).json({ msg: "Contact Number Already Exists" });
            }


              // Password Validation
                if (!isValid(password)) {
                  return res.status(400).json({ msg: "Password is Required" });
                }
            
                if (!isValidPassword(password)) {
                  return res.status(400).json({ msg: "Invalid Password" });
                }
            
                let hashedPassword = await bcrypt.hash(password, 10);
                data.password = hashedPassword;

            }
 
        data.role = "user";

        let userCreated = await userModel.create(data)
            return res.status(201).json({ msg:  "User Registered Successfully" , userData: userCreated});


    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};


// Login User (Manual)
const loginUser = async( req, res) => {
    try {
        
        let  data = req.body;

        // Validation
         if(!data || Object.keys(data).length === 0){
            return res.status(400).json({ msg: "Bad Request ! No Data Provided."});
        }
         
        let {email , password , authProvider} = data;
        
        if(!isValid(authProvider)){
            return res.status(400).json({ msg:  "Auth  Provider is Required"})
        }

         if(authProvider !== "manual"){
              return res.status(400).json({ msg: "Use Respective login API for google or OTP Authentication" });

        }

         if (!isValid(email) || !isValidEmail(email)) {
              return res.status(400).json({ msg: "Email is Missing or Invalid" });
            }

         if(!isValid(password)){
              return res.status(400).json({ msg: "Password is required" });
            
         }

         let user = await userModel.findOne({ email}).select("+password");

         if(!user){
              return res.status(404).json({ msg: "User Not Found" });
         }

         if(user.authProvider !== "manual"){
              return res.status(400).json({ msg: `This Email is Registered Using ${user.authProvider}login` });

         }
         let isPasswordMatch = await bcrypt.compare(password , user.password);

         if(!isPasswordMatch){
              return res.status(401).json({ msg: "Incorrect password" });

         }

         let token = jwt.sign(
            {
                userId: user._id,
                role: user.role,

            },
            
                process.env.JWT_SECRET_KEY,
                {
            expiresIn: "24h",
                }
         );
              return res.status(200).json({ msg: "Login Successfully" , token });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};


// OTP Login
const otpLogin = async( req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};

// Google Login
const  googleLogin  = async( req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};

// Get user Profile
const getUserProfile = async( req, res) => {
    try {
        

        let userId = req.userId;

        if(!userId){
            return res.status(400).json({ msg: "User Id  is Required"});
        }

        let user = await userModel.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({msg: "User Not Found"});
        }

        return res.status(200).json({ msg:"User Profile Fetched  Successfully ", data: user});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};

// Get All User ( Admin , Provider)
const getAllUser = async( req, res) => {
    try {
        
        if(req.userRole !== "admin"){
            return res.status(403).json({ msg: "Access Denied ! Admin Only "})
        }

        let users = await userModel.find().select("-password").sort({ createdAt: -1});

        if(!users ||users.length === 0){
      return res.status(404).json({msg: "No Users Found"});
        }

        return res.status(200).json({msg: "Users Fetched Successfully", totalUsers: users.length , data :users ,})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};

// Update User Profile
const updateUserProfile = async( req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};


// Delete User
const deleteUser  = async( req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};


// Change Password
const changePassword = async( req, res) => {
    try {
        
        let userId=req.userId;
        let {oldPassword,newPassword}=req.body;

           if (!isValid(oldPassword)) {
             return res.status(400).json({ msg: "old Password is Required" });
           }

           if (!isValid(newPassword)) {
             return res.status(400).json({ msg: "new Password is Required" });
           }
           if (!isValidPassword(newPassword)) {
             return res.status(400).json({ msg: "Invalid new Password" });

           }
            
           let user=await userModel.findById(userId).select("+password")

           if (!user){
            return res.status(404).json({msg:"user not found"})



           }
           if (user.authProvider!=="manual"){
            return res.status(400).json({msg:"Password change is only for manuaal login user"})
           }
           let PasswordMatch =await bcrypt.compare(oldPassword,user.password)
           if (!PasswordMatch){
            return res.status(401).json({msg:"old password is incorrect"})
           }
           let hashedNewPassword=await bcrypt.hash(newPassword,10)
           user.password=hashedNewPassword

           await user.save()
           return res.status(200).json({msg:"password Change Successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};


const blockUnblockUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    let {isBlocked} = req. body;
     
    if(!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({msg: "Invalid user id"});
    }

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({msg: "IsBlocked Must be a Boolean value"});
    }

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({msg: "Usre Not Found"});
    }

     if (user.role === "admin") {
      return res.status(403).json({msg: "Adim Cannot be Blocked"});
     }

     user.isBlocked = isBlocked

     await user.save();

    return res.status(200).json({msg: `User ${isBlocked ? "Blocked" : "Unblo"} Successfully`});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" , error});
    }
};




module.exports = {
    signupUser,
    loginUser,
    otpLogin,
    googleLogin,
    getUserProfile,
    getAllUser,
    updateUserProfile,
    deleteUser,
    blockUnblockUser,
    changePassword,
}
