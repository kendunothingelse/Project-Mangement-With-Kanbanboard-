// src/App.tsx
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";
import WorkspacePage from "./pages/WorkspacePage";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/board/:boardId" element={<KanbanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
