// ========================================
// DASHBOARD LOGIC
// ========================================

let currentUser = null;
let currentPath = '';
let fileList = [];

// ========================================
// AUTHENTICATION
// ========================================

function checkAuth() {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(userData);
    document.getElementById('userName').textContent = `👋 ${currentUser.name}`;
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ========================================
// GITHUB API HELPERS
// ========================================

function getGitHubHeaders() {
    return {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
}

async function getFileList(path = '') {
    const userFolder = `uploads/${currentUser.email.split('@')[0]}/`;
    const fullPath = userFolder + path;
    
    try {
        const response = await fetch(
            `https://api.github.com/repos/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/contents/${fullPath}`,
            { headers: getGitHubHeaders() }
        );
        
        if (response.status === 404) {
            // Folder doesn't exist - create it
            await createFolder(userFolder);
            return [];
        }
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

async function createFolder(path) {
    // GitHub doesn't support empty folders directly - we create a .gitkeep file
    try {
        await fetch(
            `https://api.github.com/repos/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/contents/${path}.gitkeep`,
            {
                method: 'PUT',
                headers: getGitHubHeaders(),
                body: JSON.stringify({
                    message: `Create folder: ${path}`,
                    content: btoa('')
                })
            }
        );
    } catch (error) {
        console.error('Error creating folder:', error);
    }
}

async function uploadFile(file, path = '') {
    const userFolder = `uploads/${currentUser.email.split('@')[0]}/`;
    const fullPath = userFolder + path + file.name;
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const base64Content = btoa(e.target.result);
                
                const response = await fetch(
                    `https://api.github.com/repos/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/contents/${fullPath}`,
                    {
                        method: 'PUT',
                        headers: getGitHubHeaders(),
                        body: JSON.stringify({
                            message: `Upload: ${file.name}`,
                            content: base64Content,
                            branch: CONFIG.GITHUB_BRANCH
                        })
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status}`);
                }
                
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsBinaryString(file);
    });
}

async function deleteFile(path) {
    const userFolder = `uploads/${currentUser.email.split('@')[0]}/`;
    const fullPath = userFolder + path;
    
    try {
        // First get the file's SHA
        const fileInfo = await fetch(
            `https://api.github.com/repos/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/contents/${fullPath}`,
            { headers: getGitHubHeaders() }
        );
        const data = await fileInfo.json();
        
        const response = await fetch(
            `https://api.github.com/repos/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/contents/${fullPath}`,
            {
                method: 'DELETE',
                headers: getGitHubHeaders(),
                body: JSON.stringify({
                    message: `Delete: ${path}`,
                    sha: data.sha,
                    branch: CONFIG.GITHUB_BRANCH
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}

// ========================================
// UI RENDERING
// ========================================

function renderFiles(files) {
    const grid = document.getElementById('fileGrid');
    grid.innerHTML = '';
    
    if (files.length === 0) {
        grid.innerHTML = '<div class="loading">📂 No files or folders here yet. Upload something!</div>';
        return;
    }
    
    // Show folders first
    const folders = files.filter(f => f.type === 'dir');
    const fileItems = files.filter(f => f.type !== 'dir');
    
    // Render folders
    folders.forEach(folder => {
        const div = document.createElement('div');
        div.className = 'folder-item';
        div.innerHTML = `
            <span class="icon">📁</span>
            <span class="name">${folder.name}</span>
        `;
        div.addEventListener('click', () => navigateTo(folder.path));
        grid.appendChild(div);
    });
    
    // Render files
    fileItems.forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-item';
        const icon = getFileIcon(file.name);
        div.innerHTML = `
            <span class="icon">${icon}</span>
            <span class="name">${file.name}</span>
            <span style="font-size:0.7rem;color:#999">${formatFileSize(file.size)}</span>
        `;
        div.addEventListener('click', () => downloadFile(file.path));
        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Delete "${file.name}"?`)) {
                deleteFile(file.path).then(() => loadFiles());
            }
        });
        grid.appendChild(div);
    });
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄', 'doc': '📝', 'docx': '📝', 'xls': '📊', 'xlsx': '📊',
        'ppt': '📽️', 'pptx': '📽️', 'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️',
        'gif': '🖼️', 'mp4': '🎬', 'mp3': '🎵', 'zip': '📦', 'rar': '📦',
        'txt': '📃', 'html': '🌐', 'css': '🎨', 'js': '💻'
    };
    return icons[ext] || '📎';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
}

function navigateTo(path) {
    currentPath = path;
    document.getElementById('currentPath').textContent = '/' + path;
    loadFiles(path);
}

async function loadFiles(path = '') {
    const files = await getFileList(path);
    renderFiles(files);
    updateStorageUsage(files);
}

// ========================================
// STORAGE USAGE
// ========================================

function updateStorageUsage(files) {
    let totalSize = 0;
    files.forEach(f => {
        if (f.type !== 'dir') totalSize += f.size || 0;
    });
    
    const usedMB = totalSize / (1024 * 1024);
    const maxGB = CONFIG.MAX_STORAGE_PER_USER / (1024 * 1024 * 1024);
    const usedGB = totalSize / (1024 * 1024 * 1024);
    const percentage = Math.min((totalSize / CONFIG.MAX_STORAGE_PER_USER) * 100, 100);
    
    document.getElementById('storageFill').style.width = percentage + '%';
    document.getElementById('storageText').textContent = `${usedGB.toFixed(2)} GB / ${maxGB} GB used`;
}

// ========================================
// UPLOAD HANDLING
// ========================================

function setupUpload() {
    const modal = document.getElementById('uploadModal');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    
    uploadBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    });
}

async function handleUpload(files) {
    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    progressBar.style.display = 'block';
    
    const totalFiles = files.length;
    let uploaded = 0;
    
    for (let file of files) {
        try {
            await uploadFile(file, currentPath);
            uploaded++;
            const percent = (uploaded / totalFiles) * 100;
            progressFill.style.width = percent + '%';
        } catch (error) {
            console.error('Upload failed for', file.name, error);
            alert(`Failed to upload ${file.name}: ${error.message}`);
        }
    }
    
    setTimeout(() => {
        progressBar.style.display = 'none';
        progressFill.style.width = '0%';
        document.getElementById('uploadModal').style.display = 'none';
        loadFiles(currentPath);
    }, 500);
}

// ========================================
// DOWNLOAD FILE
// ========================================

function downloadFile(path) {
    const fullPath = `uploads/${currentUser.email.split('@')[0]}/${path}`;
    const url = `https://raw.githubusercontent.com/${CONFIG.GITHUB_REPO_OWNER}/${CONFIG.GITHUB_REPO_NAME}/${CONFIG.GITHUB_BRANCH}/${fullPath}`;
    window.open(url, '_blank');
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('refreshBtn').addEventListener('click', () => loadFiles(currentPath));
    document.getElementById('newFolderBtn').addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            const path = currentPath ? currentPath + '/' + folderName : folderName;
            createFolder(`uploads/${currentUser.email.split('@')[0]}/${path}/`).then(() => loadFiles(currentPath));
        }
    });
    
    setupUpload();
    loadFiles('');
});