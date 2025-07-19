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
  const topPipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
  const bottomPipeY = topPipeHeight + pipeGap;
  pipes.push({ x: canvas.width, top: topPipeHeight, bottom: bottomPipeY });
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function update() {
  birdVelocity += gravity;
  birdY += birdVelocity;

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Score update
    if (!pipe.passed && pipe.x + pipeWidth < birdX) {
      score++;
      pipe.passed = true;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
      }
    }

    // Collision
    if (
      birdX + 20 > pipe.x && birdX - 20 < pipe.x + pipeWidth &&
      (birdY - 20 < pipe.top || birdY + 20 > pipe.bottom)
    ) {
      gameOver();
    }
  });

  // Bird hits ground or flies off
  if (birdY + 20 > canvas.height || birdY - 20 < 0) {
    gameOver();
  }

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px sans-serif';
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.fillText(`High Score: ${highScore}`, 20, 70);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(gravityTimer);
  clearInterval(pipeTimer);
  ctx.fillStyle = 'red';
  ctx.font = '48px sans-serif';
  ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
}

function resetGame() {
  birdX = 150;
  birdY = 200;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  isGameOver = false;
  gravityTimer = setInterval(() => createPipe(), 1500);
  pipeTimer = setInterval(() => {}, 1000);
  requestAnimationFrame(gameLoop);
}

// Keyboard: spacebar to jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    birdVelocity = jumpStrength;
    if (isGameOver) resetGame();
  }
});

// ✅ Mobile support: tap/click to jump
canvas.addEventListener('touchstart', () => {
  birdVelocity = jumpStrength;
  if (isGameOver) resetGame();
});
canvas.addEventListener('mousedown', () => {
  birdVelocity = jumpStrength;
  if (isGameOver) resetGame();
});

resetGame();
