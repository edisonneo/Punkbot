Home = function(){
	ctx.canvas.addEventListener('mousemove',function(event){
		mx = event.pageX - canvasLeft;
		my = event.pageY - canvasTop;
	});
	var level_main_id;
	// gameStats = new GameStats();
	gameTitle = new GameTitle();
	gameStart = new Level(canvas.width/2 - 100, canvas.height/2, "Start Game");
	tutorialButton = new Level(canvas.width/2 - 100, canvas.height/2 + 100, "Tutorial");
	ctx.canvas.addEventListener('click',function(){
		if(gameState == home){
			mx = event.pageX - canvasLeft;
			my = event.pageY - canvasTop;
			l = gameStart;
			t = tutorialButton;
			if(mx >= l.x && mx < l.x+l.width && my >= l.y && my < l.y+l.height){
				gameState = new EnemyLevel(1,13);
				themeAudio();
				in_battle = true;
			 	in_skill_tree = false;
			 	menuAudio();
			}
			if(mx >= t.x && mx < t.x+t.width && my >= t.y && my < t.y+t.height){
				menuAudio();
				$(".tutorial").show();
		
			}


		// for (var i = 0; i < levels.length; i++) {
		// 	l = levels[i];
			// if(mx >= l.x && mx < l.x+l.length && my >= l.y && my < l.y+l.length){	
			// 	switch(l.id){
			// 		case 1:
			// 			gameState = new EnemyLevel(1,13);
			// 			in_battle = true;
			// 			in_skill_tree = false;
			// 			break;
			// 		case 2:
			// 			gameState = new EnemyLevel(2,17);
			// 			in_battle = true;
			// 			in_skill_tree = false;
			// 			break;
			// 		case 3:
			// 			gameState = new EnemyLevel(3,22);
			// 			in_battle = true;
			// 			in_skill_tree = false;
			// 			break;
			// 		case 4:
			// 			gameState = new EnemyLevel(4,29);
			// 			in_battle = true;
			// 			in_skill_tree = false;
			// 			break;
			// 		case 5:
			// 			gameState = new EnemyLevel(5,38);
			// 			in_battle = true;
			// 			in_skill_tree = false;
			// 			break;
			// 	}  			
   //  		}
			//};
		}
	});


	// levels = []
	// for (var i = 150, j = 1; i <= 750; i += 150, j++){
	// 	levels.push(new Level(i, canvas.height/2,j));
	// }


	this.draw = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.font="20px sans-serif";
		ctx.fillStyle = "white";
		gameStart.draw();
		gameTitle.draw();
		tutorialButton.draw();
		//ctx.fillText("Home",10,50);

		// for (var i = 0; i < levels.length; i++) {
		// 	indiv_level = levels[i];
		// 	indiv_level.draw();
		// };
	}
}

LevelPage = function(level_number){
	this.level_number = level_number;
}


