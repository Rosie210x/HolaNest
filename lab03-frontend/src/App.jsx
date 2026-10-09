import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} isAuthenticated={isAuthenticated} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
