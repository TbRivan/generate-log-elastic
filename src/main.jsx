import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import GenerateLog from "./pages/GenerateLog";
import "./assets/App.css";
import "./assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <GenerateLog />
  </React.StrictMode>
);
