import { model, Schema } from "mongoose";

const studentSchema = new Schema({
  year: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    default: "",
  },
  batch : {
    type : String  ,
    required : true ,
    default : "",
  } ,
  data : [
    {
      rollNo: {
        type: Number,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: 30,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
      marks: {
        type: Number,
        default: 0,
      },
      isAbsent: {
        type: Boolean,
        default: false  ,
      },
    }

  ]

  
});

const Student = model("Student", studentSchema);

export default Student;
