import React from "react";
import { useSelector } from "react-redux";

const ManagerFinalReviewPage = () => {
  const services = useSelector((state) => state.orderDraft.services);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Final Review Table
      </h2>

      {services.length === 0 ? (
        <p className="text-gray-600">No services added yet.</p>
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
                <th className="border px-4 py-2 text-left">Assigned To</th>
                <th className="border px-4 py-2 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{service.requestedBy}</td>
                  <td className="border px-4 py-2">{service.department}</td>
                  <td className="border px-4 py-2 capitalize">
                    {service.serviceType}
                  </td>
                  <td className="border px-4 py-2">{service.description}</td>
                  <td className="border px-4 py-2 capitalize">
                    {service.priority}
                  </td>
                  <td className="border px-4 py-2">{service.assignedTo}</td>
                  <td className="border px-4 py-2">{service.dueDate}</td>
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
