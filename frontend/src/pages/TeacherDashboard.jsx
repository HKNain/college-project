import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import API from "../utils/axios";
import academicYears from "../json/academicYears.json";
import branches from "../json/branches.json";

const TeacherDashboard = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("");
  const [studentRecords, setStudentRecords] = useState([]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editMarks, setEditMarks] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setTeacherEmail(email);
  }, []);

  const hasMarks = (marks) => Array.isArray(marks) && marks.some((m) => m > 0);

  const isComplete = (student) => student.isAbsent || hasMarks(student.marks);

  const visibleRecords = studentRecords.filter((s) => !isComplete(s));
  const allComplete =
    studentRecords.length > 0 && studentRecords.every(isComplete);

  const submitted = studentRecords.filter(
    (s) => s.isAbsent || hasMarks(s.marks),
  ).length;

  const pending = studentRecords.filter(
    (s) => !s.isAbsent && !hasMarks(s.marks),
  ).length;

  const total = studentRecords.length;

  const averageScore =
    studentRecords.filter((s) => !s.isAbsent).length > 0
      ? (
          studentRecords.reduce(
            (sum, s) =>
              sum +
              (s.isAbsent
                ? 0
                : Array.isArray(s.marks)
                  ? s.marks.reduce((a, b) => a + b, 0) / 3
                  : 0),
            0,
          ) / studentRecords.filter((s) => !s.isAbsent).length
        ).toFixed(2)
      : 0;

  const handleMarksChange = (rollNo, index, value) => {
    const numValue = parseInt(value, 10);
    const safeValue = Number.isNaN(numValue) ? 0 : numValue;

    setStudentRecords((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? {
              ...student,
              marks: student.isAbsent
                ? [0, 0, 0]
                : (student.marks || [0, 0, 0]).map((m, i) =>
                    i === index ? safeValue : m,
                  ),
            }
          : student,
      ),
    );
  };

  const handleIsAbsentChange = (rollNo, isAbsent) => {
    setStudentRecords((prev) =>
      prev.map((student) =>
        student.rollNo === rollNo
          ? {
              ...student,
              isAbsent,
              marks: isAbsent ? [0, 0, 0] : student.marks || [0, 0, 0],
            }
          : student,
      ),
    );
  };

  const handleDownloadPdf = () => {
    if (!allComplete) {
      alert("Download available only when all students are complete.");
      return;
    }
    const doc = new jsPDF();
    doc.text(`Records: ${academicYear} - ${branch}`, 14, 16);

    const rows = studentRecords.map((s) => [
      s.rollNo,
      `${s.firstName} ${s.lastName || ""}`.trim(),
      Array.isArray(s.marks) ? s.marks.join(", ") : "0, 0, 0",
      s.isAbsent ? "Yes" : "No",
    ]);

    autoTable(doc, {
      startY: 22,
      head: [["Roll No", "Name", "Marks", "Absent"]],
      body: rows,
    });

    doc.save(`records_${academicYear}_${branch}.pdf`);
  };

  const handleEditClick = (rollNo, marks) => {
    setEditingId(rollNo);
    const safeMarks = Array.isArray(marks) ? marks : [0, 0, 0];
    setEditMarks(safeMarks.map((m) => m.toString()));
  };

  const handleEditSave = () => {
    const parsed = editMarks.map((m) => parseInt(m, 10) || 0);
    setStudentRecords((prev) =>
      prev.map((student) =>
        student.rollNo === editingId
          ? { ...student, marks: student.isAbsent ? [0, 0, 0] : parsed }
          : student,
      ),
    );
    setEditingId(null);
    setEditMarks(["", "", ""]);
  };

  const handleShowRecords = async () => {
    setError("");
    setLoading(true);
    try {
      if (!academicYear || !branch) {
        setError("Please select academic year and branch");
        return;
      }
      if (!teacherEmail) {
        setError("Teacher email not found. Please login again.");
        return;
      }

      const tableId = `${academicYear} ${branch}`;
      const res = await API.post("/table/getTable", { tableId });
      if (res.data.flag) {
        const allStudents = res.data.data.data || [];
        const assignedStudents = allStudents.filter(
          (student) => student.techerAssignedEmail === teacherEmail,
        );

        if (assignedStudents.length === 0) {
          setError("No students assigned to you in this class");
          setShowRecords(false);
          setStudentRecords([]);
          return;
        }

        // Ensure marks arrays exist
        const normalized = assignedStudents.map((s) => ({
          ...s,
          marks: Array.isArray(s.marks) ? s.marks : [0, 0, 0],
        }));

        setStudentRecords(normalized);
        setInitialRecords(normalized);
        setShowRecords(true);
      } else {
        setError(res.data.message || "Failed to fetch records");
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

  const handleSubmit = async () => {
    const changedRecords = studentRecords.filter((student) => {
      const initial = initialRecords.find((s) => s.rollNo === student.rollNo);
      return (
        !initial ||
        JSON.stringify(initial.marks) !== JSON.stringify(student.marks) ||
        initial.isAbsent !== student.isAbsent
      );
    });

    if (changedRecords.length === 0) {
      alert("No changes to submit");
      return;
    }

    try {
      const tableId = `${academicYear} ${branch}`;
      const response = await API.post("/teacher/submitMarks", {
        tableId,
        studentMarksData: changedRecords,
      });

      if (response.data.flag) {
        alert("Marks submitted successfully!");
        setInitialRecords(studentRecords);
      } else {
        alert(response.data.message || "Error submitting marks");
      }
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Error submitting marks. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Select Class
          </h2>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
              <i className="fas fa-exclamation-circle mr-2" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-blue-700">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-blue-200 px-4 py-3"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-blue-700">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-lg border border-blue-200 px-4 py-3"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={handleShowRecords}
                disabled={loading || !academicYear || !branch}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50"
              >
                {loading ? "Loading..." : "Show Students"}
              </button>
            </div>
          </div>
        </div>

        {showRecords && (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Submitted Box */}
              <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Submitted
                    </p>
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
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {total}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Avg Score
                    </p>
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
                Your Assigned Students
              </h2>

              <div className="hidden md:grid grid-cols-16 gap-3 mb-4 px-4 bg-blue-50 py-3 rounded-lg text-xs">
                <label className="col-span-2 font-semibold text-blue-700">
                  Roll No
                </label>
                <label className="col-span-3 font-semibold text-blue-700">
                  Name
                </label>
                <label className="col-span-1 font-semibold text-blue-700 ">
                  Viva
                </label>
                <label className="col-span-1 font-semibold text-blue-700">
                  Presentation
                </label>
                <label className="col-span-1 font-semibold text-blue-700">
                  Idea
                </label>
                <label className="col-span-2 font-semibold text-blue-700">
                  Absent
                </label>
                <label className="col-span-3 font-semibold text-blue-700">
                  Edit
                </label>
                <label className="col-span-3 font-semibold text-blue-700">
                  Reset
                </label>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {visibleRecords.map((student) => {
                  const marks = Array.isArray(student.marks)
                    ? student.marks
                    : [0, 0, 0];

                  return (
                    <div
                      key={student.rollNo}
                      className={`grid grid-cols-1 md:grid-cols-16 gap-3 items-center p-4 rounded-lg border ${
                        student.isAbsent
                          ? "bg-red-50 border-red-200"
                          : hasMarks(student.marks)
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      {/* Roll No */}
                      <div className="md:col-span-2 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700">
                          Roll No
                        </label>
                        <p className="text-blue-900 font-medium text-sm">
                          {student.rollNo}
                        </p>
                      </div>

                      {/* Name */}
                      <div className="md:col-span-3 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700">
                          Name
                        </label>
                        <p className="text-blue-900 font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>

                      {/* Marks 1 */}
                      <div className="md:col-span-1 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700">
                          Marks 1
                        </label>
                        {editingId === student.rollNo ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editMarks[0]}
                            onChange={(e) => {
                              const updated = [...editMarks];
                              updated[0] = e.target.value;
                              setEditMarks(updated);
                            }}
                            disabled={student.isAbsent}
                            className="w-full rounded-lg border border-blue-300 bg-white px-2 py-1 text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        ) : (
                          <p
                            className={`text-base font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[0] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[0]}
                          </p>
                        )}
                      </div>

                      {/* Marks 2 */}
                      <div className="md:col-span-1 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700">
                          Marks 2
                        </label>
                        {editingId === student.rollNo ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editMarks[1]}
                            onChange={(e) => {
                              const updated = [...editMarks];
                              updated[1] = e.target.value;
                              setEditMarks(updated);
                            }}
                            disabled={student.isAbsent}
                            className="w-full rounded-lg border border-blue-300 bg-white px-2 py-1 text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        ) : (
                          <p
                            className={`text-base font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[1] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[1]}
                          </p>
                        )}
                      </div>

                      {/* Marks 3 */}
                      <div className="md:col-span-1 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700">
                          Marks 3
                        </label>
                        {editingId === student.rollNo ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editMarks[2]}
                            onChange={(e) => {
                              const updated = [...editMarks];
                              updated[2] = e.target.value;
                              setEditMarks(updated);
                            }}
                            disabled={student.isAbsent}
                            className="w-full rounded-lg border border-blue-300 bg-white px-2 py-1 text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        ) : (
                          <p
                            className={`text-base font-semibold ${
                              student.isAbsent
                                ? "text-red-600"
                                : marks[2] > 0
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {student.isAbsent ? "-" : marks[2]}
                          </p>
                        )}
                      </div>

                      {/* Absent */}
                      <div className="md:col-span-2 col-span-1 flex items-center">
                        <label className="md:hidden text-xs font-semibold text-blue-700 mr-2">
                          Absent
                        </label>
                        <input
                          type="checkbox"
                          checked={student.isAbsent}
                          onChange={(e) =>
                            handleIsAbsentChange(
                              student.rollNo,
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-400 cursor-pointer"
                        />
                      </div>

                      {/* Edit Actions */}
                      <div className="md:col-span-3 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700 block mb-1">
                          Edit
                        </label>
                        {editingId === student.rollNo ? (
                          <div className="flex gap-1">
                            <button
                              onClick={handleEditSave}
                              title="Save"
                              className="flex-1 bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            >
                              <i className="fas fa-check text-sm"></i>
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditMarks(["", "", ""]);
                              }}
                              title="Cancel"
                              className="flex-1 bg-gray-400 text-white font-semibold p-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                            >
                              <i className="fas fa-times text-sm"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleEditClick(student.rollNo, student.marks)
                            }
                            disabled={student.isAbsent}
                            title="Edit"
                            className="w-full bg-orange-500 text-white font-semibold p-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </button>
                        )}
                      </div>

                      {/* Reset */}
                      <div className="md:col-span-3 col-span-1">
                        <label className="md:hidden text-xs font-semibold text-blue-700 block mb-1">
                          Reset
                        </label>
                        <button
                          onClick={() => {
                            handleMarksChange(student.rollNo, 0, 0);
                            handleMarksChange(student.rollNo, 1, 0);
                            handleMarksChange(student.rollNo, 2, 0);
                            handleIsAbsentChange(student.rollNo, false);
                          }}
                          title="Reset"
                          className="w-full bg-red-500 text-white font-semibold p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        >
                          <i className="fas fa-redo text-sm"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleDownloadPdf}
                  disabled={!allComplete}
                  className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || studentRecords.length === 0}
                  className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
