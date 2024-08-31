const jwt=require("jsonwebtoken");
require('dotenv').config();
const User=require("../models/User")

exports.auth=async(req,res,next)=>{
    try{
const token=req.cookies.token||req.body.token||req.header("Authorisation").replace("Bearer ",""); 
if(!token){
    return res.status(401).json({
        success:false,
        message:"Token is Missing "
    })
}

try{
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode);
    req.user=decode;
}catch{
    return res.status(401).json({
        success:false,
        message:"token is invalid",
     }) 
} 
next();
    }catch(error){
       return res.status(401).json({
        success:false,
        message:"Something Went Wrong ,Try Again"
       })  
    }
}


exports.isStudent=async(req,res,next)=>{
    try{
           if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"You are not a Student"
                });

                
           }
           next();
    }catch{
return res.status(500).json({
    success:false,
    message:"User Role Cannot be Verified"
})
    }
} 

exports.isInstructor=async(req,res,next)=>{
    try{
           if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"You are not a Instructor"
                });

                
           }
           next();
    }catch{
return res.status(500).json({
    success:false,
    message:"User Role Cannot be Verified"
})
    }
}

xports.isAdmin=async(req,res,next)=>{
    try{
           if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"You are not a Admin "
                });

                
           }
           next();
    }catch{
return res.status(500).json({
    success:false,
    message:"User Role Cannot be Verified"
})
    }
}