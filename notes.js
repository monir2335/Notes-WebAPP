// Attach save handler if present on the page (create.html)
document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.getElementById("savenote");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            const titleEl = document.getElementById("inputtitle");
            const contentEl = document.getElementById("inputcontent");
            const title = titleEl ? titleEl.value.trim() : "";
            const content = contentEl ? contentEl.value.trim() : "";

            if (!title || !content) {
                alert("Please fill in the title and content.");
                return;
            }

            const note = {
                id: Date.now(),
                title: title,
                content: content,
                date: new Date().toLocaleDateString(),
                archived: false
            };

            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            notes.push(note);
            localStorage.setItem("notes", JSON.stringify(notes));

            // After saving, go back to notes list
            window.location.href = "notes.html";
        });
    }
});

// Delete a note by id
function deletenote(noteId) {
    const confirmdelete = confirm("Are you sure you want to delete this note?");
    if (!confirmdelete) return;

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter(n => n.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(notes));

    if (typeof displaynotes === 'function') displaynotes();
    if (typeof displayarchivednotes === 'function') displayarchivednotes();
}

// Display non-archived notes on notes.html
document.addEventListener("DOMContentLoaded", displaynotes);
function displaynotes() {
    const notescontainer = document.getElementById("notescontainer");
    if (!notescontainer) return;
    notescontainer.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(note => {
        if (note.archived) return;
        const notediv = document.createElement("div");
        notediv.className = "notescard";

        notediv.innerHTML = `
        <h3 class="notestitle">${escapeHtml(note.title)}</h3>
        <p class="notedate">${note.date}</p>
        <p class="notecontent">${escapeHtml(note.content)}</p>
        <div class="notesaction">
            <a class="editnotes" href="edit.html?id=${note.id}">Edit</a>
            <a class="viewnotes" href="view.html?id=${note.id}">View</a>
            <button class="archivenote" onclick="archivenote(${note.id})">Archive</button>
            <button class="deletenote" onclick="deletenote(${note.id})">Delete</button>
        </div>`;

        notescontainer.appendChild(notediv);
    });
}

// Archive a note
function archivenote(noteId) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.map(n => {
        if (n.id === noteId) n.archived = true;
        return n;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    if (typeof displaynotes === 'function') displaynotes();
    if (typeof displayarchivednotes === 'function') displayarchivednotes();
}

// Display archived notes on archive.html
document.addEventListener("DOMContentLoaded", displayarchivednotes);
function displayarchivednotes() {
    const archivecontainer = document.getElementById("archivecontainer");
    if (!archivecontainer) return;
    archivecontainer.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(note => {
        if (!note.archived) return;
        const notediv = document.createElement("div");
        notediv.className = "notescard";

        notediv.innerHTML = `
        <h3 class="notestitle">${escapeHtml(note.title)}</h3>
        <p class="notedate">${note.date}</p>
        <p class="notecontent">${escapeHtml(note.content)}</p>
        <div class="notesaction">
            <button class="restorenote" onclick="restorenote(${note.id})">Restore</button>
            <button class="deletenote" onclick="deletenote(${note.id})">Delete</button>
        </div>`;

        archivecontainer.appendChild(notediv);
    });
}

// Restore note from archive
function restorenote(noteId) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.map(n => {
        if (n.id === noteId) n.archived = false;
        return n;
    });
    localStorage.setItem("notes", JSON.stringify(notes));
    if (typeof displayarchivednotes === 'function') displayarchivednotes();
    if (typeof displaynotes === 'function') displaynotes();
}

// Small helper to avoid injecting raw HTML from user input
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
