import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/userSlice";
import { FaUser } from "react-icons/fa";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    reset();
  };

  const onSubmit = (formData) => {
    console.log("Form submitted ", formData);
    const { email, password, department } = formData;

    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      setError("email", {
        type: "manual",
        message: "Invalid credentials",
      });
      return;
    }

    if (role === "manager" || role === "employee") {
      if (matchedUser.role !== "manager" && matchedUser.role !== "employee") {
        setError("email", {
          type: "manual",
          message: "You don't have access",
        });
        return;
      }

      if (matchedUser.department?.toLowerCase() !== department?.toLowerCase()) {
        setError("email", {
          type: "manual",
          message: "You dont have access",
        });
        return;
      }
    } else if (role === "admin") {
      if (matchedUser.role !== "admin") {
        setError("email", {
          type: "manual",
          message: "You don't have access",
        });
        return;
      }
    }

    if (matchedUser.password !== password) {
      setError("password", {
        type: "manual",
        message: "Invalid password",
      });
      return;
    }

    dispatch(login(matchedUser));
    localStorage.setItem("user", JSON.stringify(matchedUser));
    navigate(
      matchedUser.role === "admin" ? "/admin-dashboard" : "/manager-dashboard"
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-orange-50 py-6 flex flex-col items-center space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-orange-700 w-fit">
          <span className="line-1">Welcome to TeamFlow 🚀</span>
        </h1>
      </div>

      <div className="flex w-full max-w-md bg-slate-100 rounded-lg shadow mb-6 p-2 sm:p-3 gap-2">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm sm:text-base font-medium transition cursor-pointer ${
            role === "admin"
              ? "bg-white text-orange-500 shadow"
              : "text-gray-500"
          }`}
          onClick={() => handleRoleChange("admin")}
          type="button"
        >
          <FaUser className="text-base sm:text-lg" /> Admin
        </button>

        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm sm:text-base font-medium transition cursor-pointer ${
            role === "manager"
              ? "bg-white text-orange-500 shadow"
              : "text-gray-500"
          }`}
          onClick={() => handleRoleChange("manager" || "employee")}
          type="button"
        >
          <FaUser className="text-base sm:text-lg" /> Employee
        </button>
      </div>

      <div className="bg-white w-full max-w-md rounded-lg shadow-md px-4 py-6 sm:px-6 sm:py-8">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
          {role === "admin" ? "Admin Login" : "Employee Login"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 text-sm sm:text-base"
        >
          {errors.email?.message && (
            <p className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm">
              {errors.email.message}
            </p>
          )}

          {role === "manager" && (
            <div>
              <label className="block font-medium mb-1">Department</label>
              <select
                {...register("department", {
                  required: "Department is required",
                })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
              >
                <option value="">Select Department</option>
                <option value="marketing">Marketing</option>
                <option value="it">IT</option>
                <option value="design">Design</option>
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
                  message: "Enter a valid email ending with .com",
                },
              })}
              placeholder="Enter your email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
            />
            {errors.email?.type !== "manual" && errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              placeholder="Enter your password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-orange-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition text-sm sm:text-base cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
