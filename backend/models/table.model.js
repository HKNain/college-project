import { model, Schema } from "mongoose";

const tableSchema = new Schema({
  tableId : {
    type : String ,
    unique : true 
  } ,
  year: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
    default: "",
  },
  // totalStudents:{
  //   type : Number ,
  //   required : true ,
  //   default :0 
  // } ,
  data : [
    {
      rollNo: {
        type: String,
        required: true,
        unique : true ,
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
      techerAssignedEmail : {
        type : String , 
        default: ""
      }
    } , 


  ] ,
  isPending : {
    type : String , 
    default : true 
  }

  
},{timestamps: true });

const Table = model("Table", tableSchema);

export default Table;
