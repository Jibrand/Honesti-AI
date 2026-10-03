import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-[100dvh] md:h-screen bg-hc-bg text-hc-text overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-[100dvh] md:h-screen overflow-hidden relative pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
