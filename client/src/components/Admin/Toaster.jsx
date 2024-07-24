import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return (
    <ToastContainer
      autoClose={1000}
      limit={1}
      className="toaster-container"
      position="bottom-right"
      onClick={() => toast.dismiss()}
    />
  );
};
export const notifySuccess = (message) => {
  toast.success(message || "Successfully Created!");
};

export const notifyError = (message) => {
  toast.error(message || "An error occurred!");
};
export const notify = () => {
    toast.success("Successfully Created!");
  };
export default Toaster;
