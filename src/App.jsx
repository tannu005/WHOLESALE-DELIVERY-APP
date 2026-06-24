import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // splash screen handles the loading visual
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'DELIVERY') return <Navigate to="/delivery" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function Gatekeeper() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === 'DELIVERY') {
    return <Navigate to="/delivery" replace />;
  }
  return <Navigate to="/login" replace />;
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
          <Route 
            path="/" 
            element={
              <Gatekeeper />
            } 
          />
          <Route path="/login" element={<Login appMode="delivery" />} />
          
          {/* Protected Routes */}
          <Route 
            path="/delivery" 
            element={
              <ProtectedRoute allowedRoles={['DELIVERY']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
