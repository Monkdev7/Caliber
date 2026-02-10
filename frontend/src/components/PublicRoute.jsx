import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

/**
 * TEMPORARY: Public Route component for frontend-only auth
 * 
 * This component prevents authenticated users from accessing
 * login/signup pages by redirecting them to the dashboard.
 * 
 * If authenticated, redirects to dashboard.
 * If not authenticated, renders the children (login/signup page).
 * 
 * TODO: Replace with proper authentication check when backend is ready.
 */
function PublicRoute({ children }) {
    if (isAuthenticated()) {
        // User is already authenticated, redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // User is not authenticated, render the public page
    return children;
}

export default PublicRoute;
