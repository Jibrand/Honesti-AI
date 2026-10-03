import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { API_URL } from '../api';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Fetching profile acts as our token verification since it requires authMiddleware
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          // Token is valid and not expired
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0b0f19] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0077ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[13px] font-bold text-gray-400 tracking-wider animate-pulse">
            Verifying secure access...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
