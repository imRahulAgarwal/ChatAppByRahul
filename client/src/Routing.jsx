import React from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { useSelector } from "react-redux";

const Routing = () => {
    const { status } = useSelector((state) => state.auth);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route index element={<Navigate to={!status ? "/login" : "/dashboard"} />} />
                <Route path="login" element={!status ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="register" element={!status ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="forgot-password" element={!status ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
                <Route path="reset-password/:token" element={!status ? <ResetPassword /> : <Navigate to="/dashboard" />} />
                <Route path="dashboard" element={status ? <Dashboard /> : <Navigate to="/login" />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default Routing;
