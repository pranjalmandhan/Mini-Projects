const timeDisplay = document.getElementById('time');
const modeLabel = document.getElementById('modeLabel');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggle = document.getElementById('themeToggle');
const ringProgress = document.querySelector('.ring-progress');

let timer;
let isRunning = false;
let workTime = 25 * 60;
let breakTime = 5 * 60;
let remaining = workTime;
let isWork = true;

// Sounds
const startSound = new Audio('sounds/start.mp3');
const endSound = new Audio('sounds/end.mp3');

function updateTimeDisplay() {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  updateRing();
}

function updateRing() {
  const total = isWork ? workTime : breakTime;
  const progress = 565 - (remaining / total) * 565;
  ringProgress.style.strokeDashoffset = progress;
}

function toggleTimer() {
  if (!isRunning) {
    timer = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        updateTimeDisplay();
      } else {
        endSound.play();
        clearInterval(timer);
        isRunning = false;
        isWork = !isWork;
        remaining = isWork ? workTime : breakTime;
        modeLabel.textContent = isWork ? "Work Mode" : "Break Time ☕";
        startPauseBtn.textContent = "▶ Start";
      }
    }, 1000);
    startSound.play();
    startPauseBtn.textContent = "⏸ Pause";
    isRunning = true;
  } else {
    clearInterval(timer);
    startPauseBtn.textContent = "▶ Start";
    isRunning = false;
  }
}

function resetTimer() {
  clearInterval(timer);
  remaining = isWork ? workTime : breakTime;
  updateTimeDisplay();
  startPauseBtn.textContent = "▶ Start";
  isRunning = false;
}

startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Theme toggle
themeToggle.onchange = (e) => {
  const isDark = e.target.checked;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
  document.getElementById('themeLabel').textContent = isDark ? '🌙 Dark' : '☀️ Light';
};

// Init
updateTimeDisplay();
