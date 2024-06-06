import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Routing from "./Routing.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Routing />
        <ToastContainer />
    </Provider>
);
