import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";

const TeacherDashboard = () => {
  // Sample data - replace with actual API call
  const [studentRecords, setStudentRecords] = useState([
    {
      rollNo: 1,
      firstName: "John",
      lastName: "Doe",
      marks: 0,
      isAbsent: false,
    },
    {
      rollNo: 2,
      firstName: "Jane",
      lastName: "Smith",
      marks: 0,
      isAbsent: false,
    },
    {
      rollNo: 3,
      firstName: "Mike",
      lastName: "Johnson",
      marks: 0,
      isAbsent: false,
    },
    {
      rollNo: 4,
      firstName: "Sarah",
      lastName: "Williams",
      marks: 0,
      isAbsent: false,
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editMarks, setEditMarks] = useState("");

  // Calculate stats
  const submitted = studentRecords.filter(
    (s) => s.marks > 0 || s.isAbsent,
  ).length;
  const pending = studentRecords.filter(
    (s) => s.marks === 0 && !s.isAbsent,
  ).length;
  const total = studentRecords.length;
  const averageScore =
    submitted > 0
      ? (
          studentRecords.reduce(
            (sum, s) => sum + (s.isAbsent ? 0 : s.marks),
            0,
          ) / studentRecords.filter((s) => !s.isAbsent).length
        ).toFixed(2)
      : 0;

  // Check if all records are complete
  const isAllComplete = studentRecords.every(
    (s) => (s.marks > 0 && !s.isAbsent) || s.isAbsent,
  );

  const handleMarksChange = (rollNo, value) => {
    const numValue = parseInt(value) || 0;
    setStudentRecords((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? { ...student, marks: student.isAbsent ? 0 : numValue }
          : student,
      ),
    );
  };

  const handleIsAbsentChange = (rollNo, isAbsent) => {
    setStudentRecords((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? { ...student, isAbsent, marks: isAbsent ? 0 : student.marks }
          : student,
      ),
    );
  };

  const handleEditClick = (rollNo, marks) => {
    setEditingId(rollNo);
    setEditMarks(marks.toString());
  };

  const handleEditSave = () => {
    handleMarksChange(editingId, editMarks);
    setEditingId(null);
    setEditMarks("");
  };

  const handleSave = () => {
    console.log("Saved records:", studentRecords);
    // TODO: Call backend API to save records
  };

  const handleSubmit = async () => {
    if (!isAllComplete) {
      alert("Please complete all student records before submitting");
      return;
    }

    try {
      // Prepare marks data
      const studentMarksData = studentRecords.map((student) => ({
        rollNo: student.rollNo,
        marks: student.marks,
        isAbsent: student.isAbsent,
      }));

      // Call backend API
      const response = await API.post("/teacher/submitMarks", {
        tableId: "your-table-id", // Pass the actual tableId
        studentMarksData: studentMarksData,
      });

      if (response.data.flag) {
        alert("Marks submitted successfully!");
        console.log("Submitted records:", response.data);
      } else {
        alert("Error submitting marks");
      }
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Error submitting marks. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Submitted Box */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {submitted}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Pending Box */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <i className="fas fa-clock text-yellow-600 text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Total Box */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{total}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <i className="fas fa-users text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Average Score Box */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {averageScore}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <i className="fas fa-chart-line text-purple-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Student Records Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Student Records
          </h2>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-4 bg-blue-50 py-3 rounded-lg">
            <label className="col-span-1 text-sm font-semibold text-blue-700">
              Roll No
            </label>
            <label className="col-span-3 text-sm font-semibold text-blue-700">
              Name
            </label>
            <label className="col-span-2 text-sm font-semibold text-blue-700">
              Marks
            </label>
            <label className="col-span-2 text-sm font-semibold text-blue-700">
              Absent
            </label>
            <label className="col-span-2 text-sm font-semibold text-blue-700">
              Action
            </label>
            <label className="col-span-2"></label>
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
                  <p className="text-blue-900 font-medium">{student.rollNo}</p>
                </div>

                {/* Name */}
                <div className="md:col-span-3 col-span-1">
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
                  {editingId === student.rollNo ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editMarks}
                      onChange={(e) => setEditMarks(e.target.value)}
                      disabled={
                        studentRecords.find((s) => s.rollNo === student.rollNo)
                          ?.isAbsent
                      }
                      className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
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
                  )}
                </div>

                {/* Is Absent Checkbox */}
                <div className="md:col-span-2 col-span-1 flex items-center">
                  <label className="md:hidden text-sm font-semibold text-blue-700 mr-2">
                    Absent
                  </label>
                  <input
                    type="checkbox"
                    checked={student.isAbsent}
                    onChange={(e) =>
                      handleIsAbsentChange(student.rollNo, e.target.checked)
                    }
                    className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-400 cursor-pointer"
                  />
                </div>

                {/* Edit Button */}
                <div className="md:col-span-2 col-span-1">
                  {editingId === student.rollNo ? (
                    <button
                      onClick={handleEditSave}
                      className="w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleEditClick(student.rollNo, student.marks)
                      }
                      disabled={student.isAbsent}
                      className="w-full bg-orange-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                  )}
                </div>

                {/* Delete/Cancel Button */}
                <div className="md:col-span-2 col-span-1">
                  {editingId === student.rollNo ? (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditMarks("");
                      }}
                      className="w-full bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleMarksChange(student.rollNo, 0) &&
                        handleIsAbsentChange(student.rollNo, false)
                      }
                      className="w-full bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-redo"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Save
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isAllComplete}
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>

          {!isAllComplete && (
            <p className="text-red-600 text-sm mt-4">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Please complete all student records before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
