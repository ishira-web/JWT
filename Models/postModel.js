import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title : {
        typeof : String,
        required : [true,"Title Required !"],
    },
    description : {
        typeof : String,
        required : [true,"Description Required !"],
        trim : true
    },
    userID : {
        typeof : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
});

module.exports = mongoose.model("Posts",postSchema);