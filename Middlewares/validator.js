import Joi from "joi";


export const signupSchema = Joi.object({

    email : Joi.string().min(6).max(60).required().email({
        tlds: {allow :["com","net"]}
    }),
    password : Joi.string().required().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
});


export const signinSchema = Joi.object({

    email : Joi.string().min(6).max(60).required().email({
        tlds: {allow :["com","net"]}
    }),
    password : Joi.string().required().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
});