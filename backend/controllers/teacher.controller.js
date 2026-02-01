import Table from "../models/table.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

export const getTeachersList = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select(
      "firstName lastName email",
    );

    if (teachers.length == 0) {
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
    const { email, teacherName, students } = req.body;

    const studentList = students
      .map(
        (student) =>
          `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${student.rollNo}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${student.firstName} ${student.lastName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${student.email}</td>
        </tr>`,
      )
      .join("");

    const htmlContent = `
      <h2>Hello ${teacherName} Sir,</h2>
      <p>You have been assigned to evaluate the following students:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Roll No</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Email</th>
          </tr>
        </thead>
        <tbody>
          ${studentList}
        </tbody>
      </table>

      <p>Please login to the dashboard and enter their marks.</p>
      <p><a href="http://localhost:5173/login">http://localhost:5173/login</a></p>
      <p>Best regards,<br>College Management System</p>
    `;

    await sendEmail({
      to: email,
      subject: `Student assigned - ${students.length} Students`,
      text: `You have been assigned ${students.length} students for evaluation.`,
      html: htmlContent,
    });

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
};

export const sendStudentMarks = async (req, res) => {
  try {
    const { tableId, studentMarksData } = req.body;

    // Allow single object or array of objects
    const updates = Array.isArray(studentMarksData)
      ? studentMarksData
      : studentMarksData
        ? [studentMarksData]
        : [];

    if (!tableId || updates.length === 0) {
      return res.status(400).json({
        message: "Invalid request body. tableId and studentMarksData required",
        flag: false,
      });
    }

    const table = await Table.findOne({ tableId });
    if (!table) {
      return res.status(404).json({
        message: "Table not found",
        flag: false,
      });
    }

    let updatedCount = 0;
    const errors = [];

    for (const marksData of updates) {
      const { rollNo, marks, isAbsent } = marksData;

      if (rollNo === undefined) {
        errors.push(`Roll number is missing for one student`);
        continue;
      }

      if (marks === undefined && isAbsent === undefined) {
        errors.push(`No marks or absence data for roll number ${rollNo}`);
        continue;
      }

      // Validate marks array if provided
      if (marks !== undefined) {
        if (!Array.isArray(marks)) {
          errors.push(
            `Invalid marks format for roll number ${rollNo}. Must be an array of 3 numbers`,
          );
          continue;
        }

        if (marks.length !== 3) {
          errors.push(
            `Invalid marks array length for roll number ${rollNo}. Must contain exactly 3 numbers`,
          );
          continue;
        }

        if (marks.some((mark) => mark < 0 || mark > 100)) {
          errors.push(
            `Invalid marks values for roll number ${rollNo}. All marks must be between 0-100`,
          );
          continue;
        }
      }

      const studentIndex = table.data.findIndex((s) => s.rollNo === rollNo);
      if (studentIndex === -1) {
        errors.push(`Student with roll number ${rollNo} not found`);
        continue;
      }

      if (isAbsent === true) {
        table.data[studentIndex].isAbsent = true;
        table.data[studentIndex].marks = [0, 0, 0];
      } else if (marks !== undefined) {
        table.data[studentIndex].marks = marks;
        table.data[studentIndex].isAbsent = false;
      }

      updatedCount++;
    }

    await table.save();

    // Check if all students have marks submitted (at least one non-zero mark in array)
    const allMarked = table.data.every(
      (student) => student.isAbsent || student.marks.some((mark) => mark > 0),
    );

    if (allMarked) {
      table.isPending = false;
      await table.save();
    }

    return res.status(200).json({
      message: `Successfully updated ${updatedCount} student(s)`,
      flag: true,
      data: {
        totalUpdated: updatedCount,
        totalRequested: updates.length,
        errors: errors.length > 0 ? errors : null,
        allMarked,
      },
    });
  } catch (error) {
    console.log("Error in sendStudentMarks", error.message);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};
