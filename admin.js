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

// ---- Show (schedule) Management ----
function addShowEvent() {
  const title = document.getElementById('show-title').value.trim();
  const date = document.getElementById('show-date').value.trim();
  const place = document.getElementById('show-place').value.trim();
  const link = document.getElementById('show-link').value.trim();

  if (!title || !date) {
    alert('Uzupełnij tytuł i datę występu!');
    return;
  }

  let schedule = JSON.parse(localStorage.getItem('showSchedule') || '[]');
  const id = Date.now();
  schedule.push({ id, title, date, place, link });
  localStorage.setItem('showSchedule', JSON.stringify(schedule));

  document.getElementById('show-title').value = '';
  document.getElementById('show-date').value = '';
  document.getElementById('show-place').value = '';
  document.getElementById('show-link').value = '';

  loadShowSchedule();
  displayShowSchedule();
  alert('Termin dodany!');
}

function deleteShowEvent(id) {
  if (confirm('Usunąć ten termin?')) {
    let schedule = JSON.parse(localStorage.getItem('showSchedule') || '[]');
    schedule = schedule.filter(e => e.id !== id);
    localStorage.setItem('showSchedule', JSON.stringify(schedule));
    loadShowSchedule();
    displayShowSchedule();
  }
}

function sortSchedule(schedule) {
  return [...schedule].sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    if (!isNaN(aTime) && !isNaN(bTime)) {
      return aTime - bTime;
    }
    return a.date.localeCompare(b.date);
  });
}

function formatEventDate(value) {
  const parsed = Date.parse(value);
  if (!isNaN(parsed)) {
    return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(parsed));
  }
  return value;
}

function loadShowSchedule() {
  const listEl = document.getElementById('show-schedule-list');
  if (!listEl) return;

  const schedule = sortSchedule(JSON.parse(localStorage.getItem('showSchedule') || '[]'));

  if (schedule.length === 0) {
    listEl.innerHTML = '<p>Brak zaplanowanych występów.</p>';
    return;
  }

  listEl.innerHTML = '<ul style="list-style: none; padding: 0;">' +
    schedule.map(item => `
      <li style="padding: 8px; background: #0f1018; margin: 8px 0; border-radius: 8px; display: grid; gap: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
          <div>
            <strong>${item.title}</strong><br/>
            <small style="color: var(--muted);">${formatEventDate(item.date)}</small>
          </div>
          <button onclick="deleteShowEvent(${item.id})" style="padding: 4px 8px; background: #ff2ea6; color: #0b0b0f; border: none; border-radius: 4px; cursor: pointer;">Usuń</button>
        </div>
        ${item.place ? `<div style="color: var(--muted);">📍 ${item.place}</div>` : ''}
        ${item.link ? `<a style="color: var(--accent-2); font-weight: 600;" href="${item.link}" target="_blank" rel="noopener">Link do streamu</a>` : ''}
      </li>
    `).join('') +
    '</ul>';
}

function displayShowSchedule() {
  const publicEl = document.getElementById('show-schedule');
  if (!publicEl) return;

  const schedule = sortSchedule(JSON.parse(localStorage.getItem('showSchedule') || '[]'));

  if (schedule.length === 0) {
    publicEl.innerHTML = '<p>Brak zaplanowanych występów. Wróć wkrótce!</p>';
    return;
  }

  publicEl.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">' +
    schedule.map(item => `
      <article style="background: var(--card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow); display: grid; gap: 8px;">
        <header>
          <p class="chip" style="display: inline-block;">Live Show</p>
          <h3 style="margin: 6px 0 4px;">${item.title}</h3>
          <p style="margin: 0; color: var(--muted);">${formatEventDate(item.date)}</p>
        </header>
        ${item.place ? `<p style="margin: 0; color: var(--muted);">📍 ${item.place}</p>` : ''}
        ${item.link ? `<a style="color: var(--accent); font-weight: 700;" href="${item.link}" target="_blank" rel="noopener">Oglądaj / Dołącz</a>` : ''}
      </article>
    `).join('') +
    '</div>';
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

function displayVideoGallery(targetId) {
  const container = document.getElementById(targetId);

  if (!container) return;

  const videos = JSON.parse(localStorage.getItem('videoList') || '[]');

  if (videos.length === 0) {
    container.innerHTML = '<p>Brak materiałów. Dodaj je w panelu admina.</p>';
    return;
  }

  container.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">' +
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
  loadShowSchedule();
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
  displayVideoGallery('wystube-grid');
  displayShowSchedule();
  loadShowSchedule();
}

// Initialize on page load
window.addEventListener('load', () => {
  initAdmin();
  displayPageContent();
});
