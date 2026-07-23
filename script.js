// ========================================
// LANDING PAGE LOGIC
// ========================================

// Initialize Google OAuth
function initGoogleLogin() {
    window.google?.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
}

// Handle Google Sign-In Response
function handleGoogleResponse(response) {
    if (response.credential) {
        // Decode the JWT token to get user info
        const payload = parseJwt(response.credential);
        
        // Store user info in session
        sessionStorage.setItem('user', JSON.stringify({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            token: response.credential
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Helper: Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Check if user is already logged in
function checkAuth() {
    const user = sessionStorage.getItem('user');
    if (user && window.location.pathname.includes('dashboard.html')) {
        // Already on dashboard
        return;
    }
    if (user && !window.location.pathname.includes('dashboard.html')) {
        // Redirect to dashboard if logged in
        window.location.href = 'dashboard.html';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Google login
    initGoogleLogin();
    
    // Check authentication status
    checkAuth();
    
    // Login buttons
    const loginBtns = document.querySelectorAll('#loginBtn, #heroLoginBtn');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.google?.accounts.id.prompt();
        });
    });
});

console.log('✅ MasterComputer site loaded successfully!');