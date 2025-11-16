const dice = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');

// Function to roll a dice (1-6)
function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  dice.textContent = roll;
}

// Event listener for button click
rollBtn.addEventListener('click', rollDice);
