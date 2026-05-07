// commonplace.js - The Commonplace Book feature

function openCommonplaceBook() {
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <h1>📖 My Commonplace Book</h1>
            <p style="font-family: 'Indie Flower', cursive;">A collection of wisdom, clipped from your readings</p>
            <div id="clipsList">
                ${clips.length === 0 ? '<p>✨ No clips yet. Highlight any text on an article to save it here!</p>' : ''}
                ${clips.map((clip, index) => `
                    <div class="clip-item">
                        <div class="clip-text">"${clip.text}"</div>
                        <div><small>From: ${clip.source} • ${new Date(clip.date).toLocaleDateString()}</small></div>
                        <textarea class="annotation" placeholder="Write your handwritten thoughts here..." data-index="${index}">${clip.annotation || ''}</textarea>
                        <button onclick="saveAnnotation(${index}, this)">💾 Save Annotation</button>
                        <button onclick="deleteClip(${index})" style="background:#dc3545; color:white; margin-left:10px;">🗑️ Delete</button>
                    </div>
                `).join('')}
            </div>
            <button onclick="exportCommonplaceBook()" style="margin-top:20px; background:#28a745; color:white; padding:10px;">📄 Export as PDF/Text</button>
            <button onclick="this.closest('.modal').remove()" style="margin-left:10px;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Update clip count display
    updateClipCount();
}

function clipToCommonplace(source, text) {
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    clips.unshift({
        source: source,
        text: text,
        annotation: '',
        date: new Date().toISOString()
    });
    localStorage.setItem('commonplaceClips', JSON.stringify(clips));
    showNotification('✂️ Clipped to your Commonplace Book!');
    updateClipCount();
}

// Allow text selection clipping on any article
document.addEventListener('mouseup', function() {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 10 && selection.length < 500) {
        const source = document.querySelector('.news-title')?.innerText || 'Current Article';
        if (confirm(`Clip "${selection.substring(0, 50)}..." to your Commonplace Book?`)) {
            clipToCommonplace(source, selection);
        }
    }
});

function saveAnnotation(index, button) {
    const textarea = button.previousElementSibling;
    const annotation = textarea.value;
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    if (clips[index]) {
        clips[index].annotation = annotation;
        localStorage.setItem('commonplaceClips', JSON.stringify(clips));
        showNotification('✍️ Annotation saved in your handwriting style!');
    }
}

function deleteClip(index) {
    if (confirm('Delete this clip?')) {
        const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
        clips.splice(index, 1);
        localStorage.setItem('commonplaceClips', JSON.stringify(clips));
        openCommonplaceBook(); // Refresh modal
        showNotification('Clip removed');
    }
}

function exportCommonplaceBook() {
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    let exportText = 'MY COMMONPLACE BOOK\n\n';
    clips.forEach((clip, i) => {
        exportText += `${i+1}. From: ${clip.source} (${new Date(clip.date).toLocaleDateString()})\n`;
        exportText += `   Quote: "${clip.text}"\n`;
        exportText += `   My Notes: ${clip.annotation || '(No annotations yet)'}\n\n`;
    });
    
    const blob = new Blob([exportText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `commonplace-book-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showNotification('📄 Commonplace Book exported!');
}

function updateClipCount() {
    const clips = JSON.parse(localStorage.getItem('commonplaceClips') || '[]');
    const countSpan = document.getElementById('clipCount');
    if (countSpan) countSpan.innerText = clips.length;
}

// Initialize on page load
updateClipCount();
