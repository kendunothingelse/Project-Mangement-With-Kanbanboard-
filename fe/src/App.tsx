// src/App.tsx
import React, {JSX} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";
import WorkspacePage from "./pages/WorkspacePage";
import {useAuth} from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function RequireAuth({children}: { children: JSX.Element }) {
    const {user, loading} = useAuth();
    const location = useLocation();
    if (loading) return null;
    if (!user) return <Navigate to="/login" state={{from: location}} replace/>;
    return children;
}

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/" element={
                    <RequireAuth>
                        <WorkspacePage/>
                    </ RequireAuth>
                }/>
                <Route path="/board/:boardId" element={
                    <RequireAuth>
                        <KanbanPage/>
                    </ RequireAuth>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
