import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const OrderPage = () => {
  const queryClient = useQueryClient();

  const {
    data: adminOrders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminInbox"],
    queryFn: () =>
      axios.get("https://json-server-8ch8.onrender.com/adminInbox").then((res) => res.data),
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      console.log("Updating order:", orderId, "to status:", status);

      await axios.patch(`https://json-server-8ch8.onrender.com/adminInbox/${orderId}`, {
        status,
      });

      const adminOrder = await axios.get(
        `https://json-server-8ch8.onrender.com/adminInbox/${orderId}`
      );
      const originalOrders = await axios.get("https://json-server-8ch8.onrender.com/orders");

      const originalOrder = originalOrders.data.find(
        (order) =>
          order.requestedBy === adminOrder.data.requestedBy &&
          order.serviceType === adminOrder.data.serviceType &&
          order.description === adminOrder.data.description &&
          order.dueDate === adminOrder.data.dueDate &&
          order.sentToAdmin === true
      );

      if (originalOrder) {
        await axios.patch(`https://json-server-8ch8.onrender.com/orders/${originalOrder.id}`, {
          status,
        });
      }
    },
    onSuccess: (data, variables) => {
      console.log(
        "Successfully updated order:",
        variables.orderId,
        "to:",
        variables.status
      );
      queryClient.invalidateQueries(["adminInbox"]);
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error, variables) => {
      console.error(
        "Error updating order:",
        variables.orderId,
        "Error:",
        error
      );
    },
  });

  const handleApprove = (orderId, e) => {
    e?.preventDefault();
    console.log("Approving order:", orderId);
    updateOrderStatus.mutate({ orderId, status: "approved" });
  };

  const handleReject = (orderId, e) => {
    e?.preventDefault();
    console.log("Rejecting order:", orderId);
    updateOrderStatus.mutate({ orderId, status: "rejected" });
  };

  return (
    <div className="mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Admin Orders Review
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          Review and take action on orders sent to admin. You can approve or
          reject each request.
        </p>
      </div>

      {updateOrderStatus.isError && (
        <div className="mb-4 p-4 bg-red-50 rounded border-l-4 border-red-400">
          <p className="text-sm text-red-800">
            Error:{" "}
            {updateOrderStatus.error?.response?.data?.message ||
              updateOrderStatus.error?.message}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-6">Loading orders...</div>
      ) : error ? (
        <div className="text-center p-6 text-red-600">
          Error loading orders: {error.message}
        </div>
      ) : adminOrders.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-600">
            No orders have been sent to admin yet.
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
                <th className="border px-4 py-2 text-left">Tags</th>
                <th className="border px-4 py-2 text-left">Due Date</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.map((order, idx) => (
                <tr
                  key={order.id}
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
                  <td className="border px-4 py-2">
                    {order.status === "pending" ? (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleApprove(order.id, e)}
                          disabled={updateOrderStatus.isPending}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updateOrderStatus.isPending
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleReject(order.id, e)}
                          disabled={updateOrderStatus.isPending}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updateOrderStatus.isPending
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {order.status === "approved"
                          ? "✅ Approved"
                          : "❌ Rejected"}
                      </span>
                    )}
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

export default OrderPage;
