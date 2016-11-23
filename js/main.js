function main(){


	$(".skill-level-container p").text(0);
	$("#skillTree").hide();
	$("#trader").hide();
	var picNo = 1;
	$(".tutorial-stage img").attr("src","images/tutorial/tut"+ picNo +".jpg");


	$(".plus-button").click(function(){
		menuAudio();
		skillLevel = $(this).parent().find(".skill-level-container p");
		currentLevel = parseInt(skillLevel.text());
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
		
		
		if(shotgunSpeed + sniperSpeed + bazookaSpeed + 1 >= 15){
			$(".ultimate-speed img").attr('src','images/oil_slick.png');
			$(".ultimate-speed").addClass("unlocked");
			gameState.ultimateSpeed = new UltimateSkillBox(680,"Oil Slick");
			player.ultimateSpeed = true;
		}
		if(shotgunPower + sniperPower + bazookaPower + 1 >= 15){
			$(".ultimate-power img").attr('src','images/coolent.png');
			$(".ultimate-power").addClass("unlocked");
			gameState.ultimatePower = new UltimateSkillBox(760,"Coolant");
			player.ultimatePower = true;
		}
		if(shotgunEffect + sniperEffect + bazookaEffect + 1 >= 15){
			$(".ultimate-effect img").attr('src','images/robesity.png')
			$(".ultimate-effect").addClass("unlocked");
			gameState.ultimateEffect = new UltimateSkillBox(840,"Robesity")
			player.ultimateEffect = true;
		}

		maxLevel = 5;
		if(robot_parts < skill_cost){
			skillMessage.text("Not enough robot parts").fadeIn().delay(1000).fadeOut();;
		}
		else if (currentLevel >= 5){
			skillMessage.text("Max Level!").fadeIn().delay(1000).fadeOut();
		}
		else{
			robot_parts -= skill_cost;
			skill_cost = Math.ceil(skill_cost * skill_cost_multiplier);
			newLevel = currentLevel + 1;
			skillLevel.text(newLevel);
		}
	});

	$("#skillTree .closeBtn").click(function(){
		$("#skillTree").hide();
		menuAudio();
		paused = false;
	});
	$("#trader .closeBtn").click(function(){
		$("#trader").hide();
		menuAudio();
		paused = false;
	});

	$(".trade-button").click(function(){
		if(robot_parts > 0){
			robot_parts -= 1;
			energy_cells += 30;
			chargeAudio();
		}
		else{
			robot_parts = robot_parts;
			energy_cells = energy_cells;
		}		
	});

	$(".restart-btn").click(function(){
		location.reload();
		menuAudio();
		$(".game-over-restart").hide();
	});

	$(".tutorial-back").click(function(){
		$(".tutorial").hide();
		menuAudio();
	});

	$(".tut-btn.next").click(function(){
		picNo ++;
		if(picNo >= 16){
			picNo = 1;
		}
		menuAudio();
		image = $(this).parent().find(".tutorial-stage img");
		image.attr("src","images/tutorial/tut"+ picNo +".jpg");
	});
	$(".tut-btn.previous").click(function(){
		picNo --;
		if(picNo <= 0){
			picNo = 15;
		}
		menuAudio();
		image = $(this).parent().find(".tutorial-stage img");
		image.attr("src","images/tutorial/tut"+ picNo +".jpg");
	});

	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	canvasLeft = ctx.canvas.offsetLeft;
    canvasTop = ctx.canvas.offsetTop;
    input = new InputHandler();

	canvas.width = 1200;
	canvas.height = 760;

	var mx;
	var my;

	ctx.canvas.addEventListener('mousemove',function(event){
		mx = event.pageX - canvasLeft;
		my = event.pageY - canvasTop;
	});
	// ctx.canvas.addEventListener('click',function(event){
	// 	shootBullet();
	// });

	robot_parts_val = document.getElementById('robot_parts');
	energy_cells_val = document.getElementById('energy_cells');

	in_skill_tree = false;
	in_battle = false;
	home = new Home();
	gameState = home;
	trader = new Trader();
	back_button = new BackButton();
	trader_page = new TraderPage();
	// prog_tree_page = new ProgressTreePage();
	prog_tree = new ProgressTree();
	frames = 0;
	robot_parts = 10;
	energy_cells = 500;
	gameOverState = false;
	
	skill_cost_multiplier = 1.2;
	skill_cost = 5;
	left_click_state = false;
	right_click_state = false;
	hold_click_state = false;
	release_click_state = false;
	hold_click_counter = 0;
	relase_value = 0;
	paused = false;

	

	prog_stages = []
	

	for (var i = 0; i < shotgun_skill.length; i++) {
		prog_stages.push(new SkillTreeStage(350,200 + 80 * i, shotgun_skill[i]));
	};
	
	for (var i = 0; i < sniper_skill.length; i++) {
		prog_stages.push(new SkillTreeStage(500,200 + 80 * i, sniper_skill[i]));
	};
	for (var i = 0; i < bazooka_skill.length; i++) {
		prog_stages.push(new SkillTreeStage(650,200 + 80 * i, bazooka_skill[i]));
	};

	player = new Player(energy_cells);

	trader_div = $('#trader');
	game_message_div = $(".game-message");
	game_message_div.hide();
	game_message = document.getElementById('game_message');
	trader_message = document.getElementById('trader_message');
	trade_button_robot = document.getElementById('trade_button_robot');
	trade_button_energy = document.getElementById('trade_button_energy');
	
	trade_button_robot.addEventListener('click',function(){
		trade_robot_val = document.getElementById('trade_robot_parts').value;
		
		if(trade_robot_val > robot_parts){
			trader_message.innerHTML = "Not enough robot parts!!"
		}
		else{
			robot_parts -= trade_robot_val;
			new_energy_cells = trade_robot_val * 30;
			energy_cells += new_energy_cells;
			trader_message.innerHTML = "You just traded " + trade_robot_val +" robot parts for "+ new_energy_cells+" energy cells!";
		}
	});
	trade_button_energy.addEventListener('click',function(){
		trade_energy_val = document.getElementById('trade_energy_cells').value;
		if(trade_energy_val > energy_cells){
			trader_message.innerHTML = "Not enough energy_cells parts!!"	
		}
		else if(trade_energy_val % 100 !== 0 ){
			trader_message.innerHTML = "Not divisible by 100!"
		}
		else{
			energy_cells -= trade_energy_val;
			new_robot_parts = trade_energy_val / 100;
			robot_parts += new_robot_parts;
			trader_message.innerHTML = "You just traded " + trade_energy_val +" energy cells for "+ new_robot_parts+" robot parts!";	
		}
	});

	ctx.canvas.addEventListener('click',function(){
		mx = event.pageX - canvasLeft;
		my = event.pageY - canvasTop;
		left_click_state = true;

		// if(mx >= prog_tree.x && mx < prog_tree.x+prog_tree.length && my >= prog_tree.y && my < prog_tree.y+prog_tree.length){
		// 	// gameState = prog_tree_page;
		// 	$("#skillTree").removeClass("display-none");
		// 	paused = !paused;
		// 	in_battle = false;
		// 	in_skill_tree = true;

		// }
		if(mx >= back_button.x && mx < back_button.x+back_button.length && my >= back_button.y && my < back_button.y+back_button.length){
			gameState = home;
			in_battle = false;
			in_skill_tree = false;
		}
	});

	//RIGHT CLICK
	ctx.canvas.addEventListener('contextmenu', function(ev) {
    	ev.preventDefault();
    	right_click_state = true;
    	return false;
	}, false);

	ctx.canvas.addEventListener('mousedown', function() {
    	hold_click_state = true;
	});

	ctx.canvas.addEventListener('mouseup', function() {
		hold_click_state = false;
		release_click_state = true;
	});
	

	function draw(){
		gameState.draw(robot_parts,energy_cells);
		update();
		window.requestAnimationFrame(draw);
	}
	function update(){
		$(".robot-parts-display p").text(robot_parts);
		$(".energy-cells-display p").text(energy_cells);
		$(".rparts").text(robot_parts);
		$(".ecells").text(energy_cells);
		$("#skillTree .skill-cost span").text(skill_cost);
		// console.log(shotgunSpeed);
		frames++;
		if(hold_click_state){
			hold_click_counter++;
			relase_value = hold_click_counter;
		}

		if(gameOverState){
			$(".game-over-restart").css({display:"block"});
		}

		else{
			hold_click_counter = 0;
		}
		if(gameState !== home){
			$(".game-stats").show();
		}
		else{
			$(".game-stats").hide();
		}

		if(gameState == trader_page){
			trader_div.removeClass('display-none');
		}
		else{
			trader_div.addClass('display-none');
		}
	
	}
	window.requestAnimationFrame(draw);
}


main();