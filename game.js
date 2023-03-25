const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "bg.png";

class Paddle {
    constructor(x, y, isPlayer) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.isPlayer = isPlayer;
      this.speed = isPlayer ? 5 : 3;
      this.image = new Image();
      this.image.src = isPlayer ? "cat.png" : "opponent.png";
      this.pawImage = new Image();
      this.pawImage.src = "paw.png";
      this.showPaw = false;
   }

   draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    if (this.showPaw) {
      ctx.drawImage(this.pawImage, this.x + this.width, this.y + this.height / 2 - 25, 50, 50);
      this.showPaw = false;
    }
  }

  move(dy) {
    if (this.y + dy >= 0 && this.y + dy <= canvas.height - this.height) {
      this.y += dy;
    }
  }
}

class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 10;
      this.dx = 3;
      this.dy = 3;
      this.image = new Image();
      this.image.src = "ball.png";
    }
  
    draw() {
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }

const player = new Paddle(30, canvas.height / 2 - 50, true);
const opponent = new Paddle(canvas.width - 50, canvas.height / 2 - 50, false);
const ball = new Ball(canvas.width / 2, canvas.height / 2);
let playerScore = 0;
let opponentScore = 0;

let keysPressed = {};

document.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
});

function update() {
    const playerSpeed = player.speed;
  
    if (keysPressed['ArrowUp'] && player.y > 0) {
      player.y -= playerSpeed;
    }
    if (keysPressed['ArrowDown'] && player.y < canvas.height - player.height) {
      player.y += playerSpeed;
    }
    if (keysPressed['ArrowLeft'] && player.x > 0) {
      player.x -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] && player.x < canvas.width / 2 - player.width) {
      player.x += playerSpeed;
    }

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Move the opponent paddle
  if (ball.dy > 0) {
    opponent.move(opponent.speed);
  } else {
    opponent.move(-opponent.speed);
  }

  // Ball collision with top and bottom
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Ball collision with left and right (scoring)
  if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetBall();
  } else if (ball.x - ball.radius < 0) {
    opponentScore++;
    resetBall();
  }

  // Ball collision with paddles
  if (
    (ball.x - ball.radius < player.x + player.width &&
      ball.x + ball.radius > player.x &&
      ball.y - ball.radius < player.y + player.height &&
      ball.y + ball.radius > player.y) ||
    (ball.x - ball.radius < opponent.x + opponent.width &&
      ball.x + ball.radius > opponent.x &&
      ball.y - ball.radius < opponent.y + opponent.height &&
      ball.y + ball.radius > opponent.y)
  ) {
    ball.dx = -ball.dx;

    if (player.isPlayer) {
      player.showPaw = true;
    }
  }
}
      
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw middle dashed line
      ctx.beginPath();
      ctx.setLineDash([10, 5]);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();
      
    // Draw scores
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillText(playerScore, canvas.width / 2 - 50, 30);
    ctx.fillText(opponentScore, canvas.width / 2 + 50, 30);
      
      player.draw();
      opponent.draw();
      ball.draw();
      }
      
      function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = -ball.dx;
      ball.dy = (Math.random() * 6) - 3; // Random direction between -3 and 3
      }
      
      function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
      }
      
      player.image.addEventListener('load', () => {
      opponent.image.addEventListener('load', gameLoop);
      });