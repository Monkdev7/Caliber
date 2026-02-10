import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

/**
 * TEMPORARY: Protected Route component for frontend-only auth
 * 
 * This component checks if the user has a mock auth token.
 * If authenticated, renders the children (protected page).
 * If not authenticated, redirects to login page.
 * 
 * TODO: Replace with proper authentication check when backend is ready.
 */
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        // User is not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the protected content
    return children;
}

export default ProtectedRoute;
