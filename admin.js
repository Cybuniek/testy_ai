// ---- Admin Panel Management ----
const ADMIN_PASSWORD = 'illegal';
let adminLoggedIn = false;

// Initialize admin panel
function initAdmin() {
  if (localStorage.getItem('adminLoggedIn') === 'true') {
    adminLoggedIn = true;
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadAdminContent();
  }
}

function toggleAdminPanel() {
  const login = document.getElementById('admin-login');
  const panel = document.getElementById('admin-panel');
  
  if (adminLoggedIn) {
    panel.classList.toggle('hidden');
  } else {
    login.classList.remove('hidden');
  }
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
    alert('Błędne hasło!');
    passwordInput.value = '';
  }
}

function adminLogout() {
  adminLoggedIn = false;
  localStorage.removeItem('adminLoggedIn');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('admin-login').classList.add('hidden');
}

// ---- Media Management ----
function addMusic() {
  const title = document.getElementById('music-title').value;
  const url = document.getElementById('music-url').value;
  
  if (!title || !url) {
    alert('Uzupełnij wszystkie pola!');
    return;
  }
  
  let music = JSON.parse(localStorage.getItem('musicList') || '[]');
  const id = Date.now();
  music.push({ id, title, url });
  localStorage.setItem('musicList', JSON.stringify(music));
  
  document.getElementById('music-title').value = '';
  document.getElementById('music-url').value = '';
  
  loadMusicList();
  displayMusicGallery();
  alert('Utwór dodany!');
}

function deleteMusic(id) {
  if (confirm('Usunąć ten utwór?')) {
    let music = JSON.parse(localStorage.getItem('musicList') || '[]');
    music = music.filter(m => m.id !== id);
    localStorage.setItem('musicList', JSON.stringify(music));
    loadMusicList();
    displayMusicGallery();
  }
}

function loadMusicList() {
  const music = JSON.parse(localStorage.getItem('musicList') || '[]');
  const list = document.getElementById('music-list');
  
  if (music.length === 0) {
    list.innerHTML = '<p>Brak utworów.</p>';
    return;
  }
  
  list.innerHTML = '<ul style="list-style: none; padding: 0;">' +
    music.map(m => `
      <li style="padding: 8px; background: #0f1018; margin: 8px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${m.title}</strong><br/>
          <small style="color: var(--muted);">${m.url}</small>
        </div>
        <button onclick="deleteMusic(${m.id})" style="padding: 4px 8px; background: #ff2ea6; color: #0b0b0f; border: none; border-radius: 4px; cursor: pointer;">Usuń</button>
      </li>
    `).join('') +
    '</ul>';
}

