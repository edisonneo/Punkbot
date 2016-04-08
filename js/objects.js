


Level = function(x,y,id){
	this.x = x;
	this.y = y;
	this.state = "available";
	this.height = 50
	this.width = 200;
	this.color = '#ff0';
	this.id = id;


	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "20px OCR";
		ctx.fillRect(this.x,this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.fillText(this.id, this.x + 30, this.y + 30);
		this.update();
	}
	this.update = function(){

	}
}


HPBar = function(x, y, energy){
	this.x = x;
	this.y = y;
	this.height = 12;
	this.energy_cells = energy;
	this.image = new Image();
	this.image.src = "images/energy_bar_full.png";
	this.color = "#39FF14";
	this.divider = this.energy_cells/457;

	this.draw = function(){
		ctx.strokeStyle = "white";
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y, this.width, this.height);
		this.update();
	}
	this.update = function(){
	
		if (energy_cells < 100){
			this.color = "red";
		}
		else if (energy_cells > 100 && energy_cells < 200){
			this.color = "orange"
		}
		else{
			this.color = "#39FF14";
		}
		if(energy_cells < 457){
			this.width = energy_cells/this.divider;
		}
		else{
			ctx.drawImage(this.image, this.x-8, this.y-17, 475, 45)
			//Glowing Animation
			this.width = 457;
		}

	}
}




Enemy = function(robot_parts_reward, hit_points, bullet_damage, move_speed){
	this.x = canvas.width/2
	this.y = 200
	this.length = 20;
	this.width = 50;
	this.height = 50;
	this.bounding_box_width = 40;
	this.bounding_box_height = 45;
	this.color = "#f00";
	this.frames = 1;
	this.image = new Image();
	this.image.src = "enemy1.png";
	this.move_speed = move_speed;
	this.bullet_damage = bullet_damage;
	this.bullet_size = 5;
	this.bullet_speed = 5;
	this.follow = true;
	this.initial_hit_points = hit_points;
	this.updateable_hit_points = this.initial_hit_points;
	this.robot_parts_reward = robot_parts_reward;
	this.randx = 0;
	this.randy = 1
	

	this.draw = function(){
		ctx.save();
		ctx.fillStyle = this.color;
		// drawSprite(this.player_sprite,this.x,this.y);
		// ctx.drawImage(this.image,0,400,110,100,this.x,this.y,100/2,100/2);
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
	    ctx.rotate(this.angle);
	    ctx.drawImage(this.image,-this.width/2,-this.height/2,this.width,this.height);
	    // ctx.translate(-this.x + this.width/2, -this.y + this.height/2);
	    ctx.fillRect(0,0,10,10);
	    ctx.restore();
	    ctx.fillStyle = "white";
	    ctx.font ='20px OCR';
	    ctx.fillText(this.updateable_hit_points, 120, 20);
	    ctx.fillText('Enemy HP:', 10, 20);
		// hp_bar = new HPBar(10, 30, this.initial_hit_points, this.updateable_hit_points);
		// hp_bar.draw();
		this.update();
	}
	this.update = function(){
	
		this.angle = Math.atan2(player.y - player.height/2 - this.y + this.height/2, player.x -player.width/2 - this.x + this.width/2 );
		this.travelx = player.x - this.x;
		this.travely = player.y - this.y;


		this.frames++;
		
		
		if (this.follow){
			this.x += this.travelx/this.move_speed;
			this.y += this.travely/this.move_speed;
		}

		if (this.frames % 200 == 0){
			this.randx = getRandomInt(-this.travelx/this.move_speed,this.travelx/this.move_speed);
			this.randy = getRandomInt(-this.travelx/this.move_speed,this.travelx/this.move_speed);
		}

		if (this.frames % 200 <= 50){
			this.follow = false;
			this.x += this.randx
			this.y += this.randy
		}
		else{
			this.follow = true;
		}

		if(this.frames % 110 == 0){
			bullets.enemy.push(new Bullet(this.x + this.width/2, this.y + this.height/2 , this.angle , "enemy", 10, this.bullet_damage, this.bullet_speed, this.bullet_size));
			this.updateable_hit_points -= 2;
		} 

		for (var i = 0, len = bullets.friendly.length ; i < len; i++) {
			b = bullets.friendly[i];
			if(AABBIntersect(this.x,this.y,this.bounding_box_width,this.bounding_box_height,b.x,b.y,b.width,b.height)  && b.type == "friendly"){
				 before_hit_points = this.updateable_hit_points;
				 this.updateable_hit_points -= b.bullet_damage;
				 after_hit_points = this.updateable_hit_points;
				 bullets.friendly.splice(i,1);
				 i--;
				 len--;

			}
		};

		if(this.updateable_hit_points <= 0){
			gameState = home;
			robot_parts += robot_parts_reward;
			game_message.innerHTML = "You won and got "+ robot_parts_reward+" robot parts!!";
		} 


	}
}


