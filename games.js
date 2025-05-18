let levels = [];
let currentLevel = 0;
let gameStarted = false;

const characterDialogs = [
  "Hello friends! I'm Chota Bheem from Dholakpur! As you saw in the video chutki is in danger! Can you help me reach her using CSS?",
  "Wow! You did it! Now I need to reach another ladoo. This time we need to use different CSS properties. Are you ready?",
  "Amazing! Kalaripayattu master would be proud! This next level is even trickier. Let's see if you can help me!",
  "Incredible! You're as smart as Jaggu! Now for something really challenging...",
  "You're as strong as Bheem with your CSS skills! One final challenge awaits..."
];

async function loadLevels() {
  try {
    levels = [
      {
        level: 1,
        title: "Help Bheem Get Ladoo",
        description: "Bheem needs this ladoo to save chutki! Use the justify-content property to center Bheem on the ladoo.",
        correct: "justify-content: center;",
        hint: "Try using justify-content with a value that centers items",
        layoutType: "flex",
        boxStyle: "display: flex; justify-content: flex-start; align-items: center;",
        characterStyle: "order: 1;",
        itemStyle: "order: 1;"
      },
      {
        level: 2,
        title: "Bheem Needs More Energy",
        description: "He is stronger then before! Now align Bheem to the laddu FAST!",
        correct: "justify-content: flex-end;",
        hint: "Try using justify-content: flex-end;",
        layoutType: "flex",
        boxStyle: "display: flex; justify-content: flex-start; align-items: center;",
        characterStyle: "order: 1;",
        itemStyle: "order: 1;"
      },
      {
        level: 3,
        title: "Bheem's Position Challenge",
        description: "Use the line as a reference and solve the puzzle: 'Indumatti Mausi makes 300 laddu a Day' ",
        correct: "left: 300px;",
        hint: "Try setting the left position to ____",
        layoutType: "absolute",
        boxStyle: "position: relative;",
        characterStyle: "position: absolute; top: 50%; left: 50px; transform: translateY(-50%);",
        itemStyle: "position: absolute; top: 50%; left: 300px; transform: translateY(-50%);"
      }
    ];

    document.getElementById("continue-button").addEventListener("click", startGame);
    document.getElementById("submit-code-button").addEventListener("click", checkAnswer);
    document.getElementById("hint-button").addEventListener("click", showHint);
    document.getElementById("next-level-button").addEventListener("click", loadNextLevel);
  } catch (error) {
    console.error("Error loading game:", error);
  }
}

function showCharacterDialog(dialogIndex) {
  const characterPopup = document.getElementById("character-popup");
  const characterSpeech = document.getElementById("character-speech");
  characterSpeech.textContent = characterDialogs[dialogIndex] || characterDialogs[0];
  characterPopup.style.display = "block";
}

function startGame() {
  document.getElementById("character-popup").style.display = "none";
  gameStarted = true;
  applyLevel(levels[currentLevel]);
  document.getElementById("problem-modal").style.display = "flex";

  const typingAudio = document.getElementById("typingAudio");
  typingAudio.currentTime = 0;
  typingAudio.play();
}

function applyLevel(level) {
  const box = document.querySelector(".box");
  const bheem = document.querySelector(".bheem");
  const ladoo = document.querySelector(".ladoo");

  box.style.cssText = "";
  bheem.style.cssText = "";
  ladoo.style.cssText = "";

  box.style.cssText = level.boxStyle;

  if (level.layoutType === "absolute") {
    bheem.classList.add("absolute-position");
    ladoo.classList.add("absolute-position");
  } else {
    bheem.classList.remove("absolute-position");
    ladoo.classList.remove("absolute-position");
  }

  bheem.style.cssText = level.characterStyle;
  ladoo.style.cssText = level.itemStyle;

  document.getElementById("level-number").textContent = level.level;
  document.getElementById("problem-title").textContent = `Level ${level.level}: ${level.title}`;
  document.getElementById("problem-description").textContent = level.description;
  document.getElementById("code-editor").value = "";
  document.getElementById("result-message").textContent = "";

  bheem.style.transition = "none";
  bheem.style.top = "";
  bheem.style.left = "";
}

function showHint() {
  const level = levels[currentLevel];
  const resultMessage = document.getElementById("result-message");
  resultMessage.textContent = `Hint: ${level.hint}`;
  resultMessage.style.color = "#4CAF50";
}

