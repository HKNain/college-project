import { Schema, model } from "mongoose";


const userSchema = new Schema({
    firstName : {
        type : String ,
        required : true ,
        maxlength: 30,
    },
    lastName : {
        type : String ,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true ,
        lowercase: true,
        trim: true ,
        match : [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true ,
        select: false ,
        minlength: 6 ,
    } , 
    role: {
        type: String,
        enum : ["tester", "admin","teacher"],
        default: "teacher",
        select : "false",
    } , 
});

const User = model("User", userSchema);


export default User;