// To edit a note (edit.html)
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const noteId = parseInt(params.get("id"));

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find(n => n.id === noteId);
    if (!note) {
        alert("Note not found!");
        window.location.href = "notes.html";
    }

    document.getElementById("inputtitle").value = note.title;
    document.getElementById("inputcontent").value = note.content;

    // to update note
    const update = document.getElementById("updatenote");
    update.addEventListener("click", () => {
        const title = document.getElementById("inputtitle").value;
        const content = document.getElementById("inputcontent").value;

        if (title === "" || content === "") {
            alert("Please fill in the title and content.");
            return;
        }

        const updatenote = notes.map(n => {
            if (n.id === noteId) {
                n.title = title;
                n.content = content;
                n.date = new Date().toLocaleDateString();  // to update the date
            }
            return n;
        });

        localStorage.setItem("notes", JSON.stringify(updatenote));
        window.location.href = "notes.html";
    });

    //to delete a note
    const delete1 = document.getElementById("deletenote");
    delete1.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this note?")) {

            let notes = JSON.parse(localStorage.getItem("notes")) || [];
            notes = notes.filter(n => n.id !== noteId);
            localStorage.setItem("notes", JSON.stringify(notes));
            window.location.href = "notes.html";
        }
    });
});