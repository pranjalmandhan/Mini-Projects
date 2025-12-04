const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Life" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "Success" },
    { text: "If you are working on something exciting, it will keep you motivated.", author: "Unknown", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", category: "Success" },
    { text: "Dream bigger. Do bigger.", author: "Unknown", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" }
];

const gradients = [
    "linear-gradient(to right, #ff7e5f, #feb47b)",
    "linear-gradient(to right, #6a11cb, #2575fc)",
    "linear-gradient(to right, #00c6ff, #0072ff)",
    "linear-gradient(to right, #f7971e, #ffd200)"
];

const quoteText = document.getElementById("quote");
const quoteAuthor = document.getElementById("author");
const quoteBox = document.getElementById("quote-box");
const body = document.body;
const favoritesList = document.getElementById("favorites-list");

function randomGradient() {
    body.style.background = gradients[Math.floor(Math.random() * gradients.length)];
}

function generateQuote(category = "all") {
    quoteBox.style.opacity = 0;
    setTimeout(() => {
        let filtered = quotes;
        if (category !== "all") filtered = quotes.filter(q => q.category === category);
        const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];

        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
        randomGradient();

        quoteBox.style.opacity = 1;
    }, 500);
}

// Generate quote by category
function generateQuoteByCategory(cat) {
    generateQuote(cat);
}

// Auto-change quote every 15 seconds
setInterval(() => generateQuote(document.getElementById("category").value), 15000);

// Voice readout
function speakQuote() {
    const utterance = new SpeechSynthesisUtterance(`${quoteText.textContent} ${quoteAuthor.textContent}`);
    speechSynthesis.speak(utterance);
}

// Share on Twitter
function shareQuote() {
    const text = encodeURIComponent(`${quoteText.textContent} ${quoteAuthor.textContent}`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
}

// Save favorite quote
function saveQuote() {
    if (!quoteText.textContent) return; // nothing to save

    const savedQuotes = JSON.parse(localStorage.getItem("favorites")) || [];

    // Prevent duplicates
    const exists = savedQuotes.some(q => q.text === quoteText.textContent && q.author === quoteAuthor.textContent);
    if (exists) {
        alert("This quote is already saved!");
        return;
    }

    savedQuotes.push({ text: quoteText.textContent, author: quoteAuthor.textContent });
    localStorage.setItem("favorites", JSON.stringify(savedQuotes));
    displayFavorites();
}

// Display saved favorites
function displayFavorites() {
    const savedQuotes = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.innerHTML = "";
    savedQuotes.forEach((q, index) => {
        const li = document.createElement("li");
        li.textContent = `${q.text} ${q.author}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "";
        deleteBtn.onclick = () => {
            savedQuotes.splice(index, 1);
            localStorage.setItem("favorites", JSON.stringify(savedQuotes));
            displayFavorites();
        };
        li.appendChild(deleteBtn);

        favoritesList.appendChild(li);
    });
}

// Search quotes
function searchQuote() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const filtered = quotes.filter(q => q.text.toLowerCase().includes(keyword));
    if (filtered.length > 0) {
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        quoteText.textContent = `"${random.text}"`;
        quoteAuthor.textContent = `- ${random.author}`;
        randomGradient();
    } else {
        quoteText.textContent = "No matching quotes found!";
        quoteAuthor.textContent = "";
    }
}

// Initialize
generateQuote();
displayFavorites();
document.getElementById("new-quote").addEventListener("click", () => generateQuote(document.getElementById("category").value));


// Clear all saved quotes
document.getElementById("clear-favorites").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all saved quotes?")) {
        localStorage.removeItem("favorites");
        displayFavorites();
    }
});
