import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Required !"],
      unique: [true, "Email must be unique !"],
      trim: true,
      minLength: [5, "Email must have 5 characters !"], 
      lowercase: true,
    },
    password: {
      type: String, 
      required: [true, "Password must be Required !"],
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean, 
      default: false,
    },
    verificatioCode: {
      type: String, 
      select: false,
    },
    verificatioCodeValidation: {
      type: String, 
      select: false,
    },
    fogotPassCode: {
      type: String, 
      select: false,
    },
    fogotPassCodeValidation: {
      type: Number, 
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;