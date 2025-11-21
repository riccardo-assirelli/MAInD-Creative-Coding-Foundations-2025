// 1. Game parameters: collected here as constants to change easily the game dynamic

const boardWidth = window.innerWidth;
const boardHeight = window.innerHeight;

const birdWidth = 56;
const birdHeight = 38;

const pipeWidth = 85;
const pipeHeight = 680;

const pipeSpeedX = -6;
const gravityAmount = 0.8;
const jumpSpeed = -10;

const pipeInterval = 1000;
const pipeGapRatio = 1/4;

const scoreFont = "45px sans-serif";
const scoreX = 20;
const scoreY = 60;



// 2. Game objects 

let board = document.getElementById("board");
board.width = boardWidth;
board.height = boardHeight;

let context = board.getContext("2d");

let bird = {
  x: boardWidth / 16,
  y: boardHeight / 2,
  width: birdWidth,
  height: birdHeight
};

let birdImage = new Image();
birdImage.src = "assets/flappybird.png";

birdImage.onload = function () {
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
};

let pipeArray = [];

let topPipeImage = new Image();
let bottomPipeImage = new Image();

let speedX = pipeSpeedX;
let speedY = 0;
let gravity = gravityAmount;

let gameOver = false;
let score = 0;

let gameStarted = false;
let loopStarted = false;

// Pop-up
let pendingStyleId = "classic";

let gamePopup = document.getElementById("gamePopup");
let popupTitle = document.getElementById("popupTitle");
let popupInstruction = document.getElementById("popupInstruction");
let styleOptions = document.querySelectorAll(".style-option");



// 3. Specific-task functions 

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetGameState() {
  bird.y = boardHeight / 2;
  speedY = 0;
  pipeArray = [];
  score = 0;
  gameOver = false;
}

function endGame() {
  if (!gameOver) {
    gameOver = true;
    gameStarted = false;
    speedY = 0;
    showPopup("gameOver");
  }

}

function placePipes() {
  if (gameOver || !gameStarted) {
    return;
  }

  // random vertical position for the pipe pair
  let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardHeight * pipeGapRatio;

  let topPipe = {
    img: topPipeImage,
    x: boardWidth,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };

  let bottomPipe = {
    img: bottomPipeImage,
    x: boardWidth,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code === "Space") {

    // start from pop-up
    if (!gameStarted) {
      hidePopup();
      resetGameState();
      gameStarted = true;

      // apply chosen style for restart
      applyStyle(pendingStyleId);

      if (!loopStarted) {
        loopStarted = true;
        requestAnimationFrame(update);
      }

      speedY = jumpSpeed;
      return;
    }

    // jump during the game
    if (!gameOver) {
      speedY = jumpSpeed;
    }
  }
}



// 4. UI & graphics

function applyStyle(styleId) {
  switch (styleId) {
    case "classic":
      document.body.style.backgroundImage = 'url("assets/bg_classic.png")';
      birdImage.src = "assets/flappybird.png";
      topPipeImage.src = "assets/toppipe_classic.png";
      bottomPipeImage.src = "assets/bottompipe_classic.png";
      break;

    case "antique":
      document.body.style.backgroundImage = 'url("assets/bg_antique.png")';
      birdImage.src = "assets/flappybird.png";
      topPipeImage.src = "assets/toppipe_antique.png";
      bottomPipeImage.src = "assets/bottompipe_antique.png";
      break;

    case "futuristic":
      document.body.style.backgroundImage = 'url("assets/bg_futuristic.png")';
      birdImage.src = "assets/flappybird.png";
      topPipeImage.src = "assets/toppipe_futuristic.png";
      bottomPipeImage.src = "assets/bottompipe_futuristic.png";
      break;

    default:
      document.body.style.backgroundImage = 'url("assets/bg_initial.png")';
      birdImage.src = "assets/flappybird.png";
      topPipeImage.src = "assets/toppipe_classic.png";
      bottomPipeImage.src = "assets/bottompipe_classic.png";
      break;
  }

  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

function showPopup(mode) {
  if (mode === "start") {
    popupTitle.textContent = "START PLAYING";
  } else if (mode === "gameOver") {
    popupTitle.textContent = "GAME OVER :(";
  }

  if (popupInstruction) {
    popupInstruction.textContent = "Click Space to Play";
  }

  // clear previous visual selector
  styleOptions.forEach(function (opt) {
    opt.classList.remove("selected");
  });

  gamePopup.classList.add("visible");
}

function hidePopup() {
  gamePopup.classList.remove("visible");
}


// style selection

styleOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    styleOptions.forEach(function (opt) {
      opt.classList.remove("selected");
    });

    option.classList.add("selected");

    pendingStyleId = option.dataset.style || "classic";
  });
});

// page first load style
applyStyle("default");



// 5. Game loop 

function update() {
  requestAnimationFrame(update);

  if (!gameStarted || gameOver) {
    return;
  }

  context.clearRect(0, 0, boardWidth, boardHeight);

  speedY += gravity;
  bird.y = Math.max(bird.y + speedY, 0);

  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > boardHeight) {
    endGame();
  }

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];

    pipe.x += speedX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      endGame();
    }
  }

  context.fillStyle = "black";
  context.font = scoreFont;
  context.fillText(score, scoreX, scoreY);

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }
}


// 6. Game bootstart

setInterval(placePipes, pipeInterval);
document.addEventListener("keydown", moveBird);
showPopup("start");
