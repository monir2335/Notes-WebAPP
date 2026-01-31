// Load saved font family on all pages
document.addEventListener("DOMContentLoaded", () => {
    const savedfont = localStorage.getItem("fontfamily");
    if (savedfont) {
        const style = document.createElement("style");
        style.id = "fontStyle";
        style.textContent = `* { font-family: ${savedfont} !important; }`;
        document.head.appendChild(style);
    }
});
