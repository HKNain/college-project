import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setLoading(false);
      return;
    }

    if (formData.firstName.trim().length > 30) {
      setError("First name must be less than 30 characters");
      setLoading(false);
      return;
    }

    if (formData.lastName && formData.lastName.trim().length > 30) {
      setError("Last name must be less than 30 characters");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length > 30) {
      setError("Password must be less than 30 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/signup", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim() || "",
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        securityKey: formData.securityKey || "",
      });

      if (response.data.flag) {
        // Redirect to login page
        navigate("/login", {
          state: { message: "Account created successfully. Please login." },
        });
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during signup",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-blue-950 shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-blue-500">
            Create Account
          </h1>
          <p className="text-sm text-blue-500 mt-2">
            Join our college management system
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-blue-500"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              maxLength="30"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-blue-500"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              maxLength="30"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-blue-500"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-blue-500"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                maxLength="30"
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-12 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1C4.22 7.43 2.77 9.4 2 12c1.5 4.5 5.5 7.5 10 7.5 1.64 0 3.2-.36 4.6-1M9.9 4.2A9.97 9.97 0 0112 4c4.5 0 8.5 3 10 7.5a10.6 10.6 0 01-2.1 3.36"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 5c4.5 0 8.5 3 10 7.5-1.5 4.5-5.5 7.5-10 7.5S3.5 17 2 12.5C3.5 8 7.5 5 12 5z"
                    />
                    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-blue-400">
              Password must be 6-30 characters
            </p>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium text-blue-500">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Security Key (Admin only) */}
          {formData.role === "admin" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="securityKey"
                className="text-sm font-medium text-blue-500"
              >
                Security Key <span className="text-red-500">*</span>
              </label>
              <input
                id="securityKey"
                type="password"
                name="securityKey"
                placeholder="Enter admin security key"
                value={formData.securityKey || ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-200 font-semibold transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
