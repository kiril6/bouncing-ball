/**************************
 * @author Kiril Delovski *
 * @date 24-10-19         *
 *************************/

 /* Alowing animation to work */
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame   || 
    window.mozRequestAnimationFrame      || 
    window.oRequestAnimationFrame        || 
    window.msRequestAnimationFrame       || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
 })();

/* Adding the background */
function addBackground() {
    background = new Image();
    background.src = './bck.jpg';
    background.onload = function(){
        ctx.drawImage(background, 0, 0);
    }
}
(function(){
    addBackground();
})();

/* Object bouncingBall */
const bouncingBall = function () { 
	this.canvas = canvas;
	this.ctx = ctx;
    this.size = 30;
    this.position = [100, 0];
	this.gravityMass = 13;
	this.velocity = [6, 0];
	this.bounceLevel = 0.8;
    this.friction = 0.5;
    this.color = '#ff9933';
	this.stop = false;
	this.stopTimes = 0;
	this.stopLimit = 10;
    this.id = ++this.constructor.prototype.ID;
	
	const ball = this;
	this.start = function () {
		ball.fall();
		ball.draw();		
		if (!ball.stop)
			window.requestAnimFrame(ball.start);
	};
};

/* The instance number */
bouncingBall.prototype.ID = 0;

/* Draw the ball on the canvas */
bouncingBall.prototype.draw = function () {
    addBackground();
	this.ctx.beginPath();
	this.ctx.fillStyle = this.color;
	this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
	this.ctx.moveTo(this.position[0] + this.size, this.position[1]);
	this.ctx.arc(this.position[0], this.position[1], this.size, 0, Math.PI * 2, true);
	this.ctx.fill();
	this.ctx.stroke();
    this.ctx.closePath();
};

/* Calculates the ball position */
bouncingBall.prototype.fall = function () {
	if (parseInt(this.velocity[1]) === 0 &&
		  parseInt(this.velocity[0]) === 0) {
		this.stopTimes += 1;
	} else {
		this.stopTimes = 0;
	}
	
	if (this.stopTimes < this.stopLimit) {
		this.velocity[1] += this.gravityMass / 10;
		this.position[0] += this.velocity[0];
		this.position[1] += this.velocity[1];
			
		if (this.position[1] > this.canvas.height - this.size) {
			this.position[1] = this.canvas.height - this.size;
			this.velocity[1] = this.velocity[1] * (-1) * this.bounceLevel;
			this.velocity[0] /= this.friction;
		}
		
		if (this.position[0] <= 0 + this.size) {
			this.position[0] = this.size;
			this.velocity[0] *= (-1);
		} else if (this.position[0] >= this.canvas.width - this.size) {
			this.position[0] = this.canvas.width - this.size;
			this.velocity[0] *= (-1);
		}
	}
};

/* Stops the animation */
bouncingBall.prototype.finish = function () {
	this.stop = true;
};

let canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		p = {};

/* Get canvas and settting size to window size */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Add a new ball object */
function addBall (e) {
    if(bouncingBall.prototype.ID === 0) {
        p = new bouncingBall();
        bouncingBall.prototype.ID = 1;
        if (e) {
            p.position = [e.clientX, e.clientY];
        }
        p.velocity = [
            Math.random() * 20 - 10,
            Math.random() * 5 - 2.5
        ];
        p.bounceLevel = Math.random() * 0.1 + 0.9;
        p.friction = Math.random() * 0.05 + 1;	
        p.start();
    } else if(bouncingBall.prototype.ID === 1) {
        /* if ball is already drawn remove it,
         same as the removeBall() function on button
         */
        removeBall();
    }
}
/* Adding the ball on click */
canvas.onclick = addBall;

/* Delete the ball, clear the canvas, add the background */
function removeBall () {
    p.finish();
    delete p;
    bouncingBall.prototype.ID = 0;
	setTimeout(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        addBackground();
    }, 100);
}
