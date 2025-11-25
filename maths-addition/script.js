let correctScore = 0;
let wrongScore = 0;

generateQuestion();

function generateQuestion() {
    firstNumber = Math.floor(Math.random() * 10);
    secondNumber = Math.floor(Math.random() * 10);
    total = firstNumber + secondNumber;

    document.getElementById('primary-number').innerText = firstNumber;
    document.getElementById('secondary-number').innerText = secondNumber;

    // colorful number blocks
    document.getElementById('primary-number').style.background = randomColor();
    document.getElementById('secondary-number').style.background = randomColor();

    document.getElementById('guess').value = "";
    document.getElementById('guess').focus();
}

function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`;
}

document.getElementById('btn').addEventListener('click', checkAnswer);

function checkAnswer() {
    let guess = Number(document.getElementById('guess').value);

    if (document.getElementById('guess').value === "") {
        showMessage("Please enter a number!", "yellow");
        return;
    }

    if (guess === total) {
        correctScore++;
        showMessage("✔ Correct!", "lightgreen");
        document.getElementById('correct').innerText = correctScore;
    } else {
        wrongScore++;
        showMessage("✘ Wrong! Correct answer: " + total, "red");
        document.getElementById('wrong').innerText = wrongScore;
    }

    setTimeout(generateQuestion, 1200);
}

function showMessage(text, color) {
    let msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.color = color;

    msg.style.transform = "scale(1.4)";
    setTimeout(() => msg.style.transform = "scale(1)", 200);
}
