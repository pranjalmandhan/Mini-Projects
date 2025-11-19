const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

const voiceBtn = document.getElementById("voiceBtn");
const wordTitle = document.getElementById("voice_word");
const pos = document.getElementById("pos");
const meaningText = document.getElementById("meaningText");
const exampleText = document.getElementById("exampleText");
const synonymsList = document.getElementById("synonymsList");

function searchWord() {
    let word = input.value.trim();
    if (!word) return;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(res => res.json())
        .then(data => {
            let entry = data[0];
            let meaning = entry.meanings[0];

            wordTitle.textContent = entry.word;
            pos.textContent = meaning.partOfSpeech;

            meaningText.textContent = meaning.definitions[0].definition;
            exampleText.textContent = meaning.definitions[0].example || "No example available";

            synonymsList.innerHTML = "";
            if (meaning.synonyms.length > 0) {
                meaning.synonyms.slice(0, 5).forEach(s => {
                    let tag = `<span>${s}</span>`;
                    synonymsList.innerHTML += tag;
                });
            } else {
                synonymsList.textContent = "None";
            }

            // Voice pronunciation
            voiceBtn.onclick = () => {
                let speech = new SpeechSynthesisUtterance(entry.word);
                window.speechSynthesis.speak(speech);
            };
        })
        .catch(() => {
            wordTitle.textContent = "Not Found";
            pos.textContent = "___";
            meaningText.textContent = "No meaning available";
            exampleText.textContent = "___";
            synonymsList.textContent = "___";
        });
}

// Search when clicking icon
searchBtn.onclick = searchWord;

// Search on Enter key
input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchWord();
});

// Clear input
clearBtn.onclick = () => {
    input.value = "";
};