SwarmEnemy = function(x,y,type,change_angle){
	this.x = x;
	this.y = y;
	this.length = 20;
	this.width = 40;
	this.height = 40;
	this.type = type;
	this.bounding_box_width = 32;
	this.bounding_box_height = 32;
	this.color = "#f00";
	this.frames = 1;
	this.oilFrames = 0;
	this.dead = false;
	this.freeze = false;
	this.image = new Image();
	this.change_angle_interval = change_angle;
	this.random_frame = getRandomInt(this.change_angle_interval - 20, this.change_angle_interval + 20);
	this.random_pos = getRandomInt(-50,50);
	this.angle = Math.atan2(player.y - player.height/2 - this.y + this.height/2, player.x -player.width/2 - this.x + this.width/2 );
	this.frames = 0;
	this.shoot = false;
	this.suicide = false;

	//Type 1 = Pawn (Move Normal)
	//Type 2 = Shooter (Move Slow, Shoot Occasionally Spawn less)
	//Type 3 = Tanker (Move Slow, High HP)
	//Type 4 = Unstable (Move Burst of Pace, High damage on contact)

	switch (this.type){
		case 0:
			this.hit_points = 3;
			this.image.src = "images/enemy1.png";
			this.move_speed = 0.6;
			break;
		case 1:
			this.hit_points = 7;
			this.shoot = true;
			this.image.src = "images/enemy2.png";
			this.move_speed = 0.4;
			break;
		case 2: 
			this.hit_points = 22;
			this.image.src = "images/enemy3.png";
			this.move_speed = 0.2;
			break;
		case 3: 
			this.suicide = true;
			this.hit_points = 5;
			this.image.src = "images/enemy4.png";
			this.move_speed = 3.0;
	}


	this.draw = function(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
	    ctx.rotate(this.angle);
	    ctx.drawImage(this.image,-this.width/2,-this.height/2,this.width,this.height);
	    //ctx.fillRect(0,0,10,10);
	    ctx.restore();
	    if (!paused){
			this.update();
		}
	}
	this.update = function(){
		
		// this.travelx = player.x + this.random_pos - this.x;
		// this.travely = player.y + this.random_pos - this.y;

		this.vely = this.move_speed*Math.sin(this.angle);
		this.velx = this.move_speed*Math.cos(this.angle);


		this.frames++;

		// this.x += this.travelx/this.move_speed ;
		// this.y += this.travely/this.move_speed ;

		if(this.shoot){
			if(this.frames % 240 == 0){
				bullets.enemy.push(new Bullet(this.x + this.width/2 ,this.y + this.height/2,this.angle,"enemy", 2, 1, 5, "enemy"))
			}
		}


		if(!this.freeze && !this.suicide){
			this.x += this.velx;
			this.y += this.vely;
			if (frames % this.random_frame == 0){
				this.angle = Math.atan2(player.y - player.height/2 - this.y + this.height/2, player.x -player.width/2 - this.x + this.width/2 );
			}
		}

		if(!this.freeze && this.suicide){
			if(this.frames % 480 < 120){
				this.x += this.velx;
				this.y += this.vely;
			}
			else{
				this.x += 0;
				this.y += 0;
			}
			if (frames % this.random_frame == 0){
				this.angle = Math.atan2(player.y - player.height/2 - this.y + this.height/2, player.x -player.width/2 - this.x + this.width/2 );
			}
		}

		if(this.x < (canvas.width - arena.width)/2){
			this.x = (canvas.width - arena.width)/2;
		}
		if(this.x > (canvas.width - arena.width)/2 + arena.width - this.width){
			this.x = (canvas.width - arena.width)/2 + arena.width - this.width;
		}
		if(this.y < (canvas.height - arena.height)/2){
			this.y = (canvas.height - arena.height)/2;
		}
		if (this.y > (canvas.height - arena.height)/2 + arena.height - this.height){
			this.y = (canvas.height - arena.height)/2 + arena.height - this.height;
		}

		if(player.robesity && AABBIntersect(this.x,this.y,this.width,this.height,player.x,player.y,player.width,player.height)){
			this.hit_points -= 100;
		}

		if(this.suicide && AABBIntersect(this.x,this.y,this.width,this.height,player.x,player.y,player.width,player.height)){
			this.dead = true;
			energy_cells -= 50;
		}
		for (var i = 0, len = bullets.friendly.length ; i < len; i++) {
			b = bullets.friendly[i];
			if(AABBIntersect(this.x,this.y,this.bounding_box_width,this.bounding_box_height,b.x,b.y,b.width,b.height)  && b.type == "friendly"){
				hitAudio();
				switch(b.bullet_skill){
					case "sniper":
						//damage_differential = b.bullet_damage - this.hit_points;
						this.hit_points -= b.bullet_damage;
						if(b.width > 0){
							b.width -= player.sniper_bullet.penetration_count;
						}
						else {
							b.remove = true;
						
						}

							// bullets.friendly.splice(i,1);
				 		// 	i--;
				 		// 	len--;
						// console.log(b.bullet_damage);
		
				
						break;
					case "bazooka":
						gameState.bazookaAoe.push(new BazookaAoe(this.x + this.width/2, this.y + this.height/2, player.bazooka_bullet.range));
					// case "bazooka":
					// 	this.hit_points--;
					// 	bullets.friendly.splice(i,1);
				 // 		i--;
				 // 		len--;
					// 	for (var i = 0; i < 10; i++) {
					// 		bullets.friendly.push(new Bullet(b.x, b.y, b.angle-0.3 + 0.1 * i, "friendly",b.speed, b.damage, b.width,"bazooka_burst"));
					// 		console.log("po");
					// 	};
					default:
						bullets.friendly.splice(i,1);
				 		i--;
				 		len--;
						this.hit_points -= b.bullet_damage;
				}
			}
		};

		for (var i = 0; i < gameState.bazookaAoe.length; i++) {
			g = gameState.bazookaAoe[i];
			if (RectCircleColliding(g,this)){
				this.hit_points -= player.bazooka_bullet.aoeDamage;
			}
		};

		for (var i = 0; i < gameState.oilSlicks.length; i++) {
			o = gameState.oilSlicks[i];
			if(RectCircleColliding(o,this)){
				this.freeze = true;
			}
		};

		if(this.frames % 360 == 0){
			if(this.freeze){
				this.freeze = false;
			}
		}


		if (this.hit_points <= 0){
			this.dead = true;			
		}
	}

}

RobotPart = function(x,y){
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = "images/robotpart.png"
	this.length = 30;
	this.color = "yellow";
	this.draw = function(){
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x,this.y,this.length, this.length);
		ctx.drawImage(this.image, this.x + this.length/2 , this.y + this.length/2, this.length, this.length )
	}
	this.update = function(){
	}
}

Bullet = function(x,y,angle,type, bullet_speed, bullet_damage, bullet_size, bullet_skill){
	this.x = x;
	this.y = y;
	this.bullet_skill = bullet_skill;
	this.type = type;
	this.width = bullet_size;
	this.angle = angle;
	this.realAngle = Math.atan2(my - this.y + this.height/2, mx - this.x + this.width/2 );
	this.image = new Image();
	this.sniperPenetration = 1;
	this.frames = 0;
	this.remove = false;
	switch(this.bullet_skill){
		case "pistol":
			this.image.src = "images/bullet-g.png"
			break;
		case "shotgun":
			this.image.src = "images/bullet-g.png"
			break;
		case "sniper":
			this.image.src = "images/bullet-b.png"
			break;
		case "bazooka":
			this.image.src = "images/bullet-p.png"
			break;
		case "enemy":
			this.image.src = "images/bullet-g.png"
			break;
	}
	this.height = bullet_size;
	this.bullet_speed = bullet_speed;
	this.bullet_damage = bullet_damage;
	if (this.type == "enemy"){
		this.color = "red";
	}else if(this.type = "friendly"){
		this.color = "blue";
	}
	this.vely = this.bullet_speed*Math.sin(angle);
	this.velx = this.bullet_speed*Math.cos(angle);
	this.draw = function(){
		// ctx.fillStyle = this.color;
		// ctx.drawImage(this.image,this.x- 20,this.y - 20);
		//ctx.fillRect(this.x, this.y, this.height, this.width);
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
	    ctx.rotate(this.angle);
	    ctx.drawImage(this.image,-this.width/2,-this.height/2 - 10,this.width*6,this.height*6);
	    // ctx.fillRect(0,0,10,10);
	    ctx.restore();

	    if(!paused){
	    	this.update();
	    }

	}
	this.update =function(){
		this.frames++;
		
		if (this.bullet_skill !== "pistol" && this.frames >= 30){
			this.remove = true;
		}
		this.y += this.vely;
		this.x += this.velx;



	}

}




Trader = function(){
	this.x = 95;
	this.y = 27;
	this.length = 40;
	this.width = 70;
	this.height = 35;
	this.image = new Image();
	this.image.src = "images/reload_button.png";
	this.name = "Trader";
	this.color = "green";
	this.draw = function(){
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.length, this.length);
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.font = "12px OCR";
		// ctx.fillText(this.name, this.x + 2, this.y + this.length + 15);
		this.update();
	}
	this.update = function(){

	}
}




ProgressTreeStage = function(x,y,skill,skill_cat){
	this.x = x;
	this.y = y;
	this.status = "unavailable";
	this.id = skill.id;
	this.name = skill.name;
	this.tier = skill.tier;
	this.control = skill.control;
	this.skill_cat;
	this.width = 100;
	this.height = 50;
	this.color = "#333333";
	this.draw = function(){
		if(this.status == "bought"){
			ctx.fillStyle = "skyblue";
		}
		else{
			ctx.fillStyle = this.color;
		}
		ctx.fillRect(this.x,this.y,this.width, this.height);
		ctx.fillStyle = "black";
		ctx.font = "12px OCR"
		ctx.fillText(this.name, this.x + 10, this.y + 30 );
		this.update();
	}

	this.update = function(){
		if(this.tier !== "basic" && this.status !== "bought"){
			ctx.fillText(skill_cost, this.x + 10, this.y + 45 );
		}
		if(this.tier == "basic"){
			this.status = "bought";
		}else if (this.tier == 1 && this.status == "unavailable"){
			this.status = "available";
			this.color = "white";
		}
	}
}



ProgressTree = function(){
	this.x = canvas.width - 170;
	this.y = 27;
	this.length = 40;
	this.height = 35;
	this.width = 70;
	this.image = new Image();
	this.image.src = "images/tool_button.png";
	this.name = "Skill Tree"
	this.color = "purple";
	this.draw = function(){
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.length, this.length);
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		ctx.font = "12px OCR";
		ctx.fillStyle = "white";
		// ctx.fillText(this.name, this.x - 5 , this.y + this.length + 15);
		this.update();
	}
	this.update = function(){

	}
}


BackButton = function(){
	this.x = canvas.width - 100;
	this.y = 25;
	this.length = 40;
	this.name = "Home"
	this.color = "pink";
	this.draw = function(){
		// ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.length, this.length);
		// ctx.font = "12px OCR";
		// ctx.fillStyle = "white";
		// ctx.fillText(this.name, this.x + 2, this.y + this.length + 15);
		this.update();
	}
	this.update = function(){

	}
}


BattleArena = function(){
	this.width = canvas.width/1.2;
	this.height = canvas.height/1.4;
	this.x = (canvas.width - this.width)/2;
	this.y = (canvas.height - this.height)/2;
	this.color = "white";
	this.draw = function(){
		ctx.fillStyle = this.color;
		// ctx.lineWidth = 5;
		// ctx.strokeRect(this.x, this.y, this.width, this.height);
		this.update();
	}
	this.update = function(){

	}
}

