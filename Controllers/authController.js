import { signinSchema, signupSchema } from "../Middlewares/validator.js";
import {doHash, doHashValidation} from '../Utils/hashing.js';
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import {transport} from '../Middlewares/sendMail.js';
import {createHmac} from 'crypto';

export const signup =  async(req,res)=>{
   const {email,password} = req.body;
   try {
      const{error,value} = signupSchema.validate({email,password});
      if(error){
        return res.status(401).json({success : false, message : error.details[0].message});
      }
      const existingUser = await User.findOne({email});
      if(existingUser){
        return res.status(401).json({success:false, message: "User Already exist !"});
      }
      const hashedPassword = await doHash(password,12);


      const newUser = new User ({
        email,
        password : hashedPassword,
      });

      const result = await newUser.save();
      result.password = undefined;
      res.status(200).json({
        success: true , message:"Your account has been created !",result
      });
   } catch (error) {
    console.log(error)
   }
}


export const signin =  async(req,res)=>{
    const {email , password} = req.body;
    try {
        const {error,value} = signinSchema.validate({email,password});
        if(error){
            return res.status(401).json({success : false, message : error.details[0].message});
        }
        const existingUser = await User.findOne({email}).select('+password');
        if(!existingUser){
        return res.status(401).json({success:false, message: "User does not exist!"});
        }
        const result = await doHashValidation(password ,existingUser.password);
        if(!result){
           return res.status(401).json({success:false, message : "invalid credentials !"});
        }
        const token  = jwt.sign({
            userId : existingUser._id,
            email : existingUser.email,
            verified : existingUser.verified         
          },process.env.TOKEN_SECRET,{
            expiresIn : '8h',
        });

          res.cookie('Authorization','Bearer'+token,{ expires:new Date(Date.now()+8*3600000),httpOnly:process.env.NODE_ENV==='production',secure:process.env.NODE_ENV==='production'})
          .json({
            success:true,
            token,
            message : 'logged in successfully'
          })
    } catch (error) {
        console.log(error);
    }
}

export const signout = async(req,res)=>{
    res.clearCookie('Authorization').status(200).json({success:true,message:'Logged out Successfully'})
}

// export const sendVerificationCode = async(req,res)=>{
//     const {email} = req.body;
//     try {
//         const existingUser = await User.findOne({email});
//         if(!existingUser){
//             return res.status(404).json({success:false, message: "User does not exist!"});
//             };
//         if(existingUser.verified){
//             return res.status(400).json({success:true , message:"You are already verified !"})
//         }
//         const codeValue = Math.floor(Math.random()*1000000).toString();
//         let info = await transport.sendMail({
//             from : process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//             to : existingUser.email,
//             subject: "Verification Code ",
//             html : '<h1>'+codeValue+'</h1>'
//         });
//         if (info.accepted[0]=== existingUser.email) {
//             const hashedCodeValue = hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE);
//             existingUser.verificationCode = hashedCodeValue;
//             existingUser.verificationCodeValue = Date.now();
//             await existingUser.save();
//             return res.status(200).json({success:true,message:'Code Sent !'});
//         }
//         res.status(400).json({success:false , message:'Code sent failed!'});
//     } catch (error) {
//         console.log(error);
//     }
// }

export const sendVerificationCode = async(req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User does not exist!" });
        }
        
        if (existingUser.verified) {
            return res.status(400).json({ success: true, message: "You are already verified!" });
        }
        
        // Generate verification code
        const codeValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        try {
            // Send email with better error handling
            let info = await transport.sendMail({
                from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
                to: existingUser.email,
                subject: "Verification Code",
                html: `<h1>Your verification code is: ${codeValue}</h1>
                      <p>This code will expire in 30 minutes.</p>`
            });
            
            // If email sent successfully
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValue = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Verification code sent!' });
            
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send verification email. Please try again later.',
                error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error processing verification request' });
    }
}

export const hmacProcess = (value,key)=>{
    const result = createHmac('sha256',key).update(value).digest('hex')
    return result;
}