function displayMusicGallery() {
  const music = JSON.parse(localStorage.getItem('musicList') || '[]');
  const gallery = document.getElementById('music-gallery');
  
  if (music.length === 0) {
    gallery.innerHTML = '<p>Brak utworów. Dodaj je w panelu admina.</p>';
    return;
  }
  
  gallery.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">' +
    music.map((m, i) => `
      <div style="background: var(--card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius); padding: 16px;">
        <h4>${m.title}</h4>
        ${m.url.includes('youtube.com') || m.url.includes('youtu.be') ? 
          `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${extractYoutubeId(m.url)}" frameborder="0" allowfullscreen></iframe>` :
          m.url.includes('.mp3') || m.url.includes('.wav') || m.url.includes('.ogg') ?
          `<audio controls style="width: 100%;"><source src="${m.url}" /></audio>` :
          `<video controls style="width: 100%; height: 200px;"><source src="${m.url}" /></video>`
        }
      </div>
    `).join('') +
    '</div>';
}

function addVideo() {
  const title = document.getElementById('video-title').value;
  const url = document.getElementById('video-url').value;
  
  if (!title || !url) {
    alert('Uzupełnij wszystkie pola!');
    return;
  }
  
  let videos = JSON.parse(localStorage.getItem('videoList') || '[]');
  const id = Date.now();
  videos.push({ id, title, url });
  localStorage.setItem('videoList', JSON.stringify(videos));
  
  document.getElementById('video-title').value = '';
  document.getElementById('video-url').value = '';
  
  loadVideoList();
  alert('Film dodany!');
}

function deleteVideo(id) {
  if (confirm('Usunąć ten film?')) {
    let videos = JSON.parse(localStorage.getItem('videoList') || '[]');
    videos = videos.filter(v => v.id !== id);
    localStorage.setItem('videoList', JSON.stringify(videos));
    loadVideoList();
  }
}

function loadVideoList() {
  const videos = JSON.parse(localStorage.getItem('videoList') || '[]');
  const list = document.getElementById('video-list');
  
  if (videos.length === 0) {
    list.innerHTML = '<p>Brak filmów.</p>';
    return;
  }
  
  list.innerHTML = '<ul style="list-style: none; padding: 0;">' +
    videos.map(v => `
      <li style="padding: 8px; background: #0f1018; margin: 8px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${v.title}</strong><br/>
          <small style="color: var(--muted);">${v.url}</small>
        </div>
        <button onclick="deleteVideo(${v.id})" style="padding: 4px 8px; background: #ff2ea6; color: #0b0b0f; border: none; border-radius: 4px; cursor: pointer;">Usuń</button>
      </li>
    `).join('') +
    '</ul>';
}

function addImage() {
  const title = document.getElementById('image-title').value;
  const url = document.getElementById('image-url').value;
  
  if (!title || !url) {
    alert('Uzupełnij wszystkie pola!');
    return;
  }
  
  let images = JSON.parse(localStorage.getItem('imageList') || '[]');
  const id = Date.now();
  images.push({ id, title, url });
  localStorage.setItem('imageList', JSON.stringify(images));
  
  document.getElementById('image-title').value = '';
  document.getElementById('image-url').value = '';
  
  loadImageList();
  alert('Obraz dodany!');
}

function deleteImage(id) {
  if (confirm('Usunąć ten obraz?')) {
    let images = JSON.parse(localStorage.getItem('imageList') || '[]');
    images = images.filter(i => i.id !== id);
    localStorage.setItem('imageList', JSON.stringify(images));
    loadImageList();
  }
}

function loadImageList() {
  const images = JSON.parse(localStorage.getItem('imageList') || '[]');
  const list = document.getElementById('image-list');
  
  if (images.length === 0) {
    list.innerHTML = '<p>Brak obrazów.</p>';
    return;
  }
  
  list.innerHTML = '<ul style="list-style: none; padding: 0;">' +
    images.map(img => `
      <li style="padding: 8px; background: #0f1018; margin: 8px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${img.title}</strong><br/>
          <small style="color: var(--muted);">${img.url}</small>
        </div>
        <button onclick="deleteImage(${img.id})" style="padding: 4px 8px; background: #ff2ea6; color: #0b0b0f; border: none; border-radius: 4px; cursor: pointer;">Usuń</button>
      </li>
    `).join('') +
    '</ul>';
}

function saveQuote() {
  const quote = document.getElementById('admin-quote').value;
  localStorage.setItem('customQuote', quote);
  const qEl = document.getElementById('quote');
  if (qEl) { qEl.textContent = quote || '„AI to medium, nie fetysz."'; }
  alert('Cytat zapisany!');
}

function loadAdminContent() {
  document.getElementById('admin-quote').value = localStorage.getItem('customQuote') || '';
  loadMusicList();
  loadVideoList();
  loadImageList();
}

// Helper function to extract YouTube ID
function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

// Display media on pages
function displayPageContent() {
  displayMusicGallery();
  
  // Display scene content
  const scenePerformances = document.getElementById('scene-performances');
  if (scenePerformances) {
    const videos = JSON.parse(localStorage.getItem('videoList') || '[]');
    if (videos.length > 0) {
      scenePerformances.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">' +
        videos.map(v => `
          <div style="background: var(--card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius); padding: 16px;">
            <h4>${v.title}</h4>
            ${v.url.includes('youtube.com') || v.url.includes('youtu.be') ? 
              `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${extractYoutubeId(v.url)}" frameborder="0" allowfullscreen></iframe>` :
              `<video controls style="width: 100%; height: 200px;"><source src="${v.url}" /></video>`
            }
          </div>
        `).join('') +
        '</div>';
    }
  }
}

// Initialize on page load
window.addEventListener('load', () => {
  initAdmin();
  displayPageContent();
});
