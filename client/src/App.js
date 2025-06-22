import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Achievements from "./pages/Achievements";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';



function App() {
  const { user } = useAuth();

  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    if (root) {
      if (isAuthPage) {
        root.classList.add('flex', 'items-center', 'justify-center');
      }
      else if (location.pathname === '/' && !user) {
        root.classList.add('flex', 'items-center', 'justify-center');
      }
      else {
        root.classList.remove('flex', 'items-center', 'justify-center');
      }
    }
  }, [location.pathname, user]);

  return (

    <>
      <Toaster position="top-right" reverseOrder={false}  />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </>

  );
}

export default App;