EnemyLevel = function(level_number, robot_parts_reward){
	this.level_number = level_number;
	this.number = 0;
	this.bg = new Image();
	this.bg.src = "https://cdn.rawgit.com/edisonneo/Punkbot/master/images/battle_screen.png"
	this.robot_parts_reward = robot_parts_reward;
	left_click_skill = new BattleSkillsLeft(canvas.width-190,canvas.height-77)
	arena = new BattleArena();
	gameOver = new GameOver();
	warning = new Warning();
	ovhmulti = new OverheatMultiplier();
	gameStats = new GameStats(300,canvas.height - 50);
	prog_tree = new ProgressTree();
	timeIndicator = new TimeIndicator();
	overheat_bar = new OverheatBar(692, canvas.height-40);
	hp_bar = new HPBar(483, canvas.height-68, energy_cells);
	lsq = new LSq();
	this.frames = 0;
	this.wave = 1;
	this.bazookaAoe = [];	
	this.enemies = [];
	this.parts = [];
	this.chill = false;
	this.oilSlicks = [];
	this.tarrows = [];
	this.swarm = true;
	this.numberOfEnemies = 0;
	this.chillFrames = 0;
	switch(this.level_number){
		//Enemy Params: Robot Part Rewards, Hit Points, Bullet Damage, Move Speed
		case 1:
			this.swarm_strength = 3
			this.swarm = true;
			this.swarm_speed = 0.5;
			this.swarm_spawn = 80;
			this.change_angle_interval = 100
			this.swarm_hit_points = 2;
			break;
		case 2:
			this.swarm_strength = 30;
			this.swarm = true;
			this.swarm_speed = 0.8;
			this.swarm_spawn = 40;
			this.change_angle_interval = 80
			this.swarm_hit_points = 4;
			break;
		case 3:
			this.swarm_strength = 50;
			this.swarm = true;
			this.swarm_speed = 1.2;
			this.swarm_spawn = 30;
			this.change_angle_interval = 60
			this.swarm_hit_points = 5;
			break;
		case 4:
			this.swarm_strength = 75;
			this.swarm = true;
			this.swarm_speed = 1.7;
			this.swarm_spawn = 20;
			this.change_angle_interval = 40
			this.swarm_hit_points = 6;
			break;
		case 5:
			this.swarm_strength = 100;
			this.swarm = true;
			this.swarm_speed = 2.3;
			this.swarm_spawn = 10;
			this.change_angle_interval = 30
			this.swarm_hit_points = 7;
			break;
	}


	bullets = { 
		enemy:[],
		friendly:[]
	};

	ctx.canvas.addEventListener('click',function(){
			mx = event.pageX - canvasLeft;
			my = event.pageY - canvasTop;
			
			if(mx >= prog_tree.x && mx < prog_tree.x+prog_tree.length && my >= prog_tree.y && my < prog_tree.y+prog_tree.length){
				// gameState = prog_tree_page;
				$("#trader").hide();
				$("#skillTree").show();
				menuAudio();
				paused = true;
				in_battle = false;
				in_skill_tree = true;

			}
			if(mx >= trader.x && mx < trader.x+trader.length && my >= trader.y && my < trader.y+trader.length){
				menuAudio();
				$("#skillTree").hide();
				// $("#trader").show();
				location.reload();
				paused = true;
				in_battle = false;
				in_skill_tree = false;
			}
			
	});


	this.draw = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(this.bg,0,0);
		trader.draw();
		prog_tree.draw();
		back_button.draw();
		ovhmulti.draw();
		player.draw();
		gameStats.draw();
		prog_tree.draw();
		overheat_bar.draw();
		hp_bar.draw();
		timeIndicator.draw();
		// lsq.draw();
		arena.draw();
		left_click_skill.draw();
		
		if (this.ultimateSpeed){
			this.ultimateSpeed.draw();
		}
		if (this.ultimatePower){
			this.ultimatePower.draw();
		}
		if (this.ultimateEffect){
			this.ultimateEffect.draw();
		}
		for (var i = 0; i < this.bazookaAoe.length; i++) {
			this.bazookaAoe[i].draw();
		};

		for (var i = 0; i < this.parts.length; i++) {
			this.parts[i].draw();
		};
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].draw();
		};
		for (var i = 0; i < bullets.enemy.length; i++) {
			bullets.enemy[i].draw();
		};
		for (var i = 0; i < bullets.friendly.length; i++) {
			bullets.friendly[i].draw();
		};
		for (var i = 0; i < this.oilSlicks.length; i++) {
			this.oilSlicks[i].draw();
		};
		for (var i = 0; i < this.tarrows.length; i++) {
			this.tarrows[i].draw();
		};
		this.update();
	}
	this.update = function(){
		this.frames++;
		this.chillFrames ++;

		console.log(this.chill);
		// if(mx < arena.x + arena.width && mx > arena.x && my < arena.y + arena.height && my > arena.y){
		// 	$("#game").css({cursor:"none"});
		// }	
		// else{
		// 	$("#game").css({cursor:"default"});
		// }


		if (player.dead){
			// gameOver.draw();
			paused = true;
		}

		if(input.isPressed(16)){
			chargeAudio();
			this.tarrows.push(new TradeArrow());
			robot_parts -= 1;
			energy_cells += 30;
		}

		if(input.isPressed(27)){
			paused = true;
			if($("#skillTree").css({display:"none"})){
				$("#trader").hide();
				$("#skillTree").show();
			}
			else if($("#skillTree").css({display:"block"})){
				$("#trader").hide();
				$("#skillTree").hide();
				console.log("asd");
			}
		}

		switch(this.wave){
			case 1:
				this.swarm_strength = 3
				this.swarm_speed = 0.5;
				this.swarm_spawn = 80;
				this.change_angle_interval = 100
				this.swarm_hit_points = 2;
				break;
			case 2:
				this.swarm_strength = 3;
				this.swarm_speed = 0.7;
				this.swarm_spawn = 70;
				this.change_angle_interval = 80
				this.swarm_hit_points = 4;
				break;
			case 3:
				this.swarm_strength = 50;
				this.swarm_speed = 0.9;
				this.swarm_spawn = 60;
				this.change_angle_interval = 60
				this.swarm_hit_points = 5;
				break;
			case 4:
				this.swarm_strength = 75;
				this.swarm_speed = 1.1;
				this.swarm_spawn = 50;
				this.change_angle_interval = 40
				this.swarm_hit_points = 6;
				break;
			case 5:
				this.swarm_strength = 100;
				this.swarm_speed = 1.3;
				this.swarm_spawn = 40;
				this.change_angle_interval = 30
				this.swarm_hit_points = 7;
				break;
		}



		if (this.frames % this.swarm_spawn == 0 && !paused && this.swarm){
			this.battle_started = true;
			randomx = getRandomArbitrary(0 + 100, canvas.width - 100);
			randomy = function(){
				re = getRandomInt(0,4)
				if (re <= 1){
					return 100
				}
				else{
					return canvas.height - 150
				}
			}
			rand = Math.random();
			switch(this.wave){
				case 1: 
					randomtype = 0;
					break;
				case 2:
					if (rand < 0.1){
						randomtype = 1;
					}
					else{
						randomtype = 0
					}
					break;
				case 3:
					if (rand < 0.5){
						randomtype = 0;
					}
					else if (rand > 0.5 && rand > 0.7){
						randomtype = 1;
					}
					else{
						randomtype = 2;
					}
					break;
				case 4:
					if (rand < 0.25){
						randomtype = 1;
					}
					else if (rand > 0.25 && rand < 0.75){
						randomtype = 2;
					}
					else{
						randomtype = 3;
					}
					break;

			}
			if(!this.chill){
				this.enemies.push(new SwarmEnemy(randomx,randomy(), randomtype, this.change_angle_interval));
				timeIndicator.x += 500/700;
				this.numberOfEnemies ++;
			}
		}


		switch(this.numberOfEnemies){
			case 50:
				this.wave = 2;
				break;
			case 100:
				this.wave = 3;
				break;
			case 200:
				this.wave = 4;
				break;
			case 300: 
				this.wave = 5;
				break;
			case 450:
				this.swarm = false;

		}

		for (var i = 0, len = this.tarrows.length; i < len; i++) {
			t = this.tarrows[i]
			if(t.remove){
				this.tarrows.splice(i,1);
				i--;
				len--;
			}
		};

		for (var i = 0, len = this.bazookaAoe.length; i < len; i++) {
			b = this.bazookaAoe[i];
			if (b.blastFinished){
				this.bazookaAoe.splice(i,1);
				i--;
				len--;
			}
		};
		for (var i = 0, len = this.enemies.length; i < len; i++) {

			if(this.enemies[i].dead){
				this.parts.push(new RobotPart(this.enemies[i].x, this.enemies[i].y));
				this.enemies.splice(i,1);
				i--;
				len--;
				if (this.frames > 500 && len <= 0){
					game_message.innerHTML = "You won!"
					game_message_div.show();
					gameOverState = true;

					$(".game-message button").click(function(){
						gameState = home;
						game_message_div.hide();
					});
				}
				continue;
			}
		};


		for (var i = 0, len = bullets.enemy.length; i < len; i++) {
			b = bullets.enemy[i]
			if(b.x < (canvas.width - arena.width)/2){
				bullets.enemy.splice(i,1);
				i--;
				len--;
				continue;
			}
			if(b.x > (canvas.width - arena.width)/2 + arena.width - b.width){
				bullets.enemy.splice(i,1);
				i--;
				len--;
				continue;
			}
			if(b.y < (canvas.height - arena.height)/2){
				bullets.enemy.splice(i,1);
				i--;
				len--;
				continue;
			}
			if (b.y > (canvas.height - arena.height)/2 + arena.height - b.height){
				bullets.enemy.splice(i,1);
				i--;
				len--;
				continue;
			}
		}

		for (var i = 0, len = this.oilSlicks.length; i < len; i++) {
			o = this.oilSlicks[i]
			if(o.remove){	
				this.oilSlicks.splice(i,1);
				i--;
				len--;
			}
		};


		for (var i = 0, len = bullets.friendly.length; i < len; i++) {
			b = bullets.friendly[i]
			// if(b.y > canvas.height || b.y < 0 || b.x > canvas.width || b.x < 0){
			// 	bullets.friendly.splice(i,1);
			// 	i--;
			// 	len--;
			// 	continue;
			// }
			if(b.remove){
				bullets.friendly.splice(i,1);
				i--;
				len--;
				continue;
			}
			if(b.x < (canvas.width - arena.width)/2){
				bullets.friendly.splice(i,1);
				i--;
				len--;
				continue;
			}
			if(b.x > (canvas.width - arena.width)/2 + arena.width - b.width){
				bullets.friendly.splice(i,1);
				i--;
				len--;
				continue;
			}
			if(b.y < (canvas.height - arena.height)/2){
				bullets.friendly.splice(i,1);
				i--;
				len--;
				continue;
			}
			if (b.y > (canvas.height - arena.height)/2 + arena.height - b.height){
				bullets.friendly.splice(i,1);
				i--;
				len--;
				continue;
			}
		}
	}
}




