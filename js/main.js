// main.js - Core functionality

// Load current date
document.getElementById('currentDate').innerHTML = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

// Load study streak from localStorage
let streak = localStorage.getItem('studyStreak') ? parseInt(localStorage.getItem('studyStreak')) : 0;
document.getElementById('streakCount').innerText = streak;

function incrementStreak() {
    streak++;
    localStorage.setItem('studyStreak', streak);
    document.getElementById('streakCount').innerText = streak;
    showNotification('🎉 Amazing! ' + streak + ' days of consistency!');
}

// Toggle between normal and handwritten reading mode
function toggleReadingMode() {
    document.body.classList.toggle('handwritten-mode');
    const mode = document.body.classList.contains('handwritten-mode') ? 'Handwritten' : 'Normal';
    showNotification(`✍️ ${mode} reading mode activated`);
}

// Load content from your existing JSON files
async function loadContent() {
    try {
        // Look for JSON files in your data folder
        const response = await fetch('data/content.json');
        if (!response.ok) throw new Error('No content yet');
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        // If no JSON exists yet, show demo content
        displayDemoContent();
    }
}

function displayArticles(articles) {
    const grid = document.getElementById('contentGrid');
    grid.innerHTML = '';
    
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.onclick = () => openFullArticle(article);
        card.innerHTML = `
            ${article.image ? `<img src="${article.image}" class="news-image" alt="${article.title}">` : ''}
            <div class="news-content">
                <h2 class="news-title">${article.title}</h2>
                <p class="news-summary">${article.summary || article.content.substring(0, 150)}...</p>
                <small>✍️ Click to read in handwritten format</small>
            </div>
        `;
        grid.appendChild(card);
    });
}

function displayDemoContent() {
    const demoArticles = [
        {
            title: "📖 The Art of Handwritten Notes",
            content: "Research shows that writing notes by hand improves memory retention. This platform simulates that experience digitally.",
            summary: "Why handwritten notes beat typing for studying."
        },
        {
            title: "🧠 Active Recall Technique",
            content: "Test yourself instead of just re-reading. Use the Commonplace Book feature to quiz yourself daily.",
            summary: "The most effective study method revealed."
        },
        {
            title: "⏰ Pomodoro for Students",
            content: "Study 25 minutes, break 5 minutes. Track your streaks and build lasting study habits.",
            summary: "Time management technique that works."
        }
    ];
    displayArticles(demoArticles);
}

function openFullArticle(article) {
    // Create a modal with handwritten-style full article
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <button onclick="this.closest('.modal').remove()" style="float:right; font-size:24px; background:none; border:none; cursor:pointer;">&times;</button>
            <h1 style="font-family: 'Caveat', cursive; font-size: 48px;">${article.title}</h1>
            <div style="font-family: 'Indie Flower', cursive; font-size: 22px; line-height: 1.8;">
                ${article.content}
            </div>
            <button onclick="clipToCommonplace('${article.title.replace(/'/g, "\\'")}', '${article.content.substring(0, 200).replace(/'/g, "\\'")}')" style="margin-top:20px; background:#8b4513; color:white; padding:10px; border:none; border-radius:10px; cursor:pointer;">
                ✂️ Clip to Commonplace Book
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#2c1810; color:#f5e6d3; padding:10px 20px; border-radius:25px; z-index:2000; font-family:Caveat;';
    notif.innerText = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Check if user is admin (for quick note feature)
function checkAdmin() {
    const isAdmin = localStorage.getItem('isAdminLoggedIn');
    if (isAdmin === 'true') {
        document.getElementById('quickNote').style.display = 'block';
    }
}

function saveQuickNote() {
    const note = document.getElementById('quickNoteText').value;
    if (note) {
        const notes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
        notes.push({ text: note, date: new Date().toISOString() });
        localStorage.setItem('quickNotes', JSON.stringify(notes));
        document.getElementById('quickNoteText').value = '';
        showNotification('📝 Note saved to your dashboard!');
    }
}

// Initialize
loadContent();
checkAdmin();

// Auto-refresh streak daily
setInterval(() => {
    const lastCheck = localStorage.getItem('lastStreakCheck');
    const today = new Date().toDateString();
    if (lastCheck !== today) {
        // Reset streak if day missed (optional logic)
        localStorage.setItem('lastStreakCheck', today);
    }
}, 60000);
