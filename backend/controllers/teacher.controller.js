import User from "../models/user.models";
import sendEmail from "../utils/sendEmail";

export const getTeachersList = async (req, res) => {
  try {
    const teachers = await User.find({role : "teacher"});

    if(teachers.length == 0){
        return res.status(404).json({
        message: "No teachers found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Teachers fetched successfully",
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.log("Error in getTeachersList", error.message);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};

export const sendTeacherMail = async (req, res) => {
  try {
    const { email, name } = req.body;

    await sendEmail({
      to: email,
      subject: "",
      text: ``,
      html: ``,
    })

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("Error in sendTeacherMail", error.message);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
}
