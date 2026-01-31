document.addEventListener("DOMContentLoaded", () => {
    const font = document.getElementById("fontfamily");
    const applyfont = document.getElementById("applyfont");
    const dictionary = document.getElementById("dictionaryapi");
    const search = document.getElementById("search");
    const dictionaryapiresult = document.getElementById("dictionaryapiresult");
    const exportnotes = document.getElementById("exportnotes");

    // Applying font family to the website
    applyfont.addEventListener("click", () => {
        const selectedFont = font.value;

        // Remove old style tag if it exists
        const existingStyle = document.getElementById("fontStyle");
        if (existingStyle) existingStyle.remove();

        // Create new style tag with !important
        const style = document.createElement("style");
        style.id = "fontStyle";
        style.textContent = `* { font-family: ${selectedFont} !important; }`;
        document.head.appendChild(style);

        alert(`Font family applied: ${selectedFont} `);
        localStorage.setItem("fontfamily", selectedFont);
    });

    // Dictionary API
    search.addEventListener("click", async () => {
        const word = dictionary.value.trim();
        if (!word) {
            alert("Please enter a word to search!");
            return;
        }

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            if (!response.ok) throw new Error("Word not found");
            const data = await response.json();
            const meanings = data[0].meanings.map(meaning =>
                `${meaning.partOfSpeech}: ${meaning.definitions[0].definition}`
            ).join("<br>");

            dictionaryapiresult.style.color = "#fff";
            dictionaryapiresult.innerHTML = `<strong>${word}</strong><br>${meanings}`;
        } catch (error) {
            dictionaryapiresult.style.color = "#fF5555";
            dictionaryapiresult.innerHTML = "Error fetching definition. Please try another word.";
        }
    });

    //Exporting notes as TXT
    exportnotes.addEventListener("click", () => {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        if (!notes.length) return alert("No notes to export!");

        const textcontent = notes.map(note =>
            `Title: ${note.title} \n Date: ${note.date} \n Content: ${note.content} \n \n---\n`
        ).join("");

        const blob = new Blob([textcontent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mynotes_export.txt";
        link.click();
        URL.revokeObjectURL(url);
        alert("Notes exported successfully!");
    });

    // Load saved font family on page load
    const savedfont = localStorage.getItem("fontfamily");
    if (savedfont) {
        const style = document.createElement("style");
        style.id = "fontStyle";
        style.textContent = `* { font-family: ${savedfont} !important; }`;
        document.head.appendChild(style);
    }
});