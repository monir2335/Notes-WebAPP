document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const titleEl = document.getElementById('note-title');
    const dateEl = document.getElementById('note-date');
    const contentEl = document.getElementById('note-content');
    const container = document.querySelector('.viewnotecontainer');

    if (!idParam || !titleEl || !dateEl || !contentEl || !container) return;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteId = Number(idParam);
    const note = notes.find(n => Number(n.id) === noteId);
    if (!note) {
        titleEl.textContent = 'Note not found';
        return;
    }

    // use escapeHtml if available
    const esc = (typeof window !== 'undefined' && window.escapeHtml) ? window.escapeHtml : function(s){
        if (!s && s !== 0) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    titleEl.textContent = note.title;
    dateEl.textContent = note.date;
    contentEl.innerHTML = esc(note.content).replace(/\n/g, '<br>');

    // Actions: Edit, Delete, Back
    const actions = document.createElement('div');
    actions.className = 'view-actions';

    const editBtn = document.createElement('a');
    editBtn.className = 'editnotes view-btn';
    editBtn.href = `edit.html?id=${note.id}`;
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deletenote view-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        const ok = confirm('Delete this note? This cannot be undone.');
        if (!ok) return;
        const remaining = notes.filter(n => Number(n.id) !== noteId);
        localStorage.setItem('notes', JSON.stringify(remaining));
        window.location.href = 'notes.html';
    });

    const backLink = document.createElement('a');
    backLink.className = 'view-back view-btn';
    backLink.href = 'notes.html';
    backLink.textContent = 'Back';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(backLink);

    container.appendChild(actions);
});
