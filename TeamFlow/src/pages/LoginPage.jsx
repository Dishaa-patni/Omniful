// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { login } from "../features/userSlice";

// const LoginPage = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setError,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);

//   const selectedRole = watch("role");

//   useEffect(() => {
//     fetch("/data/users.json")
//       .then((res) => res.json())
//       .then((data) => setUsers(data));
//   }, []);

//   const onSubmit = (formData) => {
//     const { email, role, department } = formData;

//     const matchedUser = users.find((user) => {
//       return (
//         user.email.toLowerCase() === email.toLowerCase() &&
//         user.role.toLowerCase() === role.toLowerCase() &&
//         (role === "admin" ||
//           user.department.toLowerCase() === department.toLowerCase())
//       );
//     });

//     if (!matchedUser) {
//       setError("email", {
//         type: "manual",
//         message: "❌ Invalid credentials or unauthorized access.",
//       });
//       return;
//     }
//     if (matchedUser.role !== role.toLowerCase()) {
//       setError("email", {
//         type: "manual",
//         message: "❌ You are not authorized to access the " + role + " panel.",
//       });
//       return;
//     }
//     console.log("Submitting login with form data:", formData);
//     console.log("Matched user:", matchedUser);

//     dispatch(login(matchedUser));
//     localStorage.setItem("user", JSON.stringify(matchedUser));

//     dispatch(login(matchedUser));
//     console.log("Dispatched login to Redux with:", matchedUser);

//     navigate(
//       matchedUser.role === "admin" ? "/dashboard" : "/manager-dashboard"
//     );
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-8 rounded shadow-md w-96"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {errors.email?.type === "manual" && (
//           <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
//             {errors.email.message}
//           </p>
//         )}

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Role</label>
//           <select
//             {...register("role", { required: true })}
//             className="w-full border rounded px-3 py-2"
//           >
//             <option value="">Select Role</option>
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//           </select>
//           {errors.role && (
//             <p className="text-red-500 text-sm mt-1">Role is required</p>
//           )}
//         </div>

//         {selectedRole === "manager" && (
//           <div className="mb-4">
//             <label className="block mb-1 font-medium">Department</label>
//             <select
//               {...register("department", { required: true })}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">Select Department</option>
//               <option value="marketing">Marketing</option>
//               <option value="it">IT</option>
//               <option value="design">Design</option>
//             </select>
//             {errors.department && (
//               <p className="text-red-500 text-sm mt-1">
//                 Department is required
//               </p>
//             )}
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             {...register("email", {
//               required: "Emaill is required",
//               pattern: {
//                 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
//                 message: "Please enter a valid email ending with .com",
//               },
//             })}
//             className="w-full border rounded px-3 py-2"
//             placeholder="Enter your email"
//           />
//           {errors.email?.type === "required" && (
//             <p className="text-red-500 text-sm mt-1">Email is required</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             {...register("password", {
//               required: "Password is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters",
//               },
//               pattern: {
//                 value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
//                 message: "Must contain letters and numbers",
//               },
//             })}
//             className="w-full border rounded px-3 py-2"
//             placeholder="Enter your email"
//           />
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

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
    const { email, role, password, department } = formData;

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

    if (role === "manager") {
      if (matchedUser.role !== "manager") {
        setError("email", {
          type: "manual",
          message: "You don't have access",
        });
        return;
      }

      if (matchedUser.department?.toLowerCase() !== department?.toLowerCase()) {
        setError("email", {
          type: "manual",
          message: "Invalid credentials",
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
      matchedUser.role === "admin" ? "/dashboard" : "/manager-dashboard"
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-md bg-slate-100 rounded-lg shadow-md mb-4 p-3">
        <button
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md font-medium transition cursor-pointer ${
            role === "admin"
              ? "bg-white text-orange-500 shadow"
              : "text-gray-500"
          }`}
          onClick={() => handleRoleChange("admin")}
          type="button"
        >
          <FaUser /> Admin
        </button>

        <button
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md font-medium transition cursor-pointer ${
            role === "manager"
              ? "bg-white text-orange-500 shadow"
              : "text-gray-500"
          }`}
          onClick={() => handleRoleChange("manager")}
          type="button"
        >
          Manager
        </button>
      </div>

      <div className="bg-white p-6 rounded-b-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-2">
          {role === "admin" ? "Admin Login" : "Manager Login"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.email?.message && (
            <p className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm">
              {errors.email.message}
            </p>
          )}

          {role === "manager" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
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
            <label className="block text-sm font-medium mb-1">Email</label>
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
            <label className="block text-sm font-medium mb-1">Password</label>
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
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
