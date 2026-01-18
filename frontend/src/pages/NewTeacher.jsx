import React, { useState } from "react";

const NewTeacher = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { firstName, lastName, email, password, role };
    console.log("Create teacher payload:", payload);
    // TODO: call backend API to create teacher
    // reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("teacher");
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create New Teacher/Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-blue-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-blue-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-blue-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-blue-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 pr-12 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label htmlFor="role" className="text-sm font-medium text-blue-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTeacher;
