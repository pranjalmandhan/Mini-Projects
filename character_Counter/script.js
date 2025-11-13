const textArea = document.getElementById("text");
const counter = document.getElementById("counter");
const maxLength = 100;

textArea.addEventListener("input", () => {
  const remaining = maxLength - textArea.value.length;
  counter.textContent = `${remaining} characters left`;

  if (remaining <= 10) {
    counter.style.color = "#ff4b5c"; // Red warning
  } else if (remaining <= 30) {
    counter.style.color = "#ffd56b"; // Yellow caution
  } else {
    counter.style.color = "#00e0ff"; // Cool blue default
  }
});
