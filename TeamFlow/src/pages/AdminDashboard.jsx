import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DashboardPage = () => {
  const {
    data: adminOrders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminInbox"],
    queryFn: () =>
      axios.get("http://localhost:3001/adminInbox").then((res) => res.data),
  });

  const totalOrdersRecieved = adminOrders.length;
  const pendingReview = adminOrders.filter(
    (order) => order.status === "pending"
  ).length;
  const approvedOrders = adminOrders.filter(
    (order) => order.status === "approved"
  ).length;
  const rejectedOrders = adminOrders.filter(
    (order) => order.status === "rejected"
  ).length;

  const departmentStats = adminOrders.reduce((acc, order) => {
    if (order.department) {
      acc[order.department] = (acc[order.department] || 0) + 1;
    }
    return acc;
  }, {});

  const priorityStats = adminOrders.reduce((acc, order) => {
    if (order.priority) {
      acc[order.priority] = (acc[order.priority] || 0) + 1;
    }
    return acc;
  }, {});

  if (isLoading)
    return <div className="text-center p-6">Loading dashboard...</div>;
  if (error)
    return (
      <div className="text-center p-6 text-red-600">
        Error loading dashboard: {error.message}
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Admin Dashboard
      </h2>
      <p className="text-gray-600 mb-8">Welcome to TeamFlow Admin Panel 👋🏼</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📤</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOrdersRecieved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {approvedOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {rejectedOrders}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingReview}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Orders by Department
          </h3>
          {Object.keys(departmentStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(departmentStats).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {dept}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No department data available
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Orders by Priority
          </h3>
          {Object.keys(priorityStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div
                  key={priority}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {priority}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No priority data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
