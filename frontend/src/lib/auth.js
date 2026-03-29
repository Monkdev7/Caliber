const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE = rawBase.replace(/\/?api\/?$/, '').replace(/\/$/, '');

let csrfToken = null;
let cachedUser = null;

const parseJson = async response => {
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
};

const getErrorMessage = data =>
    data?.message || data?.error || 'Request failed';

const withCredentials = {
    credentials: 'include',
};

const ensureCsrfToken = async () => {
    if (csrfToken !== null) return csrfToken;

    const response = await fetch(`${API_BASE}/api/security/csrf`, {
        ...withCredentials,
    });
    const data = await parseJson(response);

    if (!response.ok) {
        throw new Error(getErrorMessage(data));
    }

    csrfToken = data?.csrfToken || null;
    return csrfToken;
};

const apiRequest = async (path, options = {}) => {
    const { method = 'GET', body, requireCsrf = false } = options;
    const headers = { 'Content-Type': 'application/json' };

    if (requireCsrf) {
        const token = await ensureCsrfToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...withCredentials,
    });

    const data = await parseJson(response);

    if (!response.ok || data?.success === false) {
        const error = new Error(getErrorMessage(data));
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

const normalizeUser = user => {
    if (!user) return null;
    return {
        id: user.id || user._id || null,
        fullName: user.fullName || user.name || '',
        email: user.email || '',
    };
};

export const getCachedUser = () => cachedUser;

export const signup = async (fullName, email, password) => {
    const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: { fullName, email, password },
        requireCsrf: true,
    });

    cachedUser = normalizeUser(data?.data?.user);
    return cachedUser;
};

export const login = async (email, password) => {
    const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        requireCsrf: true,
    });

    cachedUser = normalizeUser(data?.data?.user);
    return cachedUser;
};

export const logout = async () => {
    await apiRequest('/api/auth/logout', {
        method: 'POST',
        requireCsrf: true,
    });

    cachedUser = null;
};

export const requestPasswordReset = async email => {
    return apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
        requireCsrf: true,
    });
};

export const resetPassword = async (token, password) => {
    await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password },
        requireCsrf: true,
    });

    cachedUser = null;
};

export const refreshSession = async () => {
    const data = await apiRequest('/api/auth/refresh', {
        method: 'POST',
        requireCsrf: true,
    });

    cachedUser = normalizeUser(data?.data?.user);
    return cachedUser;
};

export const getSession = async () => {
    try {
        const data = await apiRequest('/api/auth/me');
        cachedUser = normalizeUser(data?.data?.user);
        return cachedUser;
    } catch (error) {
        if (error.status === 401) {
            try {
                return await refreshSession();
            } catch (refreshError) {
                cachedUser = null;
                return null;
            }
        }

        throw error;
    }
};
