document.addEventListener("DOMContentLoaded", function () {
    const view = document.getElementById("viewnotesbydate");
    const calendarnotes = document.getElementById("calendarnotes");
    if (!view || !calendarnotes) return;

    // Add notescontainer class so calendar results use same grid styles as notes/archive
    calendarnotes.classList.add('notescontainer');

    view.addEventListener("click", () => {
        const selectdateEl = document.getElementById("selectdate");
        const selectdate = selectdateEl ? selectdateEl.value : "";
        if (!selectdate) {
            alert("Please select a date!");
            return;
        }

        const targetDate = new Date(selectdate);
        if (isNaN(targetDate)) {
            alert("Invalid date selected.");
            return;
        }

        const notes = JSON.parse(localStorage.getItem("notes")) || [];

        function parseFlexibleDate(d) {
            if (!d) return null;
            // try native parse first
            const parsed = Date.parse(d);
            if (!isNaN(parsed)) return new Date(parsed);

            // try common M/D/YYYY or D/M/YYYY with separators
            const parts = String(d).trim().split(/[\/\-. ]+/);
            if (parts.length === 3) {
                const [a, b, c] = parts.map(p => parseInt(p, 10));
                if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
                    // assume month/day/year
                    const m1 = new Date(c, a - 1, b);
                    if (!isNaN(m1)) return m1;
                    // assume day/month/year
                    const m2 = new Date(c, b - 1, a);
                    if (!isNaN(m2)) return m2;
                }
            }
            return null;
        }

        function sameDate(d1, d2) {
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        }

        const notesondate = notes.filter(note => {
            if (note.archived) return false;
            const nd = parseFlexibleDate(note.date) || null;
            if (!nd) return false;
            return sameDate(nd, targetDate);
        });

        calendarnotes.innerHTML = "";

        if (notesondate.length === 0) {
            calendarnotes.innerHTML = "<p>No notes found for the selected date.</p>";
            return;
        }

        notesondate.forEach(note => {
            const card = document.createElement("div");
            card.classList.add("notescard");

            const esc = (typeof window !== 'undefined' && window.escapeHtml) ? window.escapeHtml : function(s){
                if (!s && s !== 0) return '';
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            };

            card.innerHTML = `
                <h3 class="notestitle">${esc(note.title)}</h3>
                <p class="notedate">${note.date}</p>
                <p class="notecontent">${esc(note.content)}</p>
                <div class="notesaction">
                    <a class="editnotes" href="edit.html?id=${note.id}">Edit</a>
                    <a class="viewnotes" href="view.html?id=${note.id}">View</a>
                    
                </div>
            `;

            calendarnotes.appendChild(card);
        });
    });
});
