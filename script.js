const birdImg = new Image();
birdImg.src = 'Bird.png';

const pipeImg = new Image();
pipeImg.src = 'Pipe.png';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let birdX = 150;
let birdY = 200;
let birdVelocity = 0;
const gravity = 0.6;
const jumpStrength = -10;

let pipes = [];
const pipeWidth = 80;
const pipeGap = 200;
const pipeSpeed = 3;

let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let isGameOver = false;
let gravityTimer, pipeTimer;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(birdX, birdY, 20, 0, Math.PI * 2);
  ctx.fill();
}

function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 200)) + 50;
  const bottomY = topHeight + pipeGap;
  pipes.push({ x: canvas.width, top: topHeight, bottom: bottomY, counted: false });
}

function drawPipes() {
  ctx.fillStyle = 'green';
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  }
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.x -= pipeSpeed;

    // Score update
    if (!pipe.counted && pipe.x + pipeWidth < birdX) {
      score++;
      pipe.counted = true;
    }

    // Collision
    if (
      birdX + 20 > pipe.x &&
      birdX - 20 < pipe.x + pipeWidth &&
      (birdY - 20 < pipe.top || birdY + 20 > pipe.bottom)
    ) {
      gameOver();
    }
  }

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function applyGravity() {
  if (!isGameOver) {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY + 20 >= canvas.height || birdY - 20 <= 0) {
      gameOver();
    }
  }
}

function jump(e) {
  if (e.code === 'Space') {
    birdVelocity = jumpStrength;
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '30px Arial';
  ctx.fillText(`Score: ${score}`, 20, 50);
  ctx.fillText(`High Score: ${highScore}`, 20, 90);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  movePipes();

  if (!isGameOver) {
    requestAnimationFrame(draw);
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(pipeTimer);
  clearInterval(gravityTimer);
  document.removeEventListener('keydown', jump);

  // Update high score if needed
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('flappyHighScore', highScore);
  }

  ctx.font = '48px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);

  setTimeout(() => {
    restartGame();
  }, 1500);
}


function restartGame() {
  birdY = 200;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  isGameOver = false;

  document.addEventListener('keydown', jump);
  // For mobile/touch screens
document.addEventListener("touchstart", function () {
    if (!gameOver) {
        bird.dy = -bird.jumpStrength;
    }
});

  gravityTimer = setInterval(applyGravity, 20);
  pipeTimer = setInterval(createPipe, 1500);
  draw();
}

// Start
document.addEventListener('keydown', jump);
gravityTimer = setInterval(applyGravity, 20);
pipeTimer = setInterval(createPipe, 1500);
draw();
