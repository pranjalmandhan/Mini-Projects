let correctBowl = 0;

// Place ball randomly
function shuffle() {
    correctBowl = Math.floor(Math.random() * 3) + 1;
    document.getElementById("message").innerHTML = "Shuffling... Guess now!";
    document.getElementById("ball").style.display = "none";
    document.getElementById("playAgain").style.display = "none";
}

// Check clicked bowl
function checkBowl(num) {
    if (num === correctBowl) {
        document.getElementById("message").innerHTML = "🎉 Correct! You found the ball!";
        showBallUnder(num);
    } else {
        document.getElementById("message").innerHTML = "❌ Wrong bowl! Try again.";
        showBallUnder(correctBowl);
    }
    document.getElementById("playAgain").style.display = "inline-block";
}

// Show ball under bowl
function showBallUnder(bowlNumber) {
    const ball = document.getElementById("ball");
    const bowl = document.getElementById("b" + bowlNumber);

    let rect = bowl.getBoundingClientRect();
    ball.style.display = "block";
    ball.style.left = rect.left + rect.width / 2 - 10 + "px";
    ball.style.top = rect.top + rect.height - 20 + "px";
}

// Reset game
function playAgain() {
    document.getElementById("ball").style.display = "none";
    document.getElementById("message").innerHTML = "";
}
