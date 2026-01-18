import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const NewStudents = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState(1);
  const [students, setStudents] = useState([
    { rollNo: "", firstName: "", lastName: "", email: "" },
  ]);

  const handleNumberOfStudentsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(value, 0), 60);
    setNumberOfStudents(clampedValue);

    // Generate student fields based on the number
    const newStudents = Array.from({ length: clampedValue }, () => ({
      rollNo: "",
      firstName: "",
      lastName: "",
      email: "",
    }));
    setStudents(newStudents);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      academicYear,
      branch,
      students,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Add New Students
        </h1>

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
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
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
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics and Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
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
                    type="number"
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
                    disabled={students.length === 0}
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStudents;
