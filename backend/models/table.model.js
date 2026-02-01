import { model, Schema } from "mongoose";

const tableSchema = new Schema(
  {
    tableId: {
      type: String,
      unique: true,
    },
    year: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
      default: "",
    },
    data: [
      {
        rollNo: {
          type: String,
          required: true,
          unique: true,
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
          type: [Number],
          default: [0, 0, 0],
          validate: {
            validator: function (arr) {
              return (
                arr.length === 3 &&
                arr.every((mark) => mark >= 0 && mark <= 100)
              );
            },
            message:
              "Marks must be an array of exactly 3 numbers between 0 and 100",
          },
        },
        isAbsent: {
          type: Boolean,
          default: false,
        },
        techerAssignedEmail: {
          type: String,
          default: "",
        },
      },
    ],
    isPending: {
      type: String,
      default: true,
    },
  },
  { timestamps: true },
);

const Table = model("Table", tableSchema);

export default Table;
