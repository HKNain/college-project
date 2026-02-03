import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";
import academicYears from "../json/academicYears.json";
import branches from "../json/branches.json";

const NewStudents = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([
    { rollNo: "", firstName: "", lastName: "", email: "" },
  ]);

  const handleNumberOfStudentsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(value, 0), 60);
    setNumberOfStudents(clampedValue);

    const newStudents = Array.from({ length: clampedValue }, () => ({
      rollNo: "",
      firstName: "",
      lastName: "",
      email: "",
    }));
    setStudents(newStudents);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/excel/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.flag) {
        const importedStudents = response.data.data;
        setStudents(importedStudents);
        setNumberOfStudents(importedStudents.length);
        setError("");
        alert(`Successfully imported ${importedStudents.length} students`);
      } else {
        setError(response.data.message || "Failed to parse Excel file");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error uploading file. Please try again.",
      );
      console.error("Error:", err);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddStudent = () => {
    if (students.length < 60) {
      setStudents([
        ...students,
        { rollNo: "", firstName: "", lastName: "", email: "" },
      ]);
      setNumberOfStudents(students.length + 1);
    }
  };

  const handleRemoveStudent = (index) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
      setNumberOfStudents(students.length - 1);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!academicYear) {
      setError("Please select an academic year");
      setLoading(false);
      return;
    }

    if (!branch) {
      setError("Please select a branch");
      setLoading(false);
      return;
    }

    if (students.length === 0) {
      setError("Please add at least one student");
      setLoading(false);
      return;
    }

    // Validate all students have required fields
    const invalidStudent = students.some(
      (s) => !s.rollNo || !s.firstName || !s.email,
    );
    if (invalidStudent) {
      setError("All students must have Roll No, First Name, and Email");
      setLoading(false);
      return;
    }

    // Check for duplicate roll numbers
    const rollNos = students.map((s) => s.rollNo);
    const duplicateRollNos = rollNos.filter(
      (rollNo, index) => rollNos.indexOf(rollNo) !== index,
    );
    if (duplicateRollNos.length > 0) {
      setError(`Duplicate roll numbers found: ${duplicateRollNos.join(", ")}`);
      setLoading(false);
      return;
    }

    // Check for duplicate emails
    const emails = students.map((s) => s.email.toLowerCase());
    const duplicateEmails = emails.filter(
      (email, index) => emails.indexOf(email) !== index,
    );
    if (duplicateEmails.length > 0) {
      setError(`Duplicate emails found: ${duplicateEmails.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/table/createTable", {
        tableId: academicYear + " " + branch,
        year: academicYear,
        branch: branch,
        data: students.map((student) => ({
          ...student,
          rollNo: student.rollNo,
          marks: [0, 0, 0],
          isAbsent: false,
          techerAssignedEmail: "",
        })),
      });

      if (response.data.flag) {
        setError("");
        alert("Students added successfully!");
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Failed to add students");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error adding students. Please try again.",
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create sample Excel template
    const templateData = [
      {
        rollNo: "12411055",
        firstName: "Arnav",
        lastName: "Goyal",
        email: "arnav@example.com",
      },
      {
        rollNo: "12413024",
        firstName: "Hitesh",
        lastName: "Kumar",
        email: "hitesh@example.com",
      },
    ];

    const ws = window.XLSX?.utils?.json_to_sheet(templateData);
    const wb = window.XLSX?.utils?.book_new();
    window.XLSX?.utils?.book_append_sheet(wb, ws, "Students");
    window.XLSX?.writeFile(wb, "student_template.xlsx");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Add New Students
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Academic Year, Branch, and Number of Students */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="academicYear"
                className="text-sm font-medium text-blue-700"
              >
                Academic Year
              </label>
              <select
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="branch"
                className="text-sm font-medium text-blue-700"
              >
                Branch
              </label>
              <select
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="numberOfStudents"
                className="text-sm font-medium text-blue-700"
              >
                Number of Students (1-60)
              </label>
              <input
                id="numberOfStudents"
                type="number"
                min="0"
                max="60"
                value={numberOfStudents}
                onChange={handleNumberOfStudentsChange}
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
              />
            </div>
          </div>

          {/* Excel Import Section */}
          <div className="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  <i className="fas fa-file-excel mr-2"></i>
                  Import from Excel
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload an Excel file with columns: rollNo, firstName,
                  lastName, email
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className={`inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload"></i>
                      Choose Excel File
                    </>
                  )}
                </label>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  <i className="fas fa-download"></i>
                  Download Template
                </button>
              </div>
            </div>
          </div>

          {/* Student Fields */}
          <div className="mb-8">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4">
              <label className="col-span-2 text-sm font-semibold text-blue-700">
                Roll No
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                First Name
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                Last Name
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                Email
              </label>
              <label className="col-span-1"></label>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {students.map((student, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                >
                  <input
                    type="text"
                    placeholder="Roll No"
                    value={student.rollNo}
                    onChange={(e) =>
                      handleInputChange(index, "rollNo", e.target.value)
                    }
                    className="md:col-span-2 col-span-1 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={student.firstName}
                    onChange={(e) =>
                      handleInputChange(index, "firstName", e.target.value)
                    }
                    className="md:col-span-3 col-span-1 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={student.lastName}
                    onChange={(e) =>
                      handleInputChange(index, "lastName", e.target.value)
                    }
                    className="md:col-span-3 col-span-1 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={student.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                    className="md:col-span-3 col-span-1 w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(index)}
                    disabled={students.length === 1}
                    className="md:col-span-1 col-span-1 w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Student Button */}
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={handleAddStudent}
              disabled={students.length >= 60}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-plus"></i>
              Add Student
            </button>
            <span className="text-sm text-blue-600 font-medium">
              Total Students: {students.length}
            </span>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStudents;
