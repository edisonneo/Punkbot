Player = function(current_energy_cells){
	this.x = canvas.width/2
	this.y = canvas.height/2;
	this.length = 20;
	this.width = 45;
	this.height = 45;
	this.bounding_box_width = 40;
	this.bounding_box_height = 40;
	this.color = "blue";
	this.frames = 1;
	this.oilFrames = 0;
	this.skill_names = ["pistol","shotgun","sniper","bazooka"];
	this.skills = {
		shotgun:[],
		sniper:[],
		bazooka:[]
	};
	this.dead = false;

	this.image = new Image();
	this.image.src = 'images/player.png';
	this.bullet_damage = 1;	
	this.bullet_speed = 5;
	this.bullet_size = 5;
	this.energy_drain = 1;
	this.shotgun_spray = 2;
	this.bazooka_size = 10;
	this.penetration_count = 1;
	this.bazookaRange = 40;

	this.ultimateSpeed = false;
	this.ultimatePower = false;
	this.ultimateEffect = false;

	this.robesityCool = 1;
	this.coolantCool = 1;
	this.oilSlickCool = 1;

	this.overheat = 0;
	this.overheatMultiplier = 1;


	this.draw = function(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.translate(this.x + this.width/2, this.y + this.height/2);
	    ctx.rotate(this.angle);
	    ctx.fillStyle = this.color;
	    ctx.drawImage(this.image,-this.width/2,-this.height/2,this.width,this.height);
	    // ctx.translate(-this.x + this.width/2, -this.y + this.height/2);
	    ctx.restore();
	    // ctx.fillStyle = "white";
	    // ctx.font = "15px OCR";
	    // ctx.fillText(energy_cells, canvas.width - 600, canvas.height -80);
	    // ctx.fillText('Player HP:', canvas.width - 710, canvas.height -80);
		
		if(!paused){
			this.update();
		}
	}
	this.update = function(){


		skillMessage = $(".skill-message");
		shotgunSpeed = parseInt($(".shotgun-speed p").text());
		shotgunPower = parseInt($(".shotgun-power p").text());
		shotgunEffect = parseInt($(".shotgun-effect p").text());
		sniperSpeed = parseInt($(".sniper-speed p").text());
		sniperPower = parseInt($(".sniper-power p").text());
		sniperEffect = parseInt($(".sniper-effect p").text());
		bazookaSpeed = parseInt($(".bazooka-speed p").text());
		bazookaPower = parseInt($(".bazooka-power p").text());
		bazookaEffect = parseInt($(".bazooka-effect p").text());


		this.shotgun_bullet = {
				damage : this.bullet_damage + shotgunPower,
				speed : this.bullet_speed + shotgunSpeed,
				spray_size : this.shotgun_spray + shotgunEffect
		}

		this.sniper_bullet = {
				damage : this.bullet_damage/3 + sniperPower/10,
				speed : this.bullet_speed * 2 + sniperSpeed,
				penetration_count: this.penetration_count - sniperEffect/10
		}

		this.bazooka_bullet = {
				damage: this.bullet_damage * 3 + bazookaPower,
				aoeDamage : this.bullet_damage/10 + bazookaPower/8,
				speed: this.bullet_speed/ 1.5 + bazookaSpeed,
				size : this.bazooka_size,
				range: this.bazookaRange + bazookaEffect*5
		}

		

		this.initial_hit_points = energy_cells;
		this.frames++;
		this.angle = Math.atan2(my - this.y - this.height/2, mx - this.x - this.width/2 );
		this.bullet_angle = this.angle;
		this.energy_cells = energy_cells;
		this.travelx = mx - this.x;
		this.travely = my - this.y;
		// if(!in_battle){
		// 	this.overheat = 0;
		// }
		//CHECK FOR OUT OF BOUNDS
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

		//MOVE LEFT
		if (input.isDown(65)) { // A
			this.x -= this.speed;
		}
		//MOVE RIGHT
		if (input.isDown(68)) { // D
			this.x += this.speed;
		}
		//MOVE UP
		if (input.isDown(87)) { // W
			this.y -= this.speed;
		}
		//MOVE DOWN
		if (input.isDown(83)) { // S
			this.y += this.speed;
		}


		this.overheat -= 0.4 * this.overheatMultiplier;
		if (this.overheat < 0){
			this.overheat = 0;
		}

		if(this.overheat >= 250){
			this.overheat = 250;
		}

		
		if( this.overheat < 250/3){
			this.overheatMultiplier = 1;
			overheat_bar.bar_color = "yellow";
			ovhmulti.color = "yellow";
		}
		else if (this.overheat > 250/3 && this.overheat < 250/3*2){
			this.overheatMultiplier = 2;
			overheat_bar.bar_color = "orange";
			ovhmulti.color = "orange";
		}
		else if(this.overheat > 250/3*2){
			this.overheatMultiplier = 3;
			warning.draw();
			overheat_bar.bar_color = "red";
			ovhmulti.color = "red";
		}


		switch(this.skill_names[left_click_skill.toggle]){
			case "pistol":
				this.speed = 1.5;
				break;
			case "shotgun":
				this.speed = 1;
				break;
			case "sniper":
				this.speed = 0.8;
				break;
			case "bazooka":
				this.speed = 0.5;
				break;
		}

		for (var i = 0; i < bullets.enemy.length; i++) {
			b = bullets.enemy[i]
			if (AABBIntersect(this.x,this.y,this.width,this.height,b.x,b.y,b.width,b.height)){
				energy_cells -= 1;
			}
		};
		
		if (left_click_state){ 
			switch(left_click_skill.skill_name){
				case "pistol" : 
					bullets.friendly.push(new Bullet(this.x + this.width/2, this.y + this.height/2, this.bullet_angle, "friendly", this.bullet_speed, this.bullet_damage, this.bullet_size, "pistol"));
					pistolAudio();
					energy_cells -= this.energy_drain * this.overheatMultiplier;
					this.overheat += this.energy_drain/1.5 * this.overheatMultiplier * 2;
					//this.overheat += 10;
					// this.bullet_ready = false;
					left_click_state = false;
					break;
			
				case "shotgun" :
					for (var i = 0; i < this.shotgun_bullet.spray_size; i++) {
					bullets.friendly.push(new Bullet(this.x + this.width/2, this.y + this.height/2, this.bullet_angle-0.3 + 0.1 * i, "friendly", this.shotgun_bullet.speed, this.shotgun_bullet.damage, this.bullet_size,"shotgun"));
					};
					shotgunAudio();
					energy_cells -= this.energy_drain * 5 * this.overheatMultiplier;
					this.overheat += this.energy_drain/1.5 * 5 * this.overheatMultiplier * 2;
					//this.cooldown = 200;
					//this.overheat += 40;
					// this.bullet_ready = false;
					//this.cooldown_timer_state = true;
					left_click_state = false;
					break;

				case "sniper" :
					bullets.friendly.push(new Bullet(this.x + this.width/2, this.y + this.height/2, this.bullet_angle, "friendly", this.sniper_bullet.speed , this.sniper_bullet.damage, this.bullet_size, "sniper"));
					sniperAudio();
					energy_cells -= this.energy_drain * 5 * this.overheatMultiplier;
					this.overheat += this.energy_drain/1.5 * 5 * this.overheatMultiplier * 2;
					//this.cooldown = 500;
					//this.overheat += 80;
					// this.bullet_ready = false;
					//this.cooldown_timer_state = true;
					left_click_state = false;
					break;
				case "bazooka":
					bullets.friendly.push(new Bullet(this.x + this.width/2, this.y + this.height/2, this.angle, "friendly", this.bazooka_bullet.speed, this.bazooka_bullet.damage, this.bazooka_bullet.size,"bazooka"));
					//this.overheat += 100;
					bazookaAudio();
					energy_cells -= this.energy_drain * 5 * this.overheatMultiplier;
					this.overheat += this.energy_drain/1.5 * 5 * this.overheatMultiplier * 5;
					//energy_cells -= this.energy_drain*5;
					left_click_state = false;

			}
		}
		else{
			left_click_state = false;
		};

		this.robesityCool += 1/300;
		if(this.robesityCool > 1){
			this.robesityCool = 1;
		}
		this.coolantCool += 1/300;
		if(this.coolantCool > 1){
			this.coolantCool = 1;
		}
		this.oilSlickCool += 1/300;
		if(this.oilSlickCool > 1){
			this.oilSlickCool = 1;
		}



		if(right_click_state && this.ultimateEffect && this.robesityCool == 1){
			this.robesity = true;
			this.robesityCool = 0;
			right_click_state = false;
		}
		if (right_click_state && this.ultimatePower && this.coolantCool == 1){
			this.coolantActive = true;
			this.coolantCool = 0;
			right_click_state = false;
		}
		if (right_click_state && this.ultimateSpeed && this.oilSlickCool == 1){
			this.oilSlickOutput = true;
			this.oilSlickCool = 0;
			right_click_state = false;
		}

		if(this.robesity){
			this.fatFrames++;
			if(this.fatFrames < 240){
				this.width = 90;
				this.height = 90;
				this.bounding_box_width = 80;
				this.bounding_box_height = 80;
			}
			else{
				this.width = 45;
				this.height = 45;
				this.bounding_box_width = 40;
				this.bounding_box_height = 40;
				this.robesity = false;
				this.fatFrames = 0;
			}
		}

		if(this.coolantActive){
			this.coolantFrames++;
			if(this.coolantFrames < 300){
				this.overheat = 0;
				console.log("cool");
			}
			else{
				this.coolantActive = false;
				this.coolantFrames = 0;
			}
		}

		if (this.oilSlickOutput){
			this.oilFrames++;
			if(this.oilFrames < 120){
				gameState.oilSlicks.push(new OilSlick(this.x + this.width/2, this.y + this.height/2));
				
			}
			else{
				this.oilSlickOutput = false;
				this.oilFrames = 0;
			}
		}



		for (var i = 0, len = gameState.parts.length; i < len; i++) {
			p = gameState.parts[i]
			if(AABBIntersect(this.x,this.y,this.bounding_box_width,this.bounding_box_height,p.x,p.y,p.length,p.length)){
				 robot_parts += 1;
				 pickupAudio();
				 gameState.parts.splice(i,1);
				 i--;
				 len--;
			}
		};

		
		for (var i = 0, len = gameState.enemies.length; i < len; i++) {
			b = gameState.enemies[i];
			if(!this.robesity && AABBIntersect(this.x,this.y,this.bounding_box_width,this.bounding_box_height,b.x,b.y,b.width,b.height)){
				 energy_cells -= this.energy_drain;
			}
		};

		//ENERGY DRAIN EVERY SEOCOND
		if(this.frames % 60 == 0){
				energy_cells -= 1;
		}

		if(robot_parts <= 0){
			robot_parts = 0;
		}

		//LOSING CONDITION
		if (energy_cells <= 0 ){
			game_message.innerHTML = "You Die!";
			console.log("you die!");
			gameOverState = true;
			energy_cells = 0;
			robot_parts = 0;
			this.dead = true;
		}
	
	}
}
