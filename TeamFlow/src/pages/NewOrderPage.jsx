import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { saveStep1, setStep } from "../features/orderDraftSlice";
import { showErrorToast, showSuccessToast } from "../utility/Toast";

const validationSchema = yup.object().shape({
  requestedBy: yup.string().required("Requested By is required"),
  serviceType: yup.string().required("Service Type is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum 10 characters required"),
  priority: yup.string().required("Priority is required"),
  assignedTo: yup.string().required("Assigned To is required"),
  dueDate: yup.string().required("Due Date is required"),
});

const NewOrderPage = () => {
  const step = useSelector((state) => state.orderDraft.step);
  const user = useSelector((state) => state.users);
  const draft = useSelector((state) => state.orderDraft);
  const dispatch = useDispatch();
  const setStepRedux = (val) => dispatch(setStep(val));
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      requestedBy: "",
      serviceType: "",
      description: "",
      priority: "",
      assignedTo: "",
      dueDate: "",
    },
  });

  const requestedBy = watch("requestedBy");

  const addOrderMutation = useMutation({
    mutationFn: (orderData) =>
      axios.post("https://json-server-8ch8.onrender.com/orders", orderData),
  });

  useEffect(() => {
    if (requestedBy) clearErrors("requestedBy");
  }, [requestedBy, clearErrors]);

  const handleNext = async () => {
    const isValid = await trigger("requestedBy");
    console.log(isValid);
    if (isValid) {
      dispatch(saveStep1({ requestedBy }));

      setStepRedux(2);
    }
  };

  const prevStep = () => setStepRedux(1);

  const onSubmit = async (data) => {
    const timeStamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    console.log(timeStamp, randomString);
    const uniqueId = `${timeStamp}-${randomString}`;
    console.log(uniqueId);
    const fullData = {
      ...data,
      department: user.department,
      id: uniqueId,
      status: "pending",
      sentToAdmin: false,
    };
    try {
      //to send it to json server
      await addOrderMutation.mutateAsync(fullData);
      showSuccessToast("Form Submitted Successfully");
      reset();
      setStepRedux(1);
    } catch (error) {
      showErrorToast("Failed to Submit the form");
    }
  };

  const handleClear = () => {
    reset();
    dispatch(resetDraft());
    setStepRedux(1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        Add New Order / Service
      </h2>

      {draft.isSubmitted ? (
        <div className="text-center">
          <p className="text-green-600 text-lg font-medium mb-4">
            ✅ This service is added to the final review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Requested By</label>
                <input
                  type="text"
                  {...register("requestedBy")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                  placeholder="e.g. Jane Doe"
                />
                {errors.requestedBy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requestedBy.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Department</label>
                <input
                  type="text"
                  value={user.department}
                  disabled
                  className="border px-4 py-2 w-full bg-gray-100 text-gray-700 rounded-md"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow cursor-pointer"
                >
                  Next
                </button>

                <button
                  type="button"
                  onClick={() => reset()}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Service Type</label>
                <select
                  {...register("serviceType")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm cursor-pointer"
                >
                  <option value="">Select Service</option>
                  <option value="it-support">IT Support</option>
                  <option value="design-task">Design Task</option>
                  <option value="campaign-request">Campaign Request</option>
                  <option value="marketing-support">Marketing Support</option>
                  <option value="software-access">
                    Software Access Request
                  </option>
                  <option value="hardware-replacement">
                    Hardware Replacement
                  </option>
                  <option value="network-issue">Network / Wi-Fi Issue</option>
                </select>
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  {...register("description")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                  rows={4}
                  placeholder="Describe the service needed"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Priority</label>
                <select
                  {...register("priority")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Tags(members)</label>
                <input
                  type="text"
                  {...register("assignedTo")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                  placeholder="e.g. John Smith"
                />
                {errors.assignedTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.assignedTo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md shadow cursor-pointer "
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow cursor-pointer"
                  disabled={addOrderMutation.isLoading}
                >
                  {addOrderMutation.isLoading ? "Submitting...." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default NewOrderPage;
