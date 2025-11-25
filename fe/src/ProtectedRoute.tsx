import React from 'react';
import {login} from "./api/auth";
import {Outlet, useNavigate} from "react-router-dom";

export default function ProtectedRoute() {
    const navigate = useNavigate();
    const user = null
    return user ? <Outlet/> : navigate("/login");
}
