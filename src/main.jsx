import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import ExcelUploader from "./UploadExcel.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <ExcelUploader />
  </React.StrictMode>
);
