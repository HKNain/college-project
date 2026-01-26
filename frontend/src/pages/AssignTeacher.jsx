import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";
import academicYears from "../json/academicYears.json";
import branches from "../json/branches.json";

const AssignTeacher = () => {
  const navigate = useNavigate();
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [sending, setSending] = useState(false);

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await API.get("/teacher/getTeachers");
      if (response.data.success) {
        setTeachers(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Failed to fetch teachers list");
    }
  };

  const handleShowRecords = async () => {
    setError("");
    setLoading(true);

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
      const tableId = `${academicYear} ${branch}`;
      const response = await API.post("/table/getTable", {
        tableId: tableId,
      });

      if (response.data.flag) {
        const students = response.data.data.data || [];
        setStudentData(students);

        // Initialize assignments with existing teacher assignments
        const initialAssignments = {};
        students.forEach((student) => {
          if (student.techerAssignedEmail) {
            initialAssignments[student.rollNo] = student.techerAssignedEmail;
          }
        });
        setAssignments(initialAssignments);
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
      console.error("Error:", err);
      setShowRecords(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherAssignment = (rollNo, teacherEmail) => {
    setAssignments((prev) => ({
      ...prev,
      [rollNo]: teacherEmail,
    }));
  };

  const handleSendEmails = async () => {
    // Check if all students have teachers assigned
    const unassignedStudents = studentData.filter(
      (student) => !assignments[student.rollNo],
    );

    if (unassignedStudents.length > 0) {
      setError(
        `Please assign teachers to all students. ${unassignedStudents.length} student(s) unassigned.`,
      );
      return;
    }

    setSending(true);
    setError("");

    try {
      // Update table with teacher assignments
      const tableId = `${academicYear} ${branch}`;
      const updatedData = studentData.map((student) => ({
        ...student,
        techerAssignedEmail: assignments[student.rollNo],
      }));

      await API.patch("/table/editTable", {
        tableId: tableId,
        data: updatedData,
      });

      // Group students by teacher
      const teacherStudentsMap = {};
      studentData.forEach((student) => {
        const teacherEmail = assignments[student.rollNo];
        if (!teacherStudentsMap[teacherEmail]) {
          teacherStudentsMap[teacherEmail] = [];
        }
        teacherStudentsMap[teacherEmail].push(student);
      });

      // Send emails to each teacher
      const emailPromises = Object.entries(teacherStudentsMap).map(
        ([teacherEmail, students]) => {
          const teacher = teachers.find((t) => t.email === teacherEmail);
          return API.post("/teacher/sendTeachersEmail", {
            email: teacherEmail,
            teacherName: teacher
              ? `${teacher.firstName} ${teacher.lastName || ""}`
              : "Teacher",
            students: students.map((s) => ({
              rollNo: s.rollNo,
              firstName: s.firstName,
              lastName: s.lastName || "",
              email: s.email,
            })),
          });
        },
      );

      await Promise.all(emailPromises);

      alert("Teachers assigned successfully and emails sent to all teachers!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error sending emails. Please try again.",
      );
      console.error("Error:", err);
    } finally {
      setSending(false);
    }
  };

  const allAssigned =
    studentData.length > 0 &&
    studentData.every((student) => assignments[student.rollNo]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Assign Teachers to Students
          </h1>
          <p className="text-gray-600">
            Select students and assign teachers for evaluation
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Select Class
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
                    Show Students
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        {showRecords && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Assign Teachers - {academicYear} {branch}
            </h2>

            {studentData.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4 block"></i>
                <p className="text-gray-600">No student records found</p>
              </div>
            ) : (
              <>
                {/* Table Header - Desktop */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 mb-4 px-4 bg-blue-50 py-3 rounded-lg">
                  <label className="col-span-2 text-sm font-semibold text-blue-700">
                    Roll No
                  </label>
                  <label className="col-span-3 text-sm font-semibold text-blue-700">
                    First Name
                  </label>
                  <label className="col-span-3 text-sm font-semibold text-blue-700">
                    Last Name
                  </label>
                  <label className="col-span-4 text-sm font-semibold text-blue-700">
                    Assign Teacher
                  </label>
                </div>

                {/* Student Rows */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {studentData.map((student, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 rounded-lg border bg-gray-50 border-gray-200"
                    >
                      {/* Roll No */}
                      <div className="lg:col-span-2 col-span-1">
                        <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                          Roll No
                        </label>
                        <p className="text-blue-900 font-medium">
                          {student.rollNo}
                        </p>
                      </div>

                      {/* First Name */}
                      <div className="lg:col-span-3 col-span-1">
                        <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                          First Name
                        </label>
                        <p className="text-blue-900 font-medium">
                          {student.firstName}
                        </p>
                      </div>

                      {/* Last Name */}
                      <div className="lg:col-span-3 col-span-1">
                        <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                          Last Name
                        </label>
                        <p className="text-blue-900 font-medium">
                          {student.lastName || "-"}
                        </p>
                      </div>

                      {/* Teacher Assignment Dropdown */}
                      <div className="lg:col-span-4 col-span-1">
                        <label className="lg:hidden text-sm font-semibold text-blue-700 block mb-1">
                          Assign Teacher
                        </label>
                        <select
                          value={assignments[student.rollNo] || ""}
                          onChange={(e) =>
                            handleTeacherAssignment(
                              student.rollNo,
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher.email}>
                              {teacher.firstName} {teacher.lastName || ""} (
                              {teacher.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary and Action */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex gap-4">
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
                        Assigned
                      </p>
                      <p className="text-2xl font-bold text-green-700 mt-2">
                        {Object.keys(assignments).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-600 font-medium">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-orange-700 mt-2">
                        {studentData.length - Object.keys(assignments).length}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendEmails}
                      disabled={!allAssigned || sending}
                      className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {sending ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Sending Emails...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-envelope"></i>
                          Save & Send Emails
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!allAssigned && (
                  <p className="text-orange-600 text-sm mt-4 text-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    Please assign teachers to all students before sending emails
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignTeacher;
