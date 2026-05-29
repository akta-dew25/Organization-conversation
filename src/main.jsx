import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router } from "react-router-dom";
import AuthInitializer from "./components/AuthIntializer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        {/* <AuthInitializer> */}
        <App />
        {/* </AuthInitializer> */}
      </Router>
    </Provider>
  </React.StrictMode>,
);
