import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet, useLocation } from 'react-router-dom';
import FloatingChatBot from '../FlotingChatbot';

function AppLayout() {
  const location = useLocation();
  const hideChatBot = location.pathname === "/chatbot";

  return (
    <div className="relative">
      <Header />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
      {!hideChatBot && <FloatingChatBot/>}
    </div>
  );
}

export default AppLayout;
