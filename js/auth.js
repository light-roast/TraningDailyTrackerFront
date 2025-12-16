// Authentication utility functions

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token
 */
function saveToken(token) {
    localStorage.setItem('token', token);
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Remove JWT token from localStorage
 */
function removeToken() {
    localStorage.removeItem('token');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists, false otherwise
 */
function isAuthenticated() {
    return getToken() !== null;
}

/**
 * Logout user by removing token and redirecting to home
 */
function logout() {
    removeToken();
    window.location.href = 'index.html';
}

/**
 * Redirect to login page if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
