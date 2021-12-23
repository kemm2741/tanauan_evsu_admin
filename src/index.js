import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Auth State
import AuthState from "./context/auth/AuthState";

ReactDOM.render(
  <AuthState>
    <App />
  </AuthState>,
  document.getElementById("root")
);
