import xlsx from "xlsx";

export const parseExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        flag: false,
      });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    console.log(jsonData)
    if (jsonData.length === 0) {
      return res.status(400).json({
        message: "Excel file is empty",
        flag: false,
      });
    }

    // Map Excel columns to expected format
    const students = jsonData.map((row, index) => {
      // Support various column name formats
      const rollNo =
        row.rollNo || row.RollNo || row["Roll No"] || row["roll_no"] || "";
      const firstName =
        row.firstName ||
        row.FirstName ||
        row["First Name"] ||
        row["first_name"] ||
        "";
      const lastName =
        row.lastName ||
        row.LastName ||
        row["Last Name"] ||
        row["last_name"] ||
        "";
      const email = row.email || row.Email || row["E-mail"] || "";

      if (!rollNo || !firstName || !email) {
        throw new Error(
          `Row ${index + 2} is missing required fields (rollNo, firstName, lastName or email)`,
        );
      }

      return {
        rollNo: String(rollNo).trim(),
        firstName: String(firstName).trim(),
        lastName: lastName ? String(lastName).trim() : "",
        email: String(email).toLowerCase().trim(),
      };
    });

    return res.status(200).json({
      message: "Excel file parsed successfully",
      flag: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    return res.status(500).json({
      message: error.message || "Error parsing Excel file",
      flag: false,
    });
  }
};
