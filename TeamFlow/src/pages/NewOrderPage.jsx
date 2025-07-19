import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addService,
  saveStep1,
  saveStep2,
  markSubmitted,
  resetDraft,
} from "../features/orderDraftSlice.js"; // ✅ import

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
  const [step, setStep] = useState(1);
  //   const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.users);
  const draft = useSelector((state) => state.orderDraft);
  const dispatch = useDispatch();

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





  useEffect(() => {
    if (requestedBy) clearErrors("requestedBy");
  }, [requestedBy, clearErrors]);

  useEffect(() => {
    // only run once when component mounts
    if (!draft.step1 && !draft.step2 && !draft.isSubmitted) return;

    if (draft.isSubmitted) {
      setStep(2);
      reset({
        ...draft.step2,
        requestedBy: draft.step1?.requestedBy || "",
      });
    } else if (draft.step2) {
      reset({
        ...draft.step2,
        requestedBy: draft.step2.requestedBy || "",
      });
      setStep(2);
    } else if (draft.step1) {
      reset({ requestedBy: draft.step1.requestedBy });
      setStep(1);
    }
  }, []); // ← run this only once on mount (remove `draft` from deps)

  const handleNext = async () => {
    const isValid = await trigger("requestedBy");
    console.log(isValid);
    if (isValid) {
      dispatch(saveStep1({ requestedBy }));
      console.log(dispatch(saveStep1({ requestedBy })));
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  const onSubmit = (data) => {
    const fullData = { ...data, department: user.department };
    dispatch(addService(fullData));
    dispatch(saveStep2(data));
    dispatch(markSubmitted(true));
  };

  const handleAddAnother = () => {
    dispatch(markSubmitted(false))
    reset({
      requestedBy: draft.step1?.requestedBy || "",
      serviceType: "",
      description: "",
      priority: "",
      assignedTo: "",
      dueDate: "",
    });
    setStep(2);
  };

  const handleClear = () => {
    reset();
    dispatch(resetDraft()); // ✅ Clear Redux too
    setStep(1); // Optional: reset UI step
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
          <button
            onClick={handleAddAnother}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md shadow"
          >
            + Add Another Service
          </button>
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
                  className="border px-4 py-2 w-full rounded-md shadow-sm"
                >
                  <option value="">Select Service</option>
                  <option value="it-support">IT Support</option>
                  <option value="design-task">Design Task</option>
                  <option value="campaign-request">Campaign Request</option>
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
                <label className="block mb-1 font-medium">Assigned To</label>
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
                >
                  Submit
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


// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   addService,
//   saveStep1,
//   saveStep2,
//   markSubmitted,
//   resetDraft,
// } from "../features/orderDraftSlice.js";

// const validationSchema = yup.object().shape({
//   requestedBy: yup.string().required("Requested By is required"),
//   serviceType: yup.string().required("Service Type is required"),
//   description: yup
//     .string()
//     .required("Description is required")
//     .min(10, "Minimum 10 characters required"),
//   priority: yup.string().required("Priority is required"),
//   assignedTo: yup.string().required("Assigned To is required"),
//   dueDate: yup.string().required("Due Date is required"),
// });

// const NewOrderPage = () => {
//   const [step, setStep] = useState(1);
//   const user = useSelector((state) => state.users);
//   const draft = useSelector((state) => state.orderDraft);
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     reset,
//     formState: { errors },
//     clearErrors,
//     watch,
//   } = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       requestedBy: "",
//       serviceType: "",
//       description: "",
//       priority: "",
//       assignedTo: "",
//       dueDate: "",
//     },
//   });

//   const requestedBy = watch("requestedBy");

//   useEffect(() => {
//     if (requestedBy) clearErrors("requestedBy");
//   }, [requestedBy, clearErrors]);

//   useEffect(() => {
//     if (!draft.step1 && !draft.step2 && !draft.isSubmitted) return;

//     if (draft.isSubmitted) {
//       setStep(2);
//       reset({
//         ...draft.step2,
//         requestedBy: draft.step1?.requestedBy || "",
//       });
//     } else if (draft.step2) {
//       reset({
//         ...draft.step2,
//         requestedBy: draft.step1?.requestedBy || draft.step2?.requestedBy || "",
//       });
//       setStep(2);
//     } else if (draft.step1) {
//       reset({ requestedBy: draft.step1.requestedBy });
//       setStep(1);
//     }
//   }, [draft, reset]);

//   const handleNext = async () => {
//     const isValid = await trigger("requestedBy");
//     if (isValid) {
//       dispatch(saveStep1({ requestedBy }));
//       setStep(2);
//     }
//   };

//   const prevStep = () => setStep(1);

//   const onSubmit = (data) => {
//     const fullData = { ...data, department: user.department };
//     dispatch(addService(fullData));
//     dispatch(saveStep2(data));
//     dispatch(markSubmitted(true)); // ✅ set submitted
//   };

//   const handleAddAnother = () => {
//     dispatch(markSubmitted(false)); // ✅ reset isSubmitted
//     dispatch(
//       saveStep2({
//         serviceType: "",
//         description: "",
//         priority: "",
//         assignedTo: "",
//         dueDate: "",
//         requestedBy: draft.step1?.requestedBy || "",
//       })
//     );

//     reset({
//       requestedBy: draft.step1?.requestedBy || "",
//       serviceType: "",
//       description: "",
//       priority: "",
//       assignedTo: "",
//       dueDate: "",
//     });

//     setStep(2); // ✅ go straight to step 2 again
//   };

//   const handleClear = () => {
//     reset();
//     dispatch(resetDraft()); // ✅ Clear Redux too
//     setStep(1);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-3xl font-bold mb-6 text-orange-600">
//         Add New Order / Service
//       </h2>

//       {draft.isSubmitted ? (
//         <div className="text-center">
//           <p className="text-green-600 text-lg font-medium mb-4">
//             ✅ This service is added to the final review.
//           </p>
//           <button
//             onClick={handleAddAnother}
//             className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md shadow"
//           >
//             + Add Another Service
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {step === 1 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block mb-1 font-medium">Requested By</label>
//                 <input
//                   type="text"
//                   {...register("requestedBy")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                   placeholder="e.g. Jane Doe"
//                 />
//                 {errors.requestedBy && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.requestedBy.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Department</label>
//                 <input
//                   type="text"
//                   value={user.department}
//                   disabled
//                   className="border px-4 py-2 w-full bg-gray-100 text-gray-700 rounded-md"
//                 />
//               </div>

//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow cursor-pointer"
//                 >
//                   Next
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow cursor-pointer"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block mb-1 font-medium">Service Type</label>
//                 <select
//                   {...register("serviceType")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                 >
//                   <option value="">Select Service</option>
//                   <option value="it-support">IT Support</option>
//                   <option value="design-task">Design Task</option>
//                   <option value="campaign-request">Campaign Request</option>
//                 </select>
//                 {errors.serviceType && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.serviceType.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Description</label>
//                 <textarea
//                   {...register("description")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                   rows={4}
//                   placeholder="Describe the service needed"
//                 />
//                 {errors.description && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.description.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Priority</label>
//                 <select
//                   {...register("priority")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                 >
//                   <option value="">Select Priority</option>
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//                 {errors.priority && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.priority.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Assigned To</label>
//                 <input
//                   type="text"
//                   {...register("assignedTo")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                   placeholder="e.g. John Smith"
//                 />
//                 {errors.assignedTo && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.assignedTo.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Due Date</label>
//                 <input
//                   type="date"
//                   {...register("dueDate")}
//                   className="border px-4 py-2 w-full rounded-md shadow-sm"
//                 />
//                 {errors.dueDate && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.dueDate.message}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-md shadow cursor-pointer"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleClear}
//                   className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow cursor-pointer"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow cursor-pointer"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           )}
//         </form>
//       )}
//     </div>
//   );
// };

// export default NewOrderPage;
