/**
 * TEMPORARY FRONTEND-ONLY AUTHENTICATION
 * 
 * This is a mock authentication system for development purposes.
 * It uses localStorage to simulate authentication state.
 * 
 * TODO: Replace this entire file with real backend authentication
 * when the backend auth API is ready.
 */

const AUTH_TOKEN_KEY = 'caliber_mock_auth_token';
const AUTH_USER_KEY = 'caliber_mock_auth_user';

/**
 * Simulates user login by storing a mock token in localStorage
 * @param {string} email - User's email
 * @param {string} password - User's password (not validated in mock)
 * @returns {Promise<object>} Mock user data
 */
export const mockLogin = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Create mock token and user data
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockUser = {
        email,
        name: email.split('@')[0],
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        loginTime: new Date().toISOString(),
    };
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
    
    return mockUser;
};

/**
 * Simulates user signup by storing a mock token in localStorage
 * @param {string} fullName - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password (not validated in mock)
 * @returns {Promise<object>} Mock user data
 */
export const mockSignup = async (fullName, email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Create mock token and user data
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockUser = {
        email,
        name: fullName,
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        signupTime: new Date().toISOString(),
    };
    
    // Store in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
    
    return mockUser;
};

/**
 * Logs out the user by removing auth data from localStorage
 */
export const mockLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

/**
 * Checks if user is authenticated by looking for token in localStorage
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
};

/**
 * Gets the current user data from localStorage
 * @returns {object|null} User data or null if not authenticated
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
    }
};

/**
 * Gets the mock token from localStorage
 * @returns {string|null} Token or null if not authenticated
 */
export const getToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};
