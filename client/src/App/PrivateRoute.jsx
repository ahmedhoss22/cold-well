// src/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Api from '../Api/ApiCalls';

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await Api.get('/auth/protected', {
          headers: { Authorization: token },
        });
  
        if (res.data) setIsAuthenticated(true);
      } catch (err) {
       
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />
      </div>
    );

  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
