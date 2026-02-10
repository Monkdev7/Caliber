import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import JobsHome from './pages/JobsHome';
import AuthLogin from './pages/AuthLogin';
import AuthSignup from './pages/AuthSignup';
import AuthForgotPassword from './pages/AuthForgotPassword';
import AuthResetPassword from './pages/AuthResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<JobsHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/signup" element={<AuthSignup />} />
        <Route path="/forgot-password" element={<AuthForgotPassword />} />
        <Route path="/reset-password" element={<AuthResetPassword />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
