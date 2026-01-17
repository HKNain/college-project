import Student from "../models/student.model.js";

export const createNewStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, rollNo, year, branch } = req.body;

    const existingStudent = await Student.findOne({ rollNo });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student already exists", flag: false });
    }

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      rollNo,
      year,
      branch,
    });

    const savedStudent = await newStudent.save();

    return res.status(201).json({
      message: "Student created successfully",
      data: savedStudent,
      flag: true,
    });
  } catch (error) {
    console.log("Error in createNewStudent controller", error.message);
    return res
      .status(501)
      .json({
        message: "Internal server error  Account Not Created !",
        flag: false,
      });
  }
};

export const editExistingStudent = async (req, res) => {
  try {
    const { rollNo, ...updatedFields } = req.body;

    const existingStudent = await Student.findOne({ rollNo });
    if (!existingStudent) {
      return res.status(404).json({
        message: "Student not found",
        flag: false,
      });
    }

    let isChanged = false;

    for (let key in updatedFields) {
      if (
        updatedFields[key] !== undefined &&
        existingStudent[key] != updatedFields[key]
      ) {
        existingStudent[key] = updatedFields[key];
        isChanged = true;
      }
    }

    if (!isChanged) {
      return res.status(200).json({
        message: "No changes detected",
        flag: false,
      });
    }

    await existingStudent.save();

    return res.status(200).json({
      message: "Student updated successfully",
      flag: true,
      data: existingStudent,
    });
  } catch (error) {
    console.error("Error in editExistingStudent controller:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};

export const deleteExistingStudent = async (req, res) => {
  try {
    const { rollNo } = req.body;

    if (!rollNo) {
      return res.status(400).json({
        message: "rollNo is required",
        flag: false,
      });
    }

    const deletedStudent = await Student.findOneAndDelete({ rollNo });

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
      flag: true,
      data: deletedStudent,
    });
  } catch (error) {
    console.error("Error in deleteExistingStudent controller:", error);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};