// ProgressTreePage = function(){
// 	gameStats = new GameStats(120,130);
// 	this.width = canvas.width * 0.8;
// 	this.height = canvas.height * 0.7;
// 	this.x = (canvas.width - this.width) / 2 ;
// 	this.y = (canvas.height - this.height) / 2;
// 	this.color = "purple";
// 	closeButton = new CloseButton(780,150);
// 	this.gun_names = ["Shotgun", "Sniper", "Bazooka"];
// 	this.upgrade_names = ["Speed", "Power", "Effect", "Ultimate"];
// 	this.effect_details = ["Increase Shotgun spray size","Increase Sniper Penetration Count","Increase Bazooka Size"]

// 	ctx.canvas.addEventListener('click',function(){
// 		mx = event.pageX - canvasLeft;
// 		my = event.pageY - canvasTop;

// 		// if(mx >= closeButton.x && mx < closeButton.x + closeButton.width && my >= closeButton.y && my < closeButton.y + closeButton.height){
// 		// 	paused = false;
// 		// }

// 		for (var i = 0; i < prog_stages.length; i++) {
// 			if(mx >= prog_stages[i].x && mx < prog_stages[i].x + prog_stages[i].width && my >= prog_stages[i].y && my < prog_stages[i].y + prog_stages[i].height){
				
