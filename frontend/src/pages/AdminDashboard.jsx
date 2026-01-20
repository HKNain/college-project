import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("records"); // records or assign
  const [studentRecords, setStudentRecords] = useState([
    {
      rollNo: 1,
      firstName: "John",
      lastName: "Doe",
      marks: 85,
      isAbsent: false,
      assignedTeacher: "Mr. Smith",
    },
    {
      rollNo: 2,
      firstName: "Jane",
      lastName: "Smith",
      marks: 0,
      isAbsent: true,
      assignedTeacher: "Ms. Johnson",
    },
    {
      rollNo: 3,
      firstName: "Mike",
      lastName: "Johnson",
      marks: 92,
      isAbsent: false,
      assignedTeacher: "Mr. Brown",
    },
    {
      rollNo: 4,
      firstName: "Sarah",
      lastName: "Williams",
      marks: 0,
      isAbsent: false,
      assignedTeacher: null,
    },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: "Mr. Smith", email: "smith@college.com" },
    { id: 2, name: "Ms. Johnson", email: "johnson@college.com" },
    { id: 3, name: "Mr. Brown", email: "brown@college.com" },
  ]);

  const [studentAssignments, setStudentAssignments] = useState(
    studentRecords.reduce((acc, student) => {
      acc[student.rollNo] = student.assignedTeacher;
      return acc;
    }, {}),
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch teachers from backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await API.get("/teacher/getTeachers");
        if (response.data.success) {
          setTeachers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    // Uncomment when backend is ready
    // fetchTeachers();
  }, []);

  const handleTeacherAssign = (rollNo, teacherName) => {
    setStudentAssignments((prev) => ({
      ...prev,
      [rollNo]: teacherName,
    }));
  };

  const isAllAssigned = studentRecords.every(
    (student) => studentAssignments[student.rollNo],
  );

  const handleSendEmails = async () => {
    if (!isAllAssigned) {
      setMessage("Please assign teachers to all students first");
      return;
    }

    setLoading(true);
    try {
      // Group students by teacher
      const teacherStudentMap = {};
      studentRecords.forEach((student) => {
        const teacherName = studentAssignments[student.rollNo];
        if (!teacherStudentMap[teacherName]) {
          teacherStudentMap[teacherName] = [];
        }
        teacherStudentMap[teacherName].push(student);
      });

      // Send emails to teachers
      for (const [teacherName, students] of Object.entries(teacherStudentMap)) {
        const teacher = teachers.find((t) => t.name === teacherName);
        if (teacher) {
          await API.post("/teacher/sendMail", {
            email: teacher.email,
            teacherName: teacherName,
            students: students,
          });
        }
      }

      setMessage("Emails sent successfully to all teachers!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error sending emails:", error);
      setMessage("Error sending emails. Please try again.");
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage student records and teacher assignments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "records"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            <i className="fas fa-list mr-2"></i>
            View Records
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "assign"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            <i className="fas fa-user-tie mr-2"></i>
            Assign Teachers
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg font-semibold ${
              message.includes("Error")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            <i
              className={`mr-2 ${
                message.includes("Error")
                  ? "fas fa-exclamation-circle"
                  : "fas fa-check-circle"
              }`}
            ></i>
            {message}
          </div>
        )}

        {/* View Records Tab */}
        {activeTab === "records" && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Student Records
            </h2>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 bg-blue-50 py-3 rounded-lg">
              <label className="col-span-1 text-sm font-semibold text-blue-700">
                Roll No
              </label>
              <label className="col-span-2 text-sm font-semibold text-blue-700">
                Name
              </label>
              <label className="col-span-2 text-sm font-semibold text-blue-700">
                Marks
              </label>
              <label className="col-span-2 text-sm font-semibold text-blue-700">
                Absent
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                Assigned Teacher
              </label>
            </div>

            {/* Student Rows */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {studentRecords.map((student) => (
                <div
                  key={student.rollNo}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg border ${
                    student.isAbsent
                      ? "bg-red-50 border-red-200"
                      : student.marks > 0
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Roll No */}
                  <div className="md:col-span-1 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Roll No
                    </label>
                    <p className="text-blue-900 font-medium">
                      {student.rollNo}
                    </p>
                  </div>

                  {/* Name */}
                  <div className="md:col-span-2 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Name
                    </label>
                    <p className="text-blue-900 font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>

                  {/* Marks */}
                  <div className="md:col-span-2 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Marks
                    </label>
                    <p
                      className={`text-lg font-semibold ${
                        student.isAbsent
                          ? "text-red-600"
                          : student.marks > 0
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    >
                      {student.isAbsent ? "Absent" : student.marks || "-"}
                    </p>
                  </div>

                  {/* Absent Status */}
                  <div className="md:col-span-2 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Absent
                    </label>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          student.isAbsent
                            ? "bg-red-200 text-red-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {student.isAbsent ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Teacher */}
                  <div className="md:col-span-3 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Teacher
                    </label>
                    <p className="text-blue-900 font-medium">
                      {student.assignedTeacher || (
                        <span className="text-red-600">Not Assigned</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assign Teachers Tab */}
        {activeTab === "assign" && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Assign Teachers to Students
            </h2>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 bg-blue-50 py-3 rounded-lg">
              <label className="col-span-1 text-sm font-semibold text-blue-700">
                Roll No
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                Student Name
              </label>
              <label className="col-span-5 text-sm font-semibold text-blue-700">
                Assign Teacher
              </label>
              <label className="col-span-3 text-sm font-semibold text-blue-700">
                Status
              </label>
            </div>

            {/* Student Assignment Rows */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {studentRecords.map((student) => (
                <div
                  key={student.rollNo}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg border ${
                    studentAssignments[student.rollNo]
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  {/* Roll No */}
                  <div className="md:col-span-1 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Roll No
                    </label>
                    <p className="text-blue-900 font-medium">
                      {student.rollNo}
                    </p>
                  </div>

                  {/* Student Name */}
                  <div className="md:col-span-3 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Name
                    </label>
                    <p className="text-blue-900 font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>

                  {/* Teacher Dropdown */}
                  <div className="md:col-span-5 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Assign Teacher
                    </label>
                    <select
                      value={studentAssignments[student.rollNo] || ""}
                      onChange={(e) =>
                        handleTeacherAssign(student.rollNo, e.target.value)
                      }
                      className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select a teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.name}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-3 col-span-1">
                    <label className="md:hidden text-sm font-semibold text-blue-700">
                      Status
                    </label>
                    <div className="flex items-center">
                      {studentAssignments[student.rollNo] ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800 flex items-center gap-2">
                          <i className="fas fa-check-circle"></i>
                          Assigned
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800 flex items-center gap-2">
                          <i className="fas fa-hourglass-half"></i>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-700">
                  Assignment Progress
                </p>
                <p className="text-sm font-semibold text-blue-600">
                  {Object.values(studentAssignments).filter(Boolean).length}/
                  {studentRecords.length}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (Object.values(studentAssignments).filter(Boolean)
                        .length /
                        studentRecords.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {!isAllAssigned && (
              <p className="text-yellow-600 text-sm mb-6">
                <i className="fas fa-exclamation-circle mr-2"></i>
                Please assign teachers to all students before sending emails
              </p>
            )}

            {/* Send Emails Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSendEmails}
                disabled={!isAllAssigned || loading}
                className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <i className="fas fa-envelope"></i>
                    Send Emails to Teachers
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
