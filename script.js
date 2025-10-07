const form = document.getElementById('cardForm');
const photo = document.getElementById('photo');
const avatarPreview = document.getElementById('avatarPreview');
const previewName = document.getElementById('previewName');
const previewMeta = document.getElementById('previewMeta');
const cardsWrap = document.getElementById('cardsWrap');
const clearBtn = document.getElementById('clearBtn');
const removeAll = document.getElementById('removeAll');
const themeToggle = document.getElementById('themeToggle');

let currentImage = null;
let students = JSON.parse(localStorage.getItem('students') || '[]');

function setTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

form.name.addEventListener('input', () => previewName.textContent = form.name.value || 'Full name');
form.major.addEventListener('input', updateMeta);
form.year.addEventListener('change', updateMeta);

function updateMeta() {
    previewMeta.textContent = `${form.major.value || 'Major'} • ${form.year.value ? form.year.value + ' Year' : ''}`;
}

photo.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) { currentImage = null; avatarPreview.textContent = '+'; return; }
    const reader = new FileReader();
    reader.onload = ev => {
        currentImage = ev.target.result;
        avatarPreview.innerHTML = `<img src="${currentImage}" style="width:100%;height:100%;object-fit:cover">`;
    };
    reader.readAsDataURL(f);
});

clearBtn.addEventListener('click', () => {
    form.reset(); currentImage = null;
    avatarPreview.textContent = '+';
    previewName.textContent = 'Full name';
    previewMeta.textContent = 'Major • Year';
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email'); return; }
    const hobbies = form.hobbies.value.split(',').map(h => h.trim()).filter(h => h);
    const student = {
        id: Date.now(),
        name: form.name.value.trim(),
        email: email,
        major: form.major.value.trim(),
        year: form.year.value,
        bio: form.bio.value.trim(),
        hobbies: hobbies,
        photo: currentImage,
        theme: form.theme.value
    };
    students.unshift(student);
    localStorage.setItem('students', JSON.stringify(students));
    renderCards();
    form.reset(); currentImage = null;
    avatarPreview.textContent = '+';
    previewName.textContent = 'Full name';
    previewMeta.textContent = 'Major • Year';
});

removeAll.addEventListener('click', () => {
    if (confirm('Delete all cards?')) { students = []; localStorage.setItem('students', JSON.stringify(students)); renderCards(); }
});

function renderCards() {
    cardsWrap.innerHTML = '';
    if (students.length === 0) { cardsWrap.innerHTML = '<div class="empty">No cards yet — fill the form and click "Create card" to add one.</div>'; return; }
    const grid = document.createElement('div'); grid.className = 'cards-grid';
    students.forEach((s, i) => {
        const card = document.createElement('div'); card.className = 'student-card';
        card.innerHTML = `
      <div class="top">
        <div class="avatar">${s.photo ? `<img src="${s.photo}" style="width:100%;height:100%;object-fit:cover">` : `${s.name.split(' ').map(n => n[0]).join('').toUpperCase()}`}</div>
        <div class="info">
          <div class="name">${s.name}</div>
          <div class="meta">${s.major || '—'} • ${s.year ? s.year + ' Year' : '—'}</div>
        </div>
      </div>
      <div class="bio">${s.bio}</div>
      <div class="hobbies">${s.hobbies.join(', ')}</div>
    `;
        grid.appendChild(card);
    });
    cardsWrap.appendChild(grid);
}

setTheme();
renderCards();
