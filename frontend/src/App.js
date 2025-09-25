import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App(){
  const token = localStorage.getItem('token');
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/" element={ token ? <Dashboard/> : <Navigate to="/login" /> } />
    </Routes>
  )
}

export default App;
