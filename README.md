<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>My Website — Personal Image Drive</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', sans-serif;
    background: #0a0f1e;
    color: #e8eaf6;
    min-height: 100vh;
  }
  header {
    background: #0d1630;
    padding: 16px 24px;
    border-bottom: 1px solid #1e3a6e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .logo { font-size: 20px; font-weight: 700; color: #90b8f8; }
  .logo span { color: #5c8adb; font-weight: 400; font-size: 14px; }
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #5c8adb;
  }
  .header-right .badge {
    background: #0d1e40;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid #1e3a6e;
    font-size: 11px;
  }
  .main { max-width: 1100px; margin: 0 auto; padding: 24px; }
  
  /* Upload Area */
  .upload-area {
    background: #0d1e40;
    border: 2px dashed #1e3a6e;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    margin-bottom: 30px;
    transition: all 0.3s;
    cursor: pointer;
  }
  .upload-area:hover { border-color: #3a6abf; background: #0f2248; }
  .upload-area.dragover { border-color: #4caf50; background: #0f2a40; }
  .upload-area input { display: none; }
  .upload-icon { font-size: 48px; margin-bottom: 12px; }
  .upload-text { color: #8090b0; font-size: 14px; }
  .upload-text strong { color: #90b8f8; }
  .upload-text .hint { font-size: 12px; color: #3a5080; display: block; margin-top: 4px; }

  /* Controls */
  .controls {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 20px; align-items: center;
  }
  .controls input[type="text"] {
    flex: 1; min-width: 200px;
    background: #0a1428; border: 1px solid #1e3a6e;
    padding: 10px 14px; border-radius: 8px;
    color: #e8eaf6; font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .controls input[type="text"]:focus { border-color: #3a6abf; }
  .controls button {
    background: #1a73e8; border: none;
    padding: 10px 20px; border-radius: 8px;
    color: #fff; font-weight: 600; cursor: pointer;
    transition: background 0.2s;
  }
  .controls button:hover { background: #1558c0; }
  .controls button.secondary { background: #0d1e40; border: 1px solid #1e3a6e; }
  .controls button.secondary:hover { background: #1a3060; }
  .controls button.danger { background: #c62828; }
  .controls button.danger:hover { background: #b71c1c; }

  /* Stats */
  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 13px;
    color: #8090b0;
    flex-wrap: wrap;
  }
  .stats strong { color: #90b8f8; }

  /* File Grid */
  .file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  .file-card {
    background: #0d1e40;
    border: 1px solid #1e3a6e;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    position: relative;
  }
  .file-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .file-card img {
    width: 100%; height: 140px; object-fit: cover;
    display: block;
    background: #0a1428;
  }
  .file-card .info {
    padding: 10px 12px;
    font-size: 12px;
    color: #8090b0;
  }
  .file-card .info .name {
    color: #e8eaf6;
    font-weight: 500;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-card .info .size { font-size: 11px; margin-top: 4px; }
  .file-card .delete-btn {
    position: absolute; top: 6px; right: 6px;
    background: rgba(198, 40, 40, 0.85);
    border: none; color: #fff; width: 28px; height: 28px;
    border-radius: 50%; cursor: pointer; font-size: 14px;
    display: none; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .file-card:hover .delete-btn { display: flex; }
  .file-card .delete-btn:hover { background: #c62828; }

  .file-card .action-btns {
    display: flex;
    gap: 4px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .file-card .action-btns button,
  .file-card .action-btns a {
    background: transparent;
    border: 1px solid #1e3a6e;
    color: #5c8adb;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }
  .file-card .action-btns button:hover,
  .file-card .action-btns a:hover {
    background: #1a3060;
    border-color: #3a6abf;
  }

  .empty {
    text-align: center; color: #3a5080;
    padding: 60px 20px; font-size: 16px;
  }
  .empty .big-icon { font-size: 48px; display: block; margin-bottom: 12px; }

  .toast {
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: #0d1e40; border: 1px solid #1e3a6e;
    padding: 12px 24px; border-radius: 12px;
    color: #e8eaf6; font-size: 14px;
    display: none; z-index: 999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    max-width: 90%;
    text-align: center;
  }
  .toast.show { display: block; animation: fadeIn 0.3s ease; }
  .toast.error { border-color: #c62828; background: #1a0a0a; }
  .toast.success { border-color: #2e7d32; background: #0a1a0a; }

  .loading { text-align: center; padding: 40px; color: #5c8adb; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* Modal */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); display: none;
    align-items: center; justify-content: center; z-index: 1000;
  }
  .modal-overlay.show { display: flex; }
  .modal {
    background: #0d1630; border: 1px solid #1e3a6e;
    border-radius: 16px; padding: 30px; max-width: 500px; width: 90%;
  }
  .modal h3 { color: #90b8f8; margin-bottom: 16px; }
  .modal input {
    width: 100%; background: #0a1428; border: 1px solid #1e3a6e;
    padding: 10px 14px; border-radius: 8px; color: #e8eaf6;
    font-size: 14px; margin-bottom: 12px;
    outline: none;
  }
  .modal input:focus { border-color: #3a6abf; }
  .modal .actions { display: flex; gap: 12px; justify-content: flex-end; }
  .modal .actions button {
    padding: 8px 20px; border: none; border-radius: 8px;
    cursor: pointer; font-weight: 600;
  }
  .modal .actions .cancel { background: #1e3a6e; color: #8090b0; }
  .modal .actions .cancel:hover { background: #2a4a7e; }
  .modal .actions .confirm { background: #1a73e8; color: #fff; }
  .modal .actions .confirm:hover { background: #1558c0; }

  /* Footer */
  footer {
    text-align: center;
    padding: 20px;
    color: #3a5080;
    font-size: 12px;
    border-top: 1px solid #0d1e40;
    margin-top: 30px;
  }
  footer a { color: #5c8adb; text-decoration: none; }

  /* Responsive */
  @media (max-width: 600px) {
    header .logo { font-size: 16px; }
    .header-right .badge { display: none; }
    .upload-area { padding: 24px; }
    .file-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
    .controls button { padding: 8px 14px; font-size: 13px; }
  }
</style>
</head>
<body>

<header>
  <div class="logo">📁 My Website <span>— Image Drive</span></div>
  <div class="header-right">
    <span class="badge">🔒 GitHub Storage</span>
    <span id="fileCount">0 files</span>
  </div>
</header>

<div class="main">
  <!-- Upload Area -->
  <div class="upload-area" id="dropZone">
    <div class="upload-icon">☁️</div>
    <div class="upload-text">
      <strong>Click or drag & drop</strong> images here
      <span class="hint">JPG, JPEG, PNG · Max 2MB each</span>
    </div>
    <input type="file" id="fileInput" accept=".jpg,.jpeg,.png" multiple>
  </div>

  <!-- Stats -->
  <div class="stats">
    <span>📊 <strong id="totalSize">0</strong> total size</span>
    <span>🖼️ <strong id="imageCount">0</strong> images</span>
  </div>

  <!-- Controls -->
  <div class="controls">
    <input type="text" id="searchInput" placeholder="🔍 Search images by name...">
    <button onclick="refreshFiles()">🔄 Refresh</button>
    <button onclick="document.getElementById('fileInput').click()" class="secondary">📤 Upload</button>
    <button onclick="deleteAllFiles()" class="danger" id="deleteAllBtn" style="display:none;">🗑️ Delete All</button>
  </div>

  <!-- File Grid -->
  <div id="fileGrid" class="file-grid">
    <div class="loading">⏳ Loading your images...</div>
  </div>
</div>

<footer>
  Powered by GitHub API · <a href="https://github.com/1648225m/my-website" target="_blank">View on GitHub</a>
</footer>

<!-- Toast Notification -->
<div class="toast" id="toast"></div>

<!-- Rename Modal -->
<div class="modal-overlay" id="renameModal">
  <div class="modal">
    <h3>✏️ Rename Image</h3>
    <input type="text" id="renameInput" placeholder="New filename (e.g., my-image.jpg)">
    <div class="actions">
      <button class="cancel" onclick="closeRename()">Cancel</button>
      <button class="confirm" onclick="confirmRename()">Rename</button>
    </div>
  </div>
</div>

<script>
  // ============================================================
  // 🔐 GITHUB CONFIGURATION
  // ============================================================
  const GITHUB_TOKEN = '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';
  const REPO_OWNER = '1648225m';
  const REPO_NAME = 'my-website';  // 👈 Updated for new repo
  const IMAGE_FOLDER = 'uploads/';

  // ============================================================
  // STATE
  // ============================================================
  let allFiles = [];
  let renameTarget = null;

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 3500);
  }

  // ============================================================
  // GITHUB API HELPERS
  // ============================================================
  async function githubRequest(endpoint, method = 'GET', body = null) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${endpoint}`;
    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    };
    if (body) {
      headers['Content-Type'] = 'application/json';
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function getFileSha(path) {
    try {
      const data = await githubRequest(`/contents/${path}`);
      return data.sha;
    } catch (e) {
      return null;
    }
  }

  // ============================================================
  // LIST FILES FROM GITHUB
  // ============================================================
  async function fetchFiles() {
    try {
      const data = await githubRequest(`/contents/${IMAGE_FOLDER}`);
      if (!Array.isArray(data)) return [];
      return data
        .filter(item => item.type === 'file' && /\.(jpg|jpeg|png)$/i.test(item.name))
        .map(item => ({
          name: item.name,
          path: item.path,
          size: item.size,
          download_url: item.download_url,
          sha: item.sha,
          html_url: item.html_url,
        }));
    } catch (e) {
      if (e.message.includes('404')) return [];
      throw e;
    }
  }

  // ============================================================
  // UPDATE STATS
  // ============================================================
  function updateStats(files) {
    const total = files.reduce((sum, f) => sum + f.size, 0);
    const totalMB = (total / (1024 * 1024)).toFixed(2);
    document.getElementById('totalSize').textContent = totalMB + ' MB';
    document.getElementById('imageCount').textContent = files.length;
    document.getElementById('fileCount').textContent = files.length + ' files';
    document.getElementById('deleteAllBtn').style.display = files.length > 0 ? 'inline-block' : 'none';
  }

  // ============================================================
  // RENDER FILE GRID
  // ============================================================
  function renderFiles(files) {
    const grid = document.getElementById('fileGrid');
    updateStats(files);
    
    if (files.length === 0) {
      grid.innerHTML = `
        <div class="empty">
          <span class="big-icon">📭</span>
          No images uploaded yet.<br>
          <span style="font-size:13px;color:#3a5080;">Upload your first image by clicking or dragging above.</span>
        </div>`;
      return;
    }
    
    grid.innerHTML = files.map(f => `
      <div class="file-card" data-path="${f.path}" data-sha="${f.sha}" data-name="${f.name}">
        <img src="${f.download_url}" alt="${f.name}" loading="lazy" 
             onclick="window.open('${f.download_url}','_blank')" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%230a1428%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%233a5080%22 font-family=%22sans-serif%22 font-size=%2224%22%3E🖼️%3C/text%3E%3C/svg%3E'">
        <button class="delete-btn" onclick="deleteFile('${f.path}','${f.sha}','${f.name}')" title="Delete">✕</button>
        <div class="info">
          <div class="name" title="${f.name}">${f.name}</div>
          <div class="size">${(f.size / 1024).toFixed(1)} KB</div>
          <div class="action-btns">
            <button onclick="renameFile('${f.path}','${f.sha}','${f.name}')">✏️ Rename</button>
            <button onclick="copyFile('${f.download_url}','${f.name}')">📋 Copy</button>
            <a href="${f.download_url}" download>⬇️ Download</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ============================================================
  // REFRESH FILES
  // ============================================================
  async function refreshFiles() {
    const grid = document.getElementById('fileGrid');
    grid.innerHTML = '<div class="loading">⏳ Loading...</div>';
    try {
      allFiles = await fetchFiles();
      applySearch();
    } catch (e) {
      grid.innerHTML = `<div class="empty">❌ Error loading files: ${e.message}</div>`;
      showToast('Error: ' + e.message, 'error');
    }
  }

  // ============================================================
  // SEARCH
  // ============================================================
  function applySearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allFiles.filter(f => f.name.toLowerCase().includes(q));
    renderFiles(filtered);
  }
  document.getElementById('searchInput').addEventListener('input', applySearch);

  // ============================================================
  // UPLOAD FILES
  // ============================================================
  async function uploadFiles(files) {
    let uploaded = 0;
    let failed = 0;
    
    for (const file of files) {
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        showToast(`Skipped: ${file.name} — only JPG/PNG allowed`, 'error');
        failed++;
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast(`Skipped: ${file.name} — exceeds 2MB limit`, 'error');
        failed++;
        continue;
      }

      try {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const path = IMAGE_FOLDER + file.name;
        const existing = await getFileSha(path);
        const body = {
          message: `Upload ${file.name}`,
          content: base64,
          branch: 'main',
        };
        if (existing) body.sha = existing;

        await githubRequest(`/contents/${path}`, 'PUT', body);
        uploaded++;
      } catch (e) {
        failed++;
        showToast(`❌ Failed: ${file.name} — ${e.message}`, 'error');
      }
    }
    
    if (uploaded > 0) {
      showToast(`✅ Uploaded ${uploaded} file${uploaded > 1 ? 's' : ''} successfully!`, 'success');
    }
    refreshFiles();
  }

  // ============================================================
  // DELETE FILE
  // ============================================================
  async function deleteFile(path, sha, name) {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    try {
      await githubRequest(`/contents/${path}`, 'DELETE', {
        message: `Delete ${name}`,
        sha: sha,
        branch: 'main',
      });
      showToast(`🗑️ Deleted: ${name}`, 'success');
      refreshFiles();
    } catch (e) {
      showToast(`❌ Delete failed: ${e.message}`, 'error');
    }
  }

  // ============================================================
  // DELETE ALL FILES
  // ============================================================
  async function deleteAllFiles() {
    if (allFiles.length === 0) return;
    if (!confirm(`⚠️ Delete ALL ${allFiles.length} images permanently? This cannot be undone!`)) return;
    if (!confirm(`Are you absolutely sure?`)) return;
    
    let deleted = 0;
    for (const f of allFiles) {
      try {
        await githubRequest(`/contents/${f.path}`, 'DELETE', {
          message: `Delete ${f.name}`,
          sha: f.sha,
          branch: 'main',
        });
        deleted++;
      } catch (e) {
        showToast(`❌ Failed to delete: ${f.name}`, 'error');
      }
    }
    showToast(`🗑️ Deleted ${deleted} files`, 'success');
    refreshFiles();
  }

  // ============================================================
  // RENAME FILE
  // ============================================================
  function renameFile(path, sha, name) {
    renameTarget = { path, sha, name };
    document.getElementById('renameInput').value = name;
    document.getElementById('renameModal').classList.add('show');
  }

  function closeRename() {
    document.getElementById('renameModal').classList.remove('show');
    renameTarget = null;
  }

  async function confirmRename() {
    if (!renameTarget) return;
    const newName = document.getElementById('renameInput').value.trim();
    if (!newName || newName === renameTarget.name) {
      closeRename();
      return;
    }
    if (!/\.(jpg|jpeg|png)$/i.test(newName)) {
      showToast('❌ Must be .jpg, .jpeg, or .png', 'error');
      return;
    }

    try {
      const data = await githubRequest(`/contents/${renameTarget.path}`);
      const content = data.content;

      await githubRequest(`/contents/${renameTarget.path}`, 'DELETE', {
        message: `Delete old ${renameTarget.name}`,
        sha: renameTarget.sha,
        branch: 'main',
      });

      const newPath = IMAGE_FOLDER + newName;
      await githubRequest(`/contents/${newPath}`, 'PUT', {
        message: `Rename to ${newName}`,
        content: content,
        branch: 'main',
      });

      showToast(`✅ Renamed to: ${newName}`, 'success');
      closeRename();
      refreshFiles();
    } catch (e) {
      showToast(`❌ Rename failed: ${e.message}`, 'error');
    }
  }

  // ============================================================
  // COPY URL TO CLIPBOARD
  // ============================================================
  function copyFile(url, name) {
    navigator.clipboard.writeText(url).then(() => {
      showToast(`📋 Copied URL for: ${name}`, 'success');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast(`📋 Copied URL for: ${name}`, 'success');
    });
  }

  // ============================================================
  // DRAG & DROP
  // ============================================================
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

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
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  });
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      uploadFiles(fileInput.files);
      fileInput.value = '';
    }
  });

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================
  document.addEventListener('keydown', (e) => {
    // Ctrl+U = Upload
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      document.getElementById('fileInput').click();
    }
    // Ctrl+R = Refresh
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      refreshFiles();
    }
    // Escape = Close modal
    if (e.key === 'Escape') {
      closeRename();
    }
  });

  // ============================================================
  // INIT
  // ============================================================
  refreshFiles();
  console.log('🚀 My Website Image Drive loaded!');
  console.log(`📁 Repo: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`📂 Folder: ${IMAGE_FOLDER}`);
</script>
</body>
</html>
