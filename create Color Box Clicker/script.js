// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Select all boxes
const boxes = document.querySelectorAll('.box');

// Add click event to each box
boxes.forEach(box => {
  box.addEventListener('click', () => {
    box.style.backgroundColor = getRandomColor();
  });
});
