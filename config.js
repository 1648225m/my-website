// ========================================
// 🔐 CONFIGURATION - EDIT THIS FILE
// ========================================

// Your Google OAuth Credentials (from Google Cloud Console)
const CONFIG = {
    // Google Client ID - from your OAuth 2.0 credentials
    GOOGLE_CLIENT_ID: '833682235331-glvl2clq7ahgh00c7gjjoc0o35536aic.apps.googleusercontent.com',
    
    // Your GitHub Personal Access Token (with 'repo' scope)
    // ⚠️ IMPORTANT: This token gives access to your repository!
    // Store it securely - never commit this file to public repos!
    GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE',
    
    // Your GitHub repo details
    GITHUB_REPO_OWNER: '1648225m',
    GITHUB_REPO_NAME: 'my-website',
    GITHUB_BRANCH: 'master',
    
    // Storage limit per user (in bytes)
    MAX_STORAGE_PER_USER: 5 * 1024 * 1024 * 1024, // 5GB
    
    // Base path for user files in the repo
    USER_FILES_PATH: 'uploads/'
};

// DO NOT EDIT BELOW THIS LINE
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}