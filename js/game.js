//Sprite Collision Detection 
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function RectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}


//Create Canvas object
function Screen(width, height) {
	// create canvas and grab 2d context
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width = width;
	this.canvas.height = this.height = height;
	this.ctx = this.canvas.getContext("2d");
	// append canvas to body of document
	document.body.appendChild(this.canvas);
};
//Clear Canvas 
Screen.prototype.clear = function() {
	this.ctx.clearRect(0, 05, this.width, this.height);
};


function drawRotatedImage(image, sx, sy, sw, sh, x, y, w, h, angle){ 
    	// save the current co-ordinate system 
    	// before we screw with it
    	ctx.save(); 
    	// move to the middle of where we want to draw our image
    	ctx.translate(x, y);
    	// rotate around that point, converting our 
    	// angle from degrees to radians 
  	  	ctx.rotate(angle);

  	  	ctx.translate(image.width/2, image.height/2 );
    	// draw it up and to the left by half the width
    	// and height of the image 
    	ctx.drawImage(image, sx, sy, sw, sh, -(image.width/2), -(image.height/2), w, h);
    	// and restore the co-ords to how they were when we began
    	ctx.restore(); 
  }


function shootBullet(){
		bullets.push(new Bullet(player.x + player.length/2, player.y + player.height/2, player.travelx, player.travely));
		energy_cells -= 1;
}


//
//Input Handler (handles inputs of keyboard keys)
//
//Create Input handler object
function InputHandler() {
	this.down = {};
	this.pressed = {};
	this.released = {};
	// capture key presses
	var _this = this;
	document.addEventListener("keydown", function(evt) {
		_this.down[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		_this.released[evt.keyCode] = true;
		delete _this.down[evt.keyCode];
		delete _this.pressed[evt.keyCode];
	});
};
//Check if key input is being held down (continuous)
InputHandler.prototype.isDown = function(code) {
	return this.down[code];
};
//Check if key input is pressed (once)
InputHandler.prototype.isPressed = function(code) {
	// if key is registered as pressed return false else if
	// key down for first time return true else return false
	if (this.pressed[code]) {
		return false;
	} else if (this.down[code]) {
		return this.pressed[code] = true;
	}
	return false;
};
//Check if key input is being held down (continuous)
InputHandler.prototype.isReleased = function(code) {
	if(this.released[code]){
		return true;
	}
};










