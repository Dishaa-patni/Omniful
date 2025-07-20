import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAbility } from "../utility/AbilityContext.jsx";
import axios from "axios";

const PRIORITY_OPTIONS = ["low", "medium", "high"];
const SERVICE_TYPE_OPTIONS = ["it-support", "design-task", "campaign-request","marketing-support","software-access","network-issue","hardware-replacement"];

const ManagerFinalReviewPage = () => {
  const user = useSelector((state) => state.users);
  const ability = useAbility();
  const queryClient = useQueryClient();
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get("http://localhost:3001/orders").then((res) => res.data),
  });
  console.log(orders);

  const reviewOrders = orders.filter((order) => {
    //this will show the orders that it not send to admin for approvals and if sent then it will be removed
    if (order.sentToAdmin === true) {
      return false;
    }

    if (user.role === "manager") {
      if (order.requestedBy?.toLowerCase() === user.name?.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    }
    if (user.role === "employee") {
      return order.department === user.department;
    }

    if (user.role === "admin") {
      return true;
    }

    return false;
  });

  //put->for updation even if 1 value is changed we need to send complete data so instead we can use patch
  const sendToAdminMutation = useMutation({
    mutationFn: async (order) => {
      await axios.patch(`http://localhost:3001/orders/${order.id}`, {
        sentToAdmin: true,
        status: "pending",
      });

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const adminInboxId = `admin-${timestamp}-${randomString}`;

      const adminInboxOrder = {
        ...order,
        id: adminInboxId,
        sentToAdmin: true,
        status: "pending",
      };

      await axios.post(`http://localhost:3001/adminInbox`, adminInboxOrder);
    },

    //rather than manually updating everytime the cache orders we can do this - it will refresh with new orders
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["adminInbox"] });
    },
    onError: (error) => {
      console.error("Error sending to admin:", error);
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      axios.patch(`http://localhost:3001/orders/${orderId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) =>
      axios.delete(`http://localhost:3001/orders/${orderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setDeleteConfirmId(null);
    },
  });

  const editOrderMutation = useMutation({
    mutationFn: ({ orderId, editForm }) =>
      axios.patch(`http://localhost:3001/orders/${orderId}`, editForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setEditingOrderId(null);
      setEditForm({});
    },
  });

  const handleSendToAdmin = (order, e) => {
    e?.preventDefault();
    sendToAdminMutation.mutate(order);
  };
  const handleStatusUpdate = (orderId, newStatus, e) => {
    e?.preventDefault();
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleDelete = (orderId, e) => {
    e?.preventDefault();
    setDeleteConfirmId(orderId);
  };

  const confirmDelete = (orderId, e) => {
    e?.preventDefault();
    deleteOrderMutation.mutate(orderId);
  };

  const cancelDelete = (e) => {
    e?.preventDefault();
    setDeleteConfirmId(null);
  };

  const handleEditClick = (order, e) => {
    e?.preventDefault();
    setEditingOrderId(order.id);
    setEditForm({ ...order });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (orderId, e) => {
    e?.preventDefault();
    editOrderMutation.mutate({ orderId, editForm });
  };

  const handleEditCancel = (e) => {
    e?.preventDefault();
    setEditingOrderId(null);
    setEditForm({});
  };

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

  if (isLoading)
    return <div className="text-center p-6">Loading orders...</div>;
  if (error)
    return (
      <div className="text-center p-6 text-red-600">
        Error loading orders: {error.message}
      </div>
    );

  return (
    <div className="mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Final Review Table
      </h2>

      {reviewOrders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
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
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewOrders.map((order, index) => (
                <tr
                  key={order.id || index}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${editingOrderId === order.id ? "bg-yellow-50" : ""}`}
                >
                  {editingOrderId === order.id ? (
                    <>
                      <td className="border px-4 py-2">
                        {/* <input
                          name="requestedBy"
                          value={editForm.requestedBy || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        /> */}
                        {order.requestedBy}
                      </td>
                      <td className="border px-4 py-2">
                        {/* <input
                          name="department"
                          value={editForm.department || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        /> */}
                        {order.department}
                      </td>
                      <td className="border px-4 py-2">
                        <select
                          name="serviceType"
                          value={editForm.serviceType || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        >
                          <option value="">Select Service</option>
                          {SERVICE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          name="description"
                          value={editForm.description || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <select
                          name="priority"
                          value={editForm.priority || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        >
                          <option value="">Select Priority</option>
                          {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          name="assignedTo"
                          value={editForm.assignedTo || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          name="dueDate"
                          type="date"
                          value={editForm.dueDate || ""}
                          onChange={handleEditChange}
                          className="border px-2 py-1 rounded w-full focus:ring focus:border-orange-400 bg-white"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            title="Save"
                            onClick={(e) => handleEditSave(order.id, e)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                            disabled={editOrderMutation.isPending}
                          >
                            ? Save
                          </button>
                          <button
                            type="button"
                            title="Cancel"
                            onClick={(e) => handleEditCancel(e)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                          >
                            ? Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{order.requestedBy}</td>
                      <td className="border px-4 py-2">{order.department}</td>
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
                        <div className="flex gap-2 flex-nowrap items-center whitespace-nowrap overflow-x-auto min-w-0">
                          {ability.can("send", "Order") && (
                            <button
                              type="button"
                              title="Send to Admin"
                              onClick={(e) => handleSendToAdmin(order, e)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                              disabled={sendToAdminMutation.isPending}
                            >
                              📩 Send to Admin
                            </button>
                          )}
                          {ability.can("update", "Order") && (
                            <button
                              type="button"
                              title="Edit"
                              onClick={(e) => handleEditClick(order, e)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                          {ability.can("delete", "Order") && (
                            <button
                              type="button"
                              title="Delete"
                              onClick={(e) => handleDelete(order.id, e)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                              disabled={deleteOrderMutation.isPending}
                            >
                               Delete
                            </button>
                          )}
                          {deleteConfirmId === order.id && (
                            <span className="ml-2 flex items-center gap-2 whitespace-nowrap">
                              <span className="text-sm text-gray-700">
                                Confirm?
                              </span>
                              <button
                                type="button"
                                onClick={(e) => confirmDelete(order.id, e)}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={(e) => cancelDelete(e)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded text-xs"
                              >
                                No
                              </button>
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerFinalReviewPage;