// 				current_robot_parts = robot_parts;
// 				robot_parts -= skill_cost;
// 				if (robot_parts <= 0 ){
// 					game_message.innerHTML = " Not enough robot parts!!!"
// 					game_message_div.show();
// 					game_message_div.find("button").click(function(){
// 						gameState = prog_tree_page;
// 						game_message_div.hide();
// 					});
// 					console.log("not enough robot parts");
// 					robot_parts = current_robot_parts;
// 				}
// 				else if (prog_stages[i].current_level == 5){
// 					game_message.innerHTML = "Max Level!";
// 					game_message_div.show();
// 					game_message_div.find("button").click(function(){
// 						gameState = prog_tree_page;
// 						game_message_div.hide();
// 					});
// 				}
// 				else{
// 				prog_stages[i].current_level++; 
// 				game_message.innerHTML = "Spent "+ skill_cost +" robot parts on " + prog_stages[i].name + " !";
// 				console.log("Spent "+ skill_cost +" robot parts on " + prog_stages[i].skill_cat + " !");
// 				switch (prog_stages[i].tree){
// 					case "steam":
// 						player.skills.attack.push(prog_stages[i]);
// 						break;
// 					case "bot":
// 						player.skills.defense.push(prog_stages[i]);
// 						break;
// 					case "punk":
// 						player.skills.effect.push(prog_stages[i]);
// 						break;
// 				}
// 				skill_cost = Math.ceil( skill_cost * skill_cost_multiplier ); 
				
// 				}
// 			}
// 		}
// 	});


// 	this.draw = function(){
// 		//ctx.clearRect(this.x,this.y,this.width,this.height);
// 		ctx.save();
// 		ctx.fillStyle = this.color;
// 		ctx.fillRect(this.x, this.y, this.width, this.height);
// 			for (var i = 0; i < prog_stages.length; i++) {
// 				prog_stages[i].draw();
// 			};
// 			for (var i = 0; i < this.gun_names.length; i++) {
// 				ctx.font = "20px sans-serif";
// 				ctx.fillStyle = "white";
// 				ctx.fillText(this.gun_names[i], 350 + 140 * i, 150); 
// 			};
// 			for (var i = 0; i < this.upgrade_names.length; i++) {
// 				ctx.font = "20px sans-serif";
// 				ctx.fillStyle = "white";
// 				ctx.fillText(this.upgrade_names[i], 250, 225 + 80 * i); 
// 			};
// 			for (var i = 0; i < this.effect_details.length; i++) {
// 				ctx.font = "12px sans-serif";
// 				ctx.fillStyle = "white";
// 				ctx.fillText(this.effect_details[i], 300 + 200 * i, 420); 
// 			};
// 			closeButton.draw();
// 			gameStats.draw();
// 			ctx.restore();


// 		this.update();
// 	}
// 	this.update = function(){
	

		
// 	}
// }



TraderPage = function(){
	// gameStats = new GameStats();
	this.draw = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = 'white';
		ctx.font="20px sans-serif";
		gameStats.draw();
	}
}