BattleSkillsLeft =  function(x,y){
	this.x = x;
	this.y = y;
	this.skills = player.skill_names;
	this.length = 70;
	this.color = "white";
	this.toggle = 0;
	this.image = new Image();
	this.draw = function (){
		ctx.fillStyle = this.color;
		ctx.font = "15px OCR";
		ctx.drawImage(this.image, this.x, this.y, this.length + 50, this.length/1.5);
		ctx.fillStyle = "white"
		ctx.fillText(player.skill_names[this.toggle], this.x + 35 , this.y - 10 );

		this.update();
	}
	this.update = function(){
		switch(this.toggle){
			case 0:
				this.image.src = "images/pistol.png"
				break;
			case 1:
				this.image.src = "images/shotgun.png"
				break;
			case 2:
				this.image.src = "images/snipe.png";
				break;
			case 3: 
				this.image.src = "images/bazooka.png";
				break;
		}
		this.skill_name = player.skill_names[this.toggle];

		if (input.isPressed(32)){
			weaponSwitchAudio();
			this.toggle ++;
		}
		if (this.toggle >= this.skills.length){
			this.toggle = 0;
		}

		if (input.isPressed(49)){
			weaponSwitchAudio();
			this.toggle = 0;
		}
		if (input.isPressed(50)){
			weaponSwitchAudio();
			this.toggle = 1;
		}
		if (input.isPressed(51)){
			weaponSwitchAudio();
			this.toggle = 2;
		}
		if (input.isPressed(52)){
			weaponSwitchAudio();
			this.toggle = 3;
		}
	}
}

GameStats = function(x,y){
	this.x = x;
	this.y = y;
	this.color = "white";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "18px OCR";
		ctx.fillText("Robot Parts", this.x - 230, this.y - 30);
		ctx.fillText("Energy Cells", this.x, this.y - 30);

		this.update();
	}
	this.update = function(){
		// ctx.fillText(robot_parts, this.x - 200, this.y+6);
		// ctx.fillText(energy_cells,this.x + 45, this.y+6);
	}
}




OverheatBar = function(x,y){
	this.x = x;
	this.y = y;
	this.bar_color = "red";
	this.image = new Image();
	this.image.src = "images/overheat_bar_full.png"
	this.bar_outline = "white";
	this.height = 12;
	this.draw = function(){
		ctx.fillStyle = this.bar_color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		// ctx.strokeStyle = this.bar_outline;
		// ctx.lineWidth = 2;
		// ctx.strokeRect(this.x, this.y, 250, this.height);
		if(!paused){
			this.update();
		}
	}
	this.update = function(){
		this.width = player.overheat;
		if(this.width >= 250){
			// ctx.drawImage(this.image, this.x, this.y);
		}
	}
}

SkillTreeStage = function(x,y,skill){
	this.x = x;
	this.y = y;
	this.height = 40; 
	this.width = 70;
	this.skill_name = skill.skill_name;
	this.skill_cat = skill.category;
	this.current_level = skill.current_level;
	this.max_level = 5;
	this.color = "white";
	this.text_color = "black";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.text_color;
		ctx.fillText(this.current_level + "/" + this.max_level, this.x + 10, this.y + 20 );
		ctx.fillStyle = this.color;
		ctx.fillText(skill_cost, this.x + this.width + 10, this.y + 20);
		this.update();
	}
	this.update = function(){

	}
}

PauseButton = function(){
	this.x = canvas.width - 60;
	this.y = canvas.height - 60;
	this.length = 30;
	this.color = "red";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.length, this.length)
		this.update();
	}
	this.update = function(){

	}
}

CloseButton = function(x,y){
	this.x = x;
	this.y = y;
	this.color = "white";
	this.width = 100;
	this.height = 40;
	this.wordColor = "purple";


	this.draw = function(){
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = "red";
		ctx.font = "15px OCR";
		ctx.fillText("Close", this.x + 10, this.y + 20);
	}	
	this.update = function(){

	}
}

