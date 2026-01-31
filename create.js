document.addEventListener("DOMContentLoaded", () => {
    const clear1 = document.getElementById("clearform");
    const title1 = document.getElementById("inputtitle");
    const content1 = document.getElementById("inputcontent");
    const save1 = document.getElementById("savenote");

    save1.addEventListener("click", () => {
        const title = title1.value.trim();
        const content = content1.value.trim();
        if (!title || !content) {
            alert("Please fill in the title and content.");
            return;
        }

        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const note = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString(),
            archived: false
        };

        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
        window.location.href = "notes.html";
    });


    /* to clear the entire writings */
    clear1.addEventListener("click", () => {
        title1.value = "";
        content1.value = "";
    });
})