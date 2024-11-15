import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/App.css";
import "./assets/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import GenerateLog from "./pages/GenerateLog";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <GenerateLog />
  </React.StrictMode>
);
