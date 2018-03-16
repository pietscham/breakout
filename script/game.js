/* JS library for background LineBall game
*/
var balls;
var canvas;
var ballCanvas;
var lineDirection = 'y';
var lines;
var limits;


function Line(x, y) {
  this.x = x;
  this.y = y;
  this.upLimit = y;
  this.downLimit = y;
  this.leftLimit = x;
  this.rightLimit = x;
  this.direction = lineDirection;
  this.speed = 15;
  this.iter = 1;
  this.width = 15;
  this.height = 15;
  this.color = "#333333";
  
  this.expand = function() {
    if(this.direction == 'y') {
        this.downLimit += (this.speed);
        this.upLimit -= this.speed;
    }
    else {
        this.leftLimit -= (this.speed);
        this.rightLimit += this.speed;
    }
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
  this.updateLimitResize = function(prevWidth, prevHeight) {
    if(this.rightLimit == prevWidth) {
        this.rightLimit = ballCanvas.width;
    }
    if(this.lowerLimit == prevHeight) {
        this.lowerLimit = ballCanvas.height;
    }
  };
  this.updateLimitLine = function(line) {
    if(line.direction == 'y') {
        if(this.x < line.x) {
            this.rightLimit = Math.min(line.x,this.rightLimit);
        }
        else if(this.rightLimit != line.x){
            this.leftLimit = Math.max(line.x, this.leftLimit);
        }
    }
    else {
        if(this.y < line.y) {
            this.lowerLimit = Math.max(line.y, this.lowerLimit);
        }
        else if(this.lowerLimit != line.y) {
            this.upperLimit = Math.min(line.y, this.upperLimit);
        }
    }
  }
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
    this.lines = []
    limits = []
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
        if(l.direction == 'y') {
            drawVerticalLine(l);
        }
        else {
            drawHorizontalLine(l);
        }
        l.expand();
    }
    lineCtx.save();
}

function drawVerticalLine(l) {
    if(l.upLimit >= lineCanvas.height && l.downLimit <= 0) {
        lineCtx.rect(l.x, l.y, l.width, lineCanvas.height);
    }
    else {
        for(let b of balls) {
            b.updateLimitLine(l);
        }
    }
    lineCtx.beginPath();
    lineCtx.rect(l.x, l.y, l.width, l.upLimit - l.y);
    lineCtx.fillStyle = l.color;
    lineCtx.closePath();
    lineCtx.fill();
    lineCtx.beginPath();
    lineCtx.rect(l.x, l.y, l.width, l.downLimit - l.y);
    lineCtx.fillStyle = l.color;
    lineCtx.closePath();
    lineCtx.fill();
}

function drawHorizontalLine(l) {
    if(l.leftLimit <= 0 && l.rightLimit >= lineCanvas.width) {
        lineCtx.rect(l.x, l.y, lineCanvas.width, l.height);
    }
    else {
        for(let b of balls) {
            b.updateLimitLine(l);
        }
    }
    lineCtx.beginPath();
    lineCtx.rect(l.x, l.y, l.leftLimit - l.x, l.height);
    lineCtx.fillStyle = l.color;
    lineCtx.closePath();
    lineCtx.fill();
    lineCtx.beginPath();        
    lineCtx.rect(l.x, l.y, l.rightLimit - l.x, l.height);   
    lineCtx.fillStyle = l.color;
    lineCtx.closePath();
    lineCtx.fill();
}

function clearBalls() {
    ballCtx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
}

function rightClick(ev) {
    ev.preventDefault();
    var pos = getMousePos(ev);
    ctx.beginPath();
    var l = new Line(pos.x, pos.y);
    lines.push(l);
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
    prevWidth = this.canvas.width;
    prevHeight = this.canvas.height;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.ballCanvas.height = window.innerHeight;
    this.ballCanvas.width = window.innerWidth;
    this.lineCanvas.height = window.innerHeight;
    this.lineCanvas.width = window.innerWidth;
    for (let b of balls) {
        b.updateLimitResize(prevWidth, prevHeight);
    }
    
}


function mainLoop() {
  
}
