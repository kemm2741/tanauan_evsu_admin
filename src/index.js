import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// Auth State
import AuthState from "./context/auth/AuthState";

ReactDOM.render(
  <AuthState>
    <App />
  </AuthState>,
  document.getElementById("root")
);
