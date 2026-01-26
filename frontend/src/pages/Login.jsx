import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";
import { generateCaptcha, drawCaptcha } from "../utils/captcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  // Generate captcha on mount and when refresh button is clicked
  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setCaptchaInput("");
    setError("");

    // Draw captcha on canvas
    if (canvasRef.current) {
      drawCaptcha(canvasRef.current, newCaptcha);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verify captcha (case-insensitive)
    if (captchaInput.toUpperCase() !== captcha.toUpperCase()) {
      setError("Invalid captcha. Please try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      if (response.data.flag) {
        const userRole = response.data.user?.role || "teacher";
        const userEmail = response.data.user?.email;

        // Store email and role in localStorage
        if (userEmail) {
          localStorage.setItem("userEmail", userEmail);
          localStorage.setItem("userRole", userRole);
        }

        // Navigate based on role
        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/login");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-blue-950 shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-blue-500">Welcome Back</h1>
          <p className="text-sm text-blue-500 mt-2">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-blue-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {/* Captcha */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-blue-500">
              Security Verification <span className="text-red-500">*</span>
            </label>

            {/* Canvas for Captcha */}
            <div className="flex gap-2 items-center">
              <canvas
                ref={canvasRef}
                width="300"
                height="80"
                className="border-2 border-blue-400 rounded-lg bg-white flex-1"
                style={{ userSelect: "none", WebkitUserSelect: "none" }}
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                title="Refresh captcha"
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0"
              >
                <i className="fas fa-redo"></i>
              </button>
            </div>

            {/* Captcha Input */}
            <input
              type="text"
              placeholder="Enter the 6 characters above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              maxLength="6"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition tracking-widest"
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <p className="text-xs text-blue-400">
              Case insensitive. Copying and pasting are disabled.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-300 hover:text-blue-200 font-semibold transition"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
