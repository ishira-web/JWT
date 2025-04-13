import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title : {
        type : String,
        required : [true,"Title Required !"],
    },
    description : {
        type : String,
        required : [true,"Description Required !"],
        trim : true
    },
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
});

module.exports = mongoose.model("Posts",postSchema);