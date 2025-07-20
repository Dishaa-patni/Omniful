import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
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

const ManagerDashboard = () => {
  const user = useSelector((state) => state.users);
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get("http://localhost:3001/orders").then((res) => res.data),
  });

  const approvedOrders = orders.filter(
    (order) =>
      order.status === "approved" &&
      order.requestedBy?.toLowerCase() === user.name?.toLowerCase()
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-6">Welcome to TeamFlow 👋🏼</p>

      <h3 className="text-xl font-semibold mb-2 text-green-700">
        Approved Orders
      </h3>
      {isLoading ? (
        <div className="text-center p-6">Loading approved orders...</div>
      ) : error ? (
        <div className="text-center p-6 text-red-600">
          Error loading orders: {error.message}
        </div>
      ) : approvedOrders.length === 0 ? (
        <div className="text-center p-6 text-gray-600">
          No approved orders found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvedOrders.map((order, idx) => (
            <div
              key={order.id || idx}
              className="bg-white rounded-lg shadow p-5 border border-gray-100 flex flex-col gap-2 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold capitalize text-orange-700">
                  {order.serviceType.replace(/-/g, " ")}
                </span>
                {getStatusBadge(order.status)}
              </div>
              <div className="text-gray-700 mb-1">
                <span className="font-medium">Description: </span>
                {order.description}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Priority:</span>{" "}
                  {order.priority}
                </div>
                <div>
                  <span className="font-medium">Tags:</span>{" "}
                  {order.assignedTo}
                </div>
                <div>
                  <span className="font-medium">Due Date:</span> {order.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
