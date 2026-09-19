import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          {/* Placeholders for other routes */}
          <Route path="chat" element={<div className="p-8">Talk to Honesti (WIP)</div>} />
          <Route path="kitchen" element={<div className="p-8">Kitchen (WIP)</div>} />
          <Route path="pantry" element={<div className="p-8">Pantry (WIP)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
