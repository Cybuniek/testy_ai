// ---- Admin Panel Management ----
const ADMIN_PASSWORD = 'illegal'; // In a real app, this would be server-side.
let adminLoggedIn = false;

// Initialize admin panel
function initAdmin() {
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    adminLoggedIn = true;
    const login = document.getElementById('admin-login');
    const panel = document.getElementById('admin-panel');
    if(login) login.classList.add('hidden');
    if(panel) panel.classList.remove('hidden');
    loadAdminContent();
  }
}

function toggleAdminPanel() {
  if (window.location.pathname.includes('admin.html')) {
      return; // Already on admin page
  }
  window.location.href = 'admin.html';
}

function adminLogin() {
  const passwordInput = document.getElementById('admin-password');
  const password = passwordInput.value;

  if (password === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    localStorage.setItem('adminLoggedIn', 'true');
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadAdminContent();
    passwordInput.value = '';
  } else {
    alert('ACCESS DENIED. TERMINAL LOCKED.');
    passwordInput.value = '';
  }
}

function adminLogout() {
  adminLoggedIn = false;
  localStorage.removeItem('adminLoggedIn');
  window.location.reload();
}

// ---- Data Management (LocalStorage) ----

// Generic function to add item
function addItem(storageKey, item) {
    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items.push(item);
    localStorage.setItem(storageKey, JSON.stringify(items));
}

// Generic function to delete item
function deleteItem(storageKey, id) {
    if (confirm('CONFIRM DELETION?')) {
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items = items.filter(i => i.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(items));
        return true;
    }
    return false;
}

// ---- Specific Content Managers ----

// Music
function addMusic() {
  const title = document.getElementById('music-title').value;
  const url = document.getElementById('music-url').value;
  if (!title || !url) return alert('DATA MISSING');

  addItem('musicList', { id: Date.now(), title, url });

  document.getElementById('music-title').value = '';
  document.getElementById('music-url').value = '';
  loadMusicList();
}

function deleteMusic(id) {
  if(deleteItem('musicList', id)) loadMusicList();
}

function loadMusicList() {
  const list = document.getElementById('music-list');
  if(!list) return;
  const items = JSON.parse(localStorage.getItem('musicList') || '[]');
  renderList(list, items, 'deleteMusic');
}

// Videos
function addVideo() {
  const title = document.getElementById('video-title').value;
  const url = document.getElementById('video-url').value;
  if (!title || !url) return alert('DATA MISSING');

  addItem('videoList', { id: Date.now(), title, url });

  document.getElementById('video-title').value = '';
  document.getElementById('video-url').value = '';
  loadVideoList();
}

function deleteVideo(id) {
    if(deleteItem('videoList', id)) loadVideoList();
}

function loadVideoList() {
  const list = document.getElementById('video-list');
  if(!list) return;
  const items = JSON.parse(localStorage.getItem('videoList') || '[]');
  renderList(list, items, 'deleteVideo');
}

// Images
function addImage() {
  const title = document.getElementById('image-title').value;
  const url = document.getElementById('image-url').value;
  if (!title || !url) return alert('DATA MISSING');

  addItem('imageList', { id: Date.now(), title, url });

  document.getElementById('image-title').value = '';
  document.getElementById('image-url').value = '';
  loadImageList();
}

function deleteImage(id) {
    if(deleteItem('imageList', id)) loadImageList();
}

function loadImageList() {
    const list = document.getElementById('image-list');
    if(!list) return;
    const items = JSON.parse(localStorage.getItem('imageList') || '[]');
    renderList(list, items, 'deleteImage');
}

// Blog Posts (Ustnik Show)
function addPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    if (!title || !content) return alert('DATA MISSING');

    addItem('blogPosts', { id: Date.now(), title, content, date: new Date().toISOString() });

    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    loadPostList();
}

function deletePost(id) {
    if(deleteItem('blogPosts', id)) loadPostList();
}

function loadPostList() {
    const list = document.getElementById('post-list');
    if(!list) return;
    const items = JSON.parse(localStorage.getItem('blogPosts') || '[]');

    if (items.length === 0) {
        list.innerHTML = '<p>NO DATA.</p>';
        return;
    }

    list.innerHTML = '<ul style="list-style: none; padding: 0;">' +
      items.map(i => `
        <li style="padding: 10px; background: #000; border: 1px solid var(--muted); margin: 8px 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--accent-2);">${i.title}</strong><br/>
            <small style="color: var(--muted);">${new Date(i.date).toLocaleDateString()}</small>
          </div>
          <button onclick="deletePost(${i.id})" style="padding: 5px 10px; background: var(--accent); color: #000; border: none; cursor: pointer; font-weight: bold;">DEL</button>
        </li>
      `).join('') +
      '</ul>';
}