function checkAnswer() {
  const input = document.getElementById("code-editor").value.trim().replace(/\s+/g, ' ').toLowerCase();
  const level = levels[currentLevel];
  const correct = level.correct.trim().replace(/\s+/g, ' ').toLowerCase();
  const resultMessage = document.getElementById("result-message");
  const bheem = document.querySelector(".bheem");
  const ladoo = document.querySelector(".ladoo");
  const box = document.querySelector(".box");

  if (input === correct) {
    resultMessage.textContent = "✅ Correct! Bheem's getting his ladoo!";
    resultMessage.style.color = "green";

    if (level.layoutType === "flex") {
      box.style.cssText = level.boxStyle + input;
    } else if (level.layoutType === "absolute") {
      const ladooRect = ladoo.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const relativeTop = ladooRect.top - boxRect.top;
      const relativeLeft = ladooRect.left - boxRect.left;

      bheem.style.transition = "top 1s, left 1s";
      bheem.style.top = `${relativeTop}px`;
      bheem.style.left = `${relativeLeft}px`;
    }

    
    const typingAudio = document.getElementById("typingAudio");
    typingAudio.pause();
    typingAudio.currentTime = 0;

    
    const audio = document.getElementById("myAudio");
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
      document.getElementById("problem-modal").style.display = "none";
      document.getElementById("success-modal").style.display = "flex";
    }, 1500);
  } else {
    resultMessage.textContent = "❌ Try again! Bheem still needs your help!";
    resultMessage.style.color = "red";
  }
}


function loadNextLevel() {
  const audio = document.getElementById("myAudio");
  audio.pause();
  audio.currentTime = 0;

  document.getElementById("success-modal").style.display = "none";
  currentLevel++;

  const energyFill = document.getElementById("energy-fill");
  const energyPercent = document.getElementById("energy-percent");
  const totalLevels = levels.length;
  const progressPercent = Math.min((currentLevel / totalLevels) * 100, 100);

  energyFill.style.width = `${progressPercent}%`;
  energyPercent.textContent = `${Math.round(progressPercent)}%`;

  
  const red = [255, 87, 34];
  const yellow = [255, 193, 7];
  const green = [76, 175, 80];

  let r, g, b;
  if (progressPercent < 50) {
    const p = progressPercent / 50;
    r = red[0] + p * (yellow[0] - red[0]);
    g = red[1] + p * (yellow[1] - red[1]);
    b = red[2] + p * (yellow[2] - red[2]);
  } else {
    const p = (progressPercent - 50) / 50;
    r = yellow[0] + p * (green[0] - yellow[0]);
    g = yellow[1] + p * (green[1] - yellow[1]);
    b = yellow[2] + p * (green[2] - yellow[2]);
  }
  energyFill.style.backgroundColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

  if (currentLevel < levels.length) {
    showCharacterDialog(currentLevel);
    document.getElementById("continue-button").onclick = () => {
      document.getElementById("character-popup").style.display = "none";
      applyLevel(levels[currentLevel]);
      document.getElementById("problem-modal").style.display = "flex";
      
      
      document.getElementById("next-level-button").textContent = "Next Level";
    };
  } else {
    document.getElementById("character-popup").style.display = "block";
    document.getElementById("character-speech").textContent =
      "Congratulations! You've helped Bheem collect all the ladoos and restored his energy!";
    energyFill.style.width = "100%";
    energyPercent.textContent = "100%";
    energyFill.style.backgroundColor = "#4caf50";

    const victoryVideo = document.getElementById("victoryVideo");
    victoryVideo.style.display = "block";

    victoryVideo.addEventListener("ended", () => {
      victoryVideo.style.display = "none";
    });

    document.getElementById("continue-button").onclick = () => {
      
      currentLevel = 0;
      document.getElementById("character-popup").style.display = "none";
      document.querySelector(".game-container").style.display = "none";
      document.getElementById("home-screen").style.display = "flex";
      
      
      energyFill.style.width = "0%";
      energyPercent.textContent = "0%";
      energyFill.style.backgroundColor = "#ff5722";
    };
  }
}


window.addEventListener("DOMContentLoaded", () => {
  const homeScreen = document.getElementById("home-screen");
  const startButton = document.getElementById("start-button");
  const introVideo = document.getElementById("introVideo");
  const introAudio = document.getElementById("introAudio");
  const gameContainer = document.querySelector(".game-container");

  startButton.addEventListener("click", () => {
    homeScreen.style.display = "none";
    introVideo.style.display = "block";
    introVideo.currentTime = 0;
    introVideo.play();

    introAudio.currentTime = 0;
    introAudio.play();
  });

  introVideo.addEventListener("ended", () => {
    introVideo.style.display = "none";
    introAudio.pause();
    introAudio.currentTime = 0;

    gameContainer.style.display = "block";
    loadLevels();
    showCharacterDialog(0);
  });
});
