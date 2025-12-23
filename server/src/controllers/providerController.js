const mongoose=require("mongoose")
const providerModel=require("../models/providerModel")
const userModel=require("../models/userModel")
const {isValid}=require("../utils/validator")

// apply ass provider
const applyAsProvider=async(req,res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
}
module.exports={applyAsProvider}
