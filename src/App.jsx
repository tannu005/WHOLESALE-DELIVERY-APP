import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  
  return children;
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (!splash) { setSplashDone(true); return; }

    const minDelay = setTimeout(() => {
      splash.classList.add('hide');
      const cleanup = setTimeout(() => {
        splash.remove();
        setSplashDone(true);
      }, 650);
      return () => clearTimeout(cleanup);
    }, 2000);

    return () => clearTimeout(minDelay);
  }, []);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/delivery" />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/delivery" 
            element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/delivery" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
