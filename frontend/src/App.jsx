import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewStudents from "./pages/NewStudents";
import NewTeacher from "./pages/NewTeacher";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentRecords from "./pages/StudentRecords";
import AssignTeacher from "./pages/AssignTeacher";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Only Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new-students"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <NewStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new-teacher"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <NewTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-teachers"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AssignTeacher />
            </ProtectedRoute>
          }
        />

        {/* Student Records - Accessible by Admin */}
        <Route
          path="/student/records"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <StudentRecords />
            </ProtectedRoute>
          }
        />

        {/* Teacher Only Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route - Redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
