/* JS library for background LineBall game
*/
var balls;
var canvas;
var ballCanvas;
var lineDirection = "y";
var lines;



function Line(x, y) {
  this.x = x;
  this.y = y;
  this.upLimit = y;
  this.downLimit = y;
  this.direction = 'y';
  this.speed = 15;
  this.iter = 1;
  this.width = 15;
  this.height = 15;
  this.color = "#FFFFFF";
  
  this.changeDirection = function() {
    this.direction = this.direction == 'y' ? 'x' : 'y'; 
  },
  this.expand = function() {
    this.upLimit += (this.speed);
    this.downLimit -= this.speed;
  }
}


// Ball object and functions

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.speed = 3;
  this.color = getRandomColor();
  this.dx = this.speed * getRandomDirection();
  this.dy = this.speed * getRandomDirection();
  this.leftLimit = 0;
  this.rightLimit = ballCanvas.width;
  this.upperLimit = 0;
  this.lowerLimit = ballCanvas.height;
  this.radius = 10;

  this.move = function() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.dx;
    if(this.x < this.leftLimit+this.radius || this.x > this.rightLimit-this.radius) {
      this.color = getRandomColor();
      this.dx = -this.dx;
    }
    this.y += this.dy;
    if(this.y > this.lowerLimit-this.radius || this.y < this.upperLimit+this.radius) {
      this.color = getRandomColor();
      this.dy = -this.dy;
    }
  };
  this.setSpeed = function(givenSpeed) {
    this.speed = givenSpeed;
  };
  this.updateLimit = function() {
    this.rightLimit = ballCanvas.width;
    this.lowerLimit = ballCanvas.height;
  };
}

function getRandomDirection() {
  var num = Math.floor(Math.random()+.5);
  num = (num === 1 ? 1 : -1);
  console.log(num);
  return num;
}

function getRandomColor() {
  var color = "#";
  var hexCodes = "0123456789ABCDEF";
  for(var i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return color;
}

// Game functions

function initGame(canvas, ballCanvas, lineCanvas) {
    this.canvas = canvas;
    this.ballCanvas = ballCanvas;
    this.lineCanvas = lineCanvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ballCanvas.width = window.innerWidth;
    this.ballCanvas.height = window.innerHeight;
    this.lineCanvas.width = window.innerWidth;
    this.lineCanvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d");
    this.ballCtx = ballCanvas.getContext("2d");
    this.lineCtx = lineCanvas.getContext("2d");
    this.balls = [new Ball(15, 15), new Ball(this.ballCanvas.width/2, 1+10), new Ball(100, 200)];
    this.lines = [new Line(40, 40)]
}

function mainLoop() {
    setInterval(drawGame, 10);
}

function drawGame() {
    this.ctx.fillStyle = "#4b5970"
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    clearBalls();
    drawLines();
    drawBalls();
    
}

function drawBalls() {

    for (let b of balls) {
        ballCtx.beginPath();
        ballCtx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ballCtx.fillStyle = b.color;
        ballCtx.closePath();
        ballCtx.fill();
        
        b.move();
    }
}

function drawLines() {
    for(let l of lines) {
        lineCtx.beginPath();
        lineCtx.rect(l.x, l.y, l.width, l.upLimit - l.y);
        lineCtx.fillStyle = "#000000";
        lineCtx.closePath();
        lineCtx.fill();
        lineCtx.beginPath();
        lineCtx.rect(l.x, l.y, l.width, l.downLimit - l.y);
        lineCtx.fillStyle = "#000000";
        lineCtx.closePath();
        lineCtx.fill();
        
        l.expand();
    }
    lineCtx.save();
}

function clearBalls() {
    ballCtx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
    lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
}

function rightClick(ev) {
    ev.preventDefault();
    var pos = getMousePos(ev);
    ctx.beginPath();
    var l = new Line(pos.x, pos.y);
    return false;
}


function keyDownHandler(e) {
  if(e.keyCode == 39 || 37) {
    lineDirection = (lineDirection == "x" ? "y" : "x");
    console.log(lineDirection);
  }
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

function resize() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.ballCanvas.height = window.innerHeight;
    this.ballCanvas.width = window.innerWidth;
    this.lineCanvas.height = window.innerHeight;
    this.lineCanvas.width = window.innerWidth;
    this.lineCanvas.restore();
    for (let b of balls) {
        b.updateLimit();
    }
    
}


function mainLoop() {
  
}
