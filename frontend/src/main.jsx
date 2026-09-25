import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/global.css";

import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary/AppErrorBoundary";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