BazookaAoe = function(x,y,range){
	this.x = x;
	this.y = y;
	this.radius = 5;
	this.color = "#D15FEE";
	this.maxRadius = range;
	this.frames = 0;
	this.height = 100;
	this.width = 100;
	this.image = new Image();
	this.image.src = "images/bazookaAOE.png";
	this.blastFinished = false;
	this.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = 0.8;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      	ctx.fillStyle = this.color;
      	ctx.fill();
      	ctx.drawImage(this.image, this.x - this.width/2 , this.y - this.height/2, this.width, this.height);
     	ctx.closePath();
      	ctx.restore();
      	this.update();
	}
	this.update = function(){
		this.frames ++;
		// if (this.frames >= 50){
		// 	this.blastFinished = true;
		// }

		if (this.radius >= this.maxRadius){
			this.blastMax = true;
		}

		if (!this.blastMax){
			this.radius += 3;
			this.height += 3;
			this.width += 3;
		}

		if(this.blastMax){
			this.radius -= 3;
			this.height -=3;
			this.width -= 3;
			if (this.radius <= 0){
				this.radius = 0;
				this.blastFinished = true;
			}

		}
	}
}


GameTitle = function(){
	this.x = canvas.width/2 - 160;
	this.y = 240;
	this.color = "white";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "70px OCR";
		ctx.fillText("PUNKBOT", this.x , this.y);
		this.update();
	}
	this.update = function(){

	}
}


GameOver = function(){
	this.x = canvas.width/2 - 250;
	this.y = 400;
	this.color = "white";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "70px OCR";
		ctx.fillText("Game Over!", this.x , this.y);
		this.update();
	}
	this.update = function(){

	}
}

Warning = function(){
	this.x = canvas.width/2 - 200;
	this.y = 400;
	this.color = "red";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "40px OCR";
		ctx.fillText("Overheating!!!", this.x , this.y);
		this.update();
	}
	this.update = function(){
		// if (gameState.frames % 3 == 0){
		// 	ctx.globalAlpha = 0
		// }
		// else{
		// 	ctx.globalAlpha = 1;
		// }
	}
}


OverheatMultiplier = function(){
	this.x = 540
	this.y = canvas.height - 25;
	this.color = "yellow";
	this.draw = function(){
		ctx.fillStyle = this.color;
		ctx.font = "18px OCR";
		this.update();
	}
	this.update = function(){
		ctx.fillText(player.overheatMultiplier+"x", this.x , this.y);
	}
}

OilSlick = function(x,y){
	this.x = x;
	this.y = y;
	this.radius = 7;
	this.frames = 0;
	this.remove = false;
	this.color ="brown";
	this.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = 0.9;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      	ctx.fillStyle = this.color;
      	ctx.fill();
     	ctx.closePath();
      	ctx.restore();
		this.update();
	}
	this.update = function(){
		this.frames++;
		if(this.frames == 240){
			this.remove = true;
		}
	}
}

UltimateSkillBox =  function(x,ultimate){
	this.x = x;
	this.y = 15;
	this.ultimate = ultimate
	this.length = 70;
	this.color = "white";
	this.draw = function (){
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.length, this.length);
		ctx.font = "15px sans-serif";
		ctx.fillStyle = "black"
		ctx.fillText(this.ultimate, this.x + 5 , this.y + 25);
		ctx.restore();

		this.update();
	}
	this.update = function(){
		switch(this.ultimate){
			case "Oil Slick":
				this.opacity = player.oilSlickCool;
				break;
			case "Coolant":
				this.opacity = player.coolantCool;
				break;
			case "Robesity":
				this.opacity = player.robesityCool;
		}
	}
}


TradeArrow = function(){
	this.x = 195;
	this.y = canvas.height - 60;
	this.image = new Image();
	this.remove = false;
	this.image.src = "images/trade_button.png";
	this.frames = 0;
	this.draw = function(){
		ctx.drawImage(this.image, this.x, this.y);
		this.update();
	}
	this.update = function(){
		this.frames++;
		if(this.frames > 120){
			this.remove = true;
		}
	}
}

TimeIndicator = function(){
	this.x = 200;
	this.y = 18;
	this.width = 70;
	this.height = 70;
	this.image = new Image();
	this.image.src = "images/time_indicator.png";
	this.draw = function(){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
		this.update();
	}
	this.update = function(){

	}
}


LSq = function(){

	this.height = 40;
	this.width = 40;
	this.image = new Image();
	this.image.src = "images/target.png"
	this.color = "red";
	this.draw = function(){
		ctx.fillStyle = this.color;
		// ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(this.image,this.x,this.y, this.height,this.width);
		this.update();
	}
	this.update = function(){
			this.x = mx;
			this.y = my;
	}
}
