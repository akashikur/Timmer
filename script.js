function startNewTimer() {
  const hours = parseInt(document.getElementById("hours").value);
  const minutes = parseInt(document.getElementById("minutes").value);
  const seconds = parseInt(document.getElementById("seconds").value);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    alert("Please enter valid time values.");
    return;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds <= 0) {
    alert("Please enter a positive time value.");
    return;
  }

  const timerDisplay = createTimerDisplay(hours, minutes, seconds);

  const timer = {
    totalSeconds,
    intervalId: null,
    timerDisplay,
  };

  activeTimers.push(timer);
  document.getElementById("active-timers").appendChild(timerDisplay);

  timer.intervalId = setInterval(() => {
    if (timer.totalSeconds <= 0) {
      clearInterval(timer.intervalId);
      handleTimerEnd(timer);
    } else {
      timer.totalSeconds--;
      updateTimerDisplay(timer, timer.totalSeconds);
    }
  }, 1000);
}

function createTimerDisplay(hours, minutes, seconds) {
  const timerDisplay = document.createElement("div");

  timerDisplay.classList.add("timer");

  const timeString = `
  <span>Time Left :</span>
  <div>
    <span>${hours.toString().padStart(2, "0")}</span> :
    <span>${minutes.toString().padStart(2, "0")}</span> :
    <span>${seconds.toString().padStart(2, "0")}</span>
    </div>
  `;

  timerDisplay.innerHTML = `${timeString}<button class="stop-timer-btn">Stop</button>`;
  return timerDisplay;
}

function updateTimerDisplay(timer, remainingSeconds) {
  const { hours, minutes, seconds } = convertSecondsToTime(remainingSeconds);

  timer.timerDisplay.innerHTML = `
    <span>Time Left :</span>
    <div>
      <span>${hours.toString().padStart(2, "0")}</span> :
      <span>${minutes.toString().padStart(2, "0")}</span> :
      <span>${seconds.toString().padStart(2, "0")}</span>
      </div>
      <button class="stop-timer-btn">Delete</button>
    `;
}

function handleTimerEnd(timer) {
  timer.timerDisplay.classList.add("timer-ended");
  document.getElementById("timer-end-display").style.display = "block";
  const audio = new Audio("./alerm.mp3");
  audio.play();
}

// Function to stop a timer
function stopTimer(timerIndex) {
  const timer = activeTimers[timerIndex];
  if (timer && timer.intervalId !== null) {
    clearInterval(timer.intervalId);
    activeTimers.splice(timerIndex, 1);
    const activeTimersDisplay = document.getElementById("active-timers");
    activeTimersDisplay.removeChild(timer.timerDisplay);
  }
}

function convertSecondsToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

document
  .getElementById("start-timer-btn")
  .addEventListener("click", startNewTimer);

document.getElementById("active-timers").addEventListener("click", (event) => {
  if (event.target.classList.contains("stop-timer-btn")) {
    const timerDisplay = event.target.parentNode;
    const timerIndex = activeTimers.findIndex(
      (timer) => timer.timerDisplay === timerDisplay
    );
    stopTimer(timerIndex);
  }
});

const activeTimers = [];
