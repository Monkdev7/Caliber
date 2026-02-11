import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCachedUser, getSession } from '../lib/auth';

function PublicRoute({ children }) {
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            try {
                const cached = getCachedUser();
                if (cached) {
                    if (isMounted) setStatus('authenticated');
                    return;
                }

                const user = await getSession();
                if (isMounted) {
                    setStatus(user ? 'authenticated' : 'unauthenticated');
                }
            } catch (error) {
                if (isMounted) setStatus('unauthenticated');
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
                Checking session...
            </div>
        );
    }

    if (status === 'authenticated') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute;
