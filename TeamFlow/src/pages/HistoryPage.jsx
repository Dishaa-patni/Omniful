import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useAbility } from "../utility/AbilityContext.jsx";
import axios from "axios";

const getStatusBadge = (status) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || statusColors.pending
      }`}
    >
      {status?.toUpperCase() || "PENDING"}
    </span>
  );
};

const HistoryPage = () => {
  const user = useSelector((state) => state.users);
  const ability = useAbility();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get("https://json-server-8ch8.onrender.com/orders").then((res) => res.data),
  });

  const mySentOrders = orders.filter((order) => {
    if (order.sentToAdmin !== true) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "manager") {
      return order.requestedBy?.toLowerCase() === user.name?.toLowerCase();
    }

    if (user.role === "employee") {
      return order.department === user.department;
    }

    return false;
  });

  const sortedMySentOrders = [...mySentOrders].reverse();
  const getPageTitle = () => {
    if (user.role === "admin") {
      return "All Sent Requests History";
    } else if (user.role === "manager") {
      return "My Sent Requests History";
    } else if (user.role === "employee") {
      return `${user.department?.toUpperCase()} Department History`;
    }
    return "History";
  };

  return (
    <div className="mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        {getPageTitle()}
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          {user.role === "admin" &&
            "Showing all orders sent to admin across all departments."}
          {user.role === "manager" &&
            `Showing your orders that have been sent to admin.`}
          {user.role === "employee" &&
            `Showing orders from ${user.department} department managers that have been sent to admin.`}
        </p>
      </div>
      {isLoading ? (
        <div className="text-center p-6">Loading history...</div>
      ) : error ? (
        <div className="text-center p-6 text-red-600">
          Error loading history: {error.message}
        </div>
      ) : mySentOrders.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-600">
            {user.role === "admin" && "No orders have been sent to admin yet."}
            {user.role === "manager" &&
              "You have not sent any requests to admin yet."}
            {user.role === "employee" &&
              `No orders from ${user.department} department have been sent to admin yet.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded shadow-lg bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Requested By</th>
                <th className="border px-4 py-2 text-left">Department</th>
                <th className="border px-4 py-2 text-left">Service Type</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Priority</th>
                <th className="border px-4 py-2 text-left">Tag</th>
                <th className="border px-4 py-2 text-left">Due Date</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedMySentOrders.map((order, idx) => (
                <tr
                  key={order.id || idx}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border px-4 py-2 font-medium">
                    {order.requestedBy}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {order.department}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {order.serviceType}
                  </td>
                  <td className="border px-4 py-2">{order.description}</td>
                  <td className="border px-4 py-2 capitalize">
                    {order.priority}
                  </td>
                  <td className="border px-4 py-2">{order.assignedTo}</td>
                  <td className="border px-4 py-2">{order.dueDate}</td>
                  <td className="border px-4 py-2">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
