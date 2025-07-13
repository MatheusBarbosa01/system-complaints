import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintDetail from './pages/ComplaintDetail';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ComplaintsProvider } from './contexts/ComplaintsContext';
import DeletedComplaintsPage from './pages/DeletedComplaintsPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => (
  <AuthProvider>
    <ComplaintsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/complaints/new" element={<PrivateRoute><ComplaintForm /></PrivateRoute>} />
          <Route path="/complaints/deleted" element={<PrivateRoute><DeletedComplaintsPage /></PrivateRoute>} />
          <Route path="/complaints/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />
        </Routes>
      </Router>
    </ComplaintsProvider>
  </AuthProvider>
);

export default App;
