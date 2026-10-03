import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Household from './pages/Household';
import Cookbook from './pages/Cookbook';
import Pantry from './pages/Pantry';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Chat from './pages/Chat';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0f1523',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            padding: '8px 12px',
            borderRadius: '8px'
          }
        }}
      />
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/cookbook" element={<Cookbook />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/garden" element={<div className="p-8">HonestGarden (WIP)</div>} />
            <Route path="/chefs" element={<div className="p-8">Little Chefs (WIP)</div>} />
            <Route path="/household" element={<Household />} />
            <Route path="/settings" element={<div className="p-8">Settings (WIP)</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
