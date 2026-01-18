import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-blue-950 shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-blue-500">Welcome Back</h1>
          <p className="text-sm text-blue-500 mt-2">Sign in to continue</p>
        </div>

        <form className="space-y-4">
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
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            />
          </div>

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

          <div className="flex flex-col gap-2">
            <label
              htmlFor="captcha"
              className="text-sm font-medium text-blue-500"
            >
              Captcha
            </label>
            <input
              id="captcha"
              type="text"
              placeholder="Enter captcha"
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-white transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
