// Main JavaScript for The Study Chronicle

// Global variables
let allArticles = [];
let currentCategory = 'all';

// Load articles on page load
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    updateStats();
    setupStudyStreak();
});

// Load articles from localStorage or default
function loadArticles() {
    const savedArticles = localStorage.getItem('studyArticles');
    
    if (savedArticles && JSON.parse(savedArticles).length > 0) {
        allArticles = JSON.parse(savedArticles);
    } else {
        // Default demo articles
        allArticles = [
            {
                id: Date.now(),
                title: "🎓 10 Study Techniques That Actually Work",
                content: "Research shows that active recall and spaced repetition are the most effective learning methods. This article explores proven techniques to improve memory retention and exam performance. <br><br> Key techniques include:<br> • Active Recall: Test yourself instead of just reading<br> • Spaced Repetition: Review material at increasing intervals<br> • Pomodoro Technique: Study in focused 25-minute blocks<br> • Feynman Technique: Teach concepts to others<br><br> Implement these strategies today to see immediate improvement in your learning outcomes!",
                excerpt: "Discover research-backed study methods that boost retention and grades...",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4f4173?w=600",
                category: "academics",
                date: new Date().toISOString(),
                author: "Study Chronicle Team"
            },
            {
                id: Date.now() + 1,
                title: "💻 How AI is Changing Education in 2026",
                content: "Artificial Intelligence is revolutionizing how students learn. From personalized tutoring systems to automated essay feedback, AI tools are making education more accessible and effective. <br><br> Top AI tools for students:<br> • ChatGPT for research assistance<br> • Grammarly for writing improvement<br> • Wolfram Alpha for complex calculations<br> • Duolingo for language learning<br><br> Learn how to leverage these tools ethically and effectively in your studies.",
                excerpt: "The latest AI tools that every student should know about...",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
                category: "technology",
                date: new Date().toISOString(),
                author: "Tech Editor"
            },
            {
                id: Date.now() + 2,
                title: "📝 Master Your Time: Productivity Guide",
                content: "Time management is the #1 skill successful students master. This comprehensive guide covers scheduling techniques, priority matrices, and digital tools to help you make the most of every study session. <br><br> The Eisenhower Matrix helps you prioritize tasks by urgency and importance. Use digital calendars to block study time. The Two-Minute Rule: If a task takes less than two minutes, do it immediately.<br><br> Start implementing these strategies today for better results with less stress!",
                excerpt: "Proven time management strategies for busy students...",
                image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600",
                category: "academics",
                date: new Date().toISOString(),
                author: "Productivity Expert"
            },
            {
                id: Date.now() + 3,
                title: "🏆 Campus Library Gets Major Upgrade",
                content: "The university library has unveiled a $2 million renovation featuring new study pods, 24/7 access areas, and a digital media lab. Students can now book private rooms online and access over 50,000 new e-books. <br><br> New features include:<br> • Silent study floors with noise-canceling booths<br> • Group collaboration rooms with 85-inch displays<br> • 3D printing and VR stations<br> • Extended hours during exam weeks<br><br> Visit the library website to book your study space today!",
                excerpt: "New study spaces and resources now available...",
                image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600",
                category: "campus",
                date: new Date().toISOString(),
                author: "Campus Correspondent"
            }
        ];
        saveArticles();
    }
    
    displayArticles(allArticles);
}

// Save articles to localStorage
function saveArticles() {
    localStorage.setItem('studyArticles', JSON.stringify(allArticles));
}

// Display articles in grid
function displayArticles(articles) {
    const grid = document.getElementById('articlesGrid');
    
    if (articles.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 60px; background: white; border-radius: 12px;">
                <i class="fas fa-newspaper" style="font-size: 48px; color: #cbd5e0;"></i>
                <h3 style="margin-top: 20px;">No articles yet</h3>
                <p>Login to admin panel to add your first article!</p>
                <button onclick="window.location.href='admin/index.html'" class="btn btn-primary" style="margin-top: 20px;">
                    Go to Admin Panel
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = articles.map(article => `
        <div class="article-card" onclick="openArticle(${article.id})">
            <img src="${article.image}" class="article-image" onerror="this.src='https://via.placeholder.com/600x400?text=Study+Image'">
            <div class="article-content">
                <span class="article-category">${getCategoryIcon(article.category)} ${article.category.toUpperCase()}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt.substring(0, 120)}...</p>
                <div class="read-more">
                    Read Full Article <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
    `).join('');
    
    updateStats();
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'academics': '📚',
        'technology': '💻',
        'campus': '🏫',
        'general': '📰'
    };
    return icons[category] || '📖';
}

// Open full article modal
function openArticle(articleId) {
    const article = allArticles.find(a => a.id === articleId);
    if (!article) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img src="${article.image}" class="modal-image" onerror="this.src='https://via.placeholder.com/900x400?text=Study+Article'">
                <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <span class="article-category">${getCategoryIcon(article.category)} ${article.category.toUpperCase()}</span>
                <h1 class="modal-title">${article.title}</h1>
                <div style="display: flex; gap: 20px; margin: 20px 0; color: #718096;">
                    <span><i class="far fa-calendar"></i> ${new Date(article.date).toLocaleDateString()}</span>
                    <span><i class="far fa-user"></i> ${article.author}</span>
                </div>
                <div class="modal-text">${article.content}</div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <button onclick="clipToCommonplace('${article.title}', '${article.excerpt}')" class="btn btn-primary">
                        <i class="fas fa-bookmark"></i> Save to Commonplace Book
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
}

// Filter by category
function showCategory(category) {
    currentCategory = category;
    const filtered = category === 'all' ? allArticles : allArticles.filter(a => a.category === category);
    displayArticles(filtered);
    
    // Scroll to top
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function showHome() {
    displayArticles(allArticles);
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

// Study streak functionality
function setupStudyStreak() {
    let streak = localStorage.getItem('studyStreak');
    let lastLogin = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (!streak) {
        localStorage.setItem('studyStreak', '0');
        streak = '0';
    }
    
    if (lastLogin !== today) {
        // Don't auto-increment, user must click check-in
    }
    
    document.getElementById('streakCount').innerText = streak;
}

function incrementStreak() {
    let streak = parseInt(localStorage.getItem('studyStreak') || '0');
    const lastLogin = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLogin === today) {
        showNotification('✅ Already checked in today! Come back tomorrow.');
        return;
    }
    
    streak++;
    localStorage.setItem('studyStreak', streak);
    localStorage.setItem('lastLoginDate', today);
    document.getElementById('streakCount').innerText = streak;
    showNotification(`🔥 Amazing! ${streak} day streak!`);
}

// Update stats
function updateStats() {
    document.getElementById('articleCount').innerText = allArticles.length;
    
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    document.getElementById('clipCount').innerText = clips.length;
}

// Show notification
function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position:fixed; bottom:100px; right:30px; background:#48bb78; color:white; padding:12px 24px; border-radius:8px; z-index:2000; font-weight:500; box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    notif.innerHTML = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Re-export for global access
window.openArticle = openArticle;
window.showCategory = showCategory;
window.showHome = showHome;
window.incrementStreak = incrementStreak;
window.clipToCommonplace = clipToCommonplace;
