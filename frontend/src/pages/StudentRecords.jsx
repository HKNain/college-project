import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";
import academicYears from "../json/academicYears.json";
import branches from "../json/branches.json";

const StudentRecords = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teacherMap, setTeacherMap] = useState({});

  const fetchTeachers = async () => {
    const res = await API.get("/teacher/getTeachers");
    if (res.data.success && Array.isArray(res.data.data)) {
      setTeachers(res.data.data);
      const map = res.data.data.reduce((acc, t) => {
        acc[t.email] = `${t.firstName} ${t.lastName || ""}`.trim();
        return acc;
      }, {});
      setTeacherMap(map);
    }
  };

  const handleShowRecords = async () => {
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

    try {
      await fetchTeachers(); // populate teacher map before rendering
      const tableId = `${academicYear} ${branch}`;
      const response = await API.post("/table/getTable", { tableId });
      if (response.data.flag) {
        setStudentData(response.data.data.data || []);
        setShowRecords(true);
      } else {
        setError(response.data.message || "Failed to fetch records");
        setShowRecords(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error fetching records. Please try again.",
      );
      setShowRecords(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Student Records
          </h1>
          <p className="text-gray-600">
            View and manage student information by academic year and branch
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Filter Records
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Year Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="academicYear"
                className="text-sm font-medium text-blue-700"
              >
                Academic Year <span className="text-red-500">*</span>
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

            {/* Branch Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="branch"
                className="text-sm font-medium text-blue-700"
              >
                Branch <span className="text-red-500">*</span>
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

            {/* Show Records Button */}
            <div className="flex flex-col gap-2 justify-end">
              <button
                onClick={handleShowRecords}
                disabled={loading || !academicYear || !branch}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    Show Records
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Records Section */}
        {showRecords && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              {academicYear} - {branch} Records
            </h2>

            {studentData.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4 block"></i>
                <p className="text-gray-600">No student records found</p>
              </div>
            ) : (
              <>
                {/* Table Header - Desktop */}
                <div className="hidden lg:grid lg:grid-cols-16 gap-4 mb-4 px-4 bg-blue-50 py-3 rounded-lg">
                  <label className="col-span-1 text-sm font-semibold text-blue-700">
                    Roll No
                  </label>
                  <label className="col-span-2 text-sm font-semibold text-blue-700">
                    First Name
                  </label>
                  <label className="col-span-2 text-sm font-semibold text-blue-700">
                    Last Name
                  </label>
                  <label className="col-span-3 text-sm font-semibold text-blue-700">
                    Email
                  </label>
                  <label className="col-span-1 text-sm font-semibold text-blue-700">
                    Marks 1
                  </label>
                  <label className="col-span-1 text-sm font-semibold text-blue-700">
                    Marks 2
                  </label>
                  <label className="col-span-1 text-sm font-semibold text-blue-700">
                    Marks 3
                  </label>
                  <label className="col-span-2 text-sm font-semibold text-blue-700">
                    Teacher
                  </label>
                  <label className="col-span-2 text-sm font-semibold text-blue-700">
                    Status
                  </label>
                  <label className="col-span-1 text-sm font-semibold text-blue-700">
                    Absent
                  </label>
                </div>

                {/* Student Rows */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {studentData.map((student, index) => {
                    const marks = Array.isArray(student.marks)
                      ? student.marks
                      : [0, 0, 0];

                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-1 lg:grid-cols-16 gap-4 items-center p-4 rounded-lg border ${
                          student.isAbsent
                            ? "bg-red-50 border-red-200"
                            : marks.some((m) => m > 0)
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {/* Roll No */}
                        <div className="lg:col-span-1 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Roll No
                          </label>
                          <p className="text-blue-900 font-medium">
                            {student.rollNo}
                          </p>
                        </div>

                        {/* First Name */}
                        <div className="lg:col-span-2 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            First Name
                          </label>
                          <p className="text-blue-900 font-medium">
                            {student.firstName}
                          </p>
                        </div>

                        {/* Last Name */}
                        <div className="lg:col-span-2 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Last Name
                          </label>
                          <p className="text-blue-900 font-medium">
                            {student.lastName || "-"}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="lg:col-span-3 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Email
                          </label>
                          <p className="text-blue-900 font-medium text-sm break-all">
                            {student.email}
                          </p>
                        </div>

                        {/* Marks 1 */}
                        <div className="lg:col-span-1 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Marks 1
                          </label>
                          <p
                            className={`text-lg font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[0] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[0]}
                          </p>
                        </div>

                        {/* Marks 2 */}
                        <div className="lg:col-span-1 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Marks 2
                          </label>
                          <p
                            className={`text-lg font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[1] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[1]}
                          </p>
                        </div>

                        {/* Marks 3 */}
                        <div className="lg:col-span-1 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Marks 3
                          </label>
                          <p
                            className={`text-lg font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[2] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[2]}
                          </p>
                        </div>

                        {/* Teacher Assigned */}
                        <div className="lg:col-span-2 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Teacher Assigned
                          </label>
                          <p className="text-blue-900 font-medium text-sm">
                            {student.techerAssignedEmail ? (
                              teacherMap[student.techerAssignedEmail] ||
                              student.techerAssignedEmail
                            ) : (
                              <span className="text-orange-600 italic">
                                Not Assigned
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="lg:col-span-2 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Status
                          </label>
                          <div className="flex items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                student.isAbsent
                                  ? "bg-red-200 text-red-800"
                                  : marks.some((m) => m > 0)
                                    ? "bg-green-200 text-green-800"
                                    : "bg-yellow-200 text-yellow-800"
                              }`}
                            >
                              {student.isAbsent
                                ? "Absent"
                                : marks.some((m) => m > 0)
                                  ? "Submitted"
                                  : "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* Absent */}
                        <div className="lg:col-span-1 col-span-1">
                          <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                            Absent
                          </label>
                          <div className="flex items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                student.isAbsent
                                  ? "bg-red-200 text-red-800"
                                  : "bg-green-200 text-green-800"
                              }`}
                            >
                              {student.isAbsent ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                      {studentData.length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 font-medium">
                      Submitted
                    </p>
                    <p className="text-2xl font-bold text-green-700 mt-2">
                      {
                        studentData.filter(
                          (s) =>
                            Array.isArray(s.marks) &&
                            s.marks.some((m) => m > 0),
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-medium">Absent</p>
                    <p className="text-2xl font-bold text-red-700 mt-2">
                      {studentData.filter((s) => s.isAbsent).length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-600 font-medium">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-700 mt-2">
                      {
                        studentData.filter(
                          (s) =>
                            (!Array.isArray(s.marks) ||
                              s.marks.every((m) => m === 0)) &&
                            !s.isAbsent,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">
                      Unassigned
                    </p>
                    <p className="text-2xl font-bold text-orange-700 mt-2">
                      {
                        studentData.filter(
                          (s) =>
                            !s.techerAssignedEmail ||
                            s.techerAssignedEmail === "",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRecords;
