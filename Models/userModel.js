import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    email :{
        typeof : String,
        required : [true,"Email is Required !"],
        unique : [true,"Email must be unique !"],
        trim :true,
        minLenght : [5,"Email must have 5 characters !"],
        lowercase : true,
    },
    password : {
        typeof : String,
        required : [true,"Password must be Required !"],
        trim : true,
        select : false
    },
    verified: {
        typeof : boolean,
        default : false
    },
    verificatioCode : {
        typeof : String,
        select : false
    },
    verificatioCodeValidation : {
        typeof : String,
        select : false
    },
    fogotPassCode : {
        typeof : String,
        select : false
    },
    fogotPassCodeValidation : {
        typeof : number,
        select : false
    }
},{
    timestamps : true
});

module.exports = mongoose.model("User",userSchema);