import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { userService } from "./api/user";
import { login, logout } from "./store/auth/auth";

const App = () => {
    const dispatch = useDispatch();

    const checkLoggedIn = async () => {
        const result = await userService.profile();
        if (result) dispatch(login(result));
        else dispatch(logout());
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    return <Outlet />;
};

export default App;
