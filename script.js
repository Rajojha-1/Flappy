const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdImg = new Image();
birdImg.src = "Bird.png";

const pipeImg = new Image();
pipeImg.src = "Pipe.png";

const bird = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.5,
    jumpStrength: 10
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe(pipe) {
    ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
    ctx.save();
    ctx.translate(pipe.x + pipe.width / 2, pipe.top + pipe.gap);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, -pipe.width / 2, 0, pipe.width, canvas.height);
    ctx.restore();
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 30, 50);
    ctx.fillText("High Score: " + highScore, 30, 90);
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.dy = 0;
    pipes = [];
    score = 0;
    gameOver = false;
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.dy += bird.gravity;
    bird.y += bird.dy;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        return;
    }

    if (Math.random() < 0.02) {
        let gap = 200;
        let top = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, width: 60, top: top, gap: gap, passed: false });
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= 4;

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipe.gap)
        ) {
            gameOver = true;
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
        }
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    drawBird();
    pipes.forEach(drawPipe);
    drawScore();

    requestAnimationFrame(update);
}

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (gameOver) {
            resetGame();
            update();
        } else {
            bird.dy = -bird.jumpStrength;
        }
    }
});

document.addEventListener("touchstart", function () {
    if (gameOver) {
        resetGame();
        update();
    } else {
        bird.dy = -bird.jumpStrength;
    }
});

update(); 


