import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoutes } from "./routes/AppRoutes";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

