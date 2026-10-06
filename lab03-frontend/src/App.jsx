import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
      setUser({ email: 'Admin' }); 
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location.pathname]);

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