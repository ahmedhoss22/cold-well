import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return (
    <ToastContainer
      autoClose={4000}
      limit={1}
      className="toaster-container"
      position="top-right"
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

export default Toaster;