// Helper to render simple lists
function renderList(element, items, deleteFunc) {
    if (items.length === 0) {
        element.innerHTML = '<p>NO DATA.</p>';
        return;
    }
    element.innerHTML = '<ul style="list-style: none; padding: 0;">' +
      items.map(i => `
        <li style="padding: 10px; background: #000; border: 1px solid var(--muted); margin: 8px 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--accent-2);">${i.title}</strong><br/>
            <small style="color: var(--muted);">${i.url}</small>
          </div>
          <button onclick="${deleteFunc}(${i.id})" style="padding: 5px 10px; background: var(--accent); color: #000; border: none; cursor: pointer; font-weight: bold;">DEL</button>
        </li>
      `).join('') +
      '</ul>';
}


function saveQuote() {
  const quote = document.getElementById('admin-quote').value;
  localStorage.setItem('customQuote', quote);
  alert('QUOTE UPLOADED TO MAINFRAME.');
}

function loadAdminContent() {
  if(document.getElementById('admin-quote')) document.getElementById('admin-quote').value = localStorage.getItem('customQuote') || '';
  loadMusicList();
  loadVideoList();
  loadImageList();
  loadPostList();
}

// Helper function to extract YouTube ID
function extractYoutubeId(url) {
    if (!url) return '';
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

// ---- Public Page Display Logic ----

function displayPageContent() {
  // Only run on pages that have these containers
  const musicGallery = document.getElementById('music-gallery');
  if (musicGallery) {
      const music = JSON.parse(localStorage.getItem('musicList') || '[]');
      if (music.length === 0) {
        musicGallery.innerHTML = '<p class="note">No audio files found in the system.</p>';
      } else {
        musicGallery.innerHTML = '<div class="grid">' +
        music.map(m => `
          <div class="card">
            <h3>${m.title}</h3>
            ${getMediaEmbed(m.url)}
          </div>
        `).join('') + '</div>';
      }
  }

  const videoGallery = document.getElementById('video-gallery'); // Assuming we rename scene content id or use this
  if (videoGallery) {
      const videos = JSON.parse(localStorage.getItem('videoList') || '[]');
      if (videos.length === 0) {
          videoGallery.innerHTML = '<p class="note">No visual feeds available.</p>';
      } else {
          videoGallery.innerHTML = '<div class="video-grid">' +
            videos.map(v => `
              <div class="video-card">
                <div style="position:relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                    ${getVideoEmbed(v.url)}
                </div>
                <div class="video-info">
                    <h3>${v.title}</h3>
                </div>
              </div>
            `).join('') +
            '</div>';
      }
  }

  const blogContainer = document.getElementById('blog-posts');
  if (blogContainer) {
      const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      if (posts.length === 0) {
          blogContainer.innerHTML = '<p class="note">No transmission data.</p>';
      } else {
          blogContainer.innerHTML = '<div class="grid" style="grid-template-columns: 1fr;">' +
            posts.map(p => `
              <div class="card">
                <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed var(--muted); padding-bottom: 10px; margin-bottom: 10px;">
                    <h2 style="margin:0; font-size: 1.8rem; color: var(--accent-2);">${p.title}</h2>
                    <span class="chip">${new Date(p.date).toLocaleDateString()}</span>
                </div>
                <div style="font-family: sans-serif; font-size: 1.1rem; line-height: 1.7;">
                    ${p.content.replace(/\n/g, '<br>')}
                </div>
              </div>
            `).join('') +
            '</div>';
      }
  }
}

function getMediaEmbed(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${extractYoutubeId(url)}" frameborder="0" allowfullscreen style="border:none;"></iframe>`;
    } else if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg')) {
        return `<audio controls style="width: 100%;"><source src="${url}" /></audio>`;
    } else {
        return `<a href="${url}" target="_blank" class="cta outline">Open Link</a>`;
    }
}

function getVideoEmbed(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return `<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${extractYoutubeId(url)}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        return `<video controls style="width: 100%; height: 100%; position: absolute;"><source src="${url}" /></video>`;
    }
}

// Initialize
window.addEventListener('load', () => {
  // Check for admin page
  if (document.getElementById('admin-login')) {
      initAdmin();
  } else {
      displayPageContent();
  }
});
