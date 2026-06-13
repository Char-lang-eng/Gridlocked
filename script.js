class Tile{
    constructor(type) {
        if(type === 'lava'){
            this.x = floor(random(3, 7));
            this.y = floor(random(3, 7));
        }
        else if(type === 'pusher'){
            this.x = player.x;
            this.y = player.y;
        }
        else{
            this.x = floor(random(1, 9));
            this.y = floor(random(1, 9));
        }
        
        this.type = type;
        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].x === this.x && tiles[i].y === this.y){
                i = -1;
                this.x = floor(random(1, 9));
                this.y = floor(random(1, 9));
            }
        }
    }
    draw(){
        if(this.type === 'mud'){
            image(images[3], this.x*40, this.y*40, 40, 40);
        }
        if(this.type === 'lava'){
			image(images[0], this.x*40, this.y*40, 40, 40);
        }
        if(this.type === 'magic'){
            image(images[2], this.x*40, this.y*40, 40, 40);
        }
        if(this.type === 'pusher'){
            image(images[1], this.x*40, this.y*40, 40, 40);
        }
    }
}
class Car{
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.sx = x;
        this.sy = y;
        this.direction = direction;
        this.stuck = false;
        this.patience = 10;
		if (this.direction === 'right') {
                this.sx -= 1;
		} else if (this.direction === 'left') {
			this.sx += 1;
		} else if (this.direction === 'up') {
			this.sy += 1;
		} else if (this.direction === 'down') {
			this.sy -= 1;
		}
    }
    move() {
        if(!this.stuck){
            if (this.direction === 'right') {
                this.x += 1;
            } else if (this.direction === 'left') {
                this.x -= 1;
            } else if (this.direction === 'up') {
                this.y -= 1;
            } else if (this.direction === 'down') {
                this.y += 1;
            }
            for (let i = 0; i < cars.length; i++) {
                if((cars[i] !== this && cars[i].x === this.x && cars[i].y === this.y) || (player.x === this.x && player.y === this.y)){
                    if(this.direction === 'right'){
                        this.x -= 1;
                    }
                    else if(this.direction === 'left'){
                        this.x += 1;
                    }
                    else if(this.direction === 'up'){
                        this.y += 1;
                    }
                    else if(this.direction === 'down'){
                        this.y -= 1;
                    }
                    this.patience -= 1;
                    if(this.patience == 6){
                        audio[9].play();
                    }
                    if(this.patience == 3){
                        audio[10].play();
                    }
                    break;
                }
            }
        }
        else{
            this.patience -= 1;
            if(this.patience == 6){
                audio[9].play();
            }
            if(this.patience == 3){
                audio[10].play();
            }
        }
        if(this.patience <= 0){
            cars.splice(cars.indexOf(this), 1);
            deductions += 1;
            audio[1].play();
        }
        for(let j = 0; j < tiles.length; j++){
            if(this.x === tiles[j].x && this.y === tiles[j].y){
                if(tiles[j].type === 'mud'){
                    if(this.stuck == false){
                        audio[4].play();
                    }
                    this.stuck = true;
                    
                }
                else if(tiles[j].type === 'magic'){
                    if(this.direction === 'right'){
                        this.direction = 'down';
                        audio[5].play();
                    }
                    else if(this.direction === 'left'){
                        this.direction = 'up';
                        audio[5].play();
                    }
                    else if(this.direction === 'up'){
                        this.direction = 'right';
                        audio[5].play();
                    }
                    else if(this.direction === 'down'){
                        this.direction = 'left';
                        audio[5].play();
                    }
                }
                else if(tiles[j].type === 'lava'){
                    cars.splice(cars.indexOf(this), 1);
                    deductions += 1;
                    audio[1].play();
                    audio[2].play();
					for(let i = 0; i < 20; i++){
						particles.push(new Particle(this.x*40+20, this.y*40+20, 20, 1));
					}
                }
                else if(tiles[j].type === 'pusher'){
                    j = tiles.length;
                    if(this.direction === 'right'){
                        this.push('up');
                    }
                    else if(this.direction === 'left'){
                        this.push('down');
                    }
                    else if(this.direction === 'up'){
                        this.push('left');
                    }
                    else if(this.direction === 'down'){
                        this.push('right');
                    }
                }
            }
        }
    }
    checkPlace(){
        if(this.x < -1 || this.x > 10 || this.y < -1 || this.y > 10){
            return false;
        }
        return true;
    }
    push(direction){
        
        if (direction === 'right') {
            this.x += 1;
        } else if (direction === 'left') {
            this.x -= 1;
        } else if (direction === 'up') {
            this.y -= 1;
        } else if (direction === 'down') {
            this.y += 1;
        }
        
        for (let i = 0; i < cars.length; i++) {
            if(cars[i] !== this && cars[i].x === this.x && cars[i].y === this.y ){
                if(direction === 'right'){
                    cars[i].push('right');
                }
                else if(direction === 'left'){
                    cars[i].push('left');
                }
                else if(direction === 'up'){
                    cars[i].push('up');
                }
                else if(direction === 'down'){
                    cars[i].push('down');
                }
                break;
            }
        }
        if(player.x === this.x && player.y === this.y && player !== this){
            if(direction === 'right'){
                player.push('right');
            }
            else if(direction === 'left'){
                player.push('left');
            }
            else if(direction === 'up'){
                player.push('up');
            }
            else if(direction === 'down'){
                player.push('down');
            }
        }
        if((this.direction != 'right' && this.x > 9 || this.direction != 'left' && this.x < 0 || this.direction != 'up' && this.y < 0 || this.direction != 'down' && this.y > 9)){
            if(direction === 'right'){
                this.push('left');
            }
            else if(direction === 'left'){
                this.push('right');
            }
            else if(direction === 'up'){
                this.push('down');
            }
            else if(direction === 'down'){
                this.push('up');
            }
        }
        this.stuck = false;
        for(let j = 0; j < tiles.length; j++){
            if(this.x === tiles[j].x && this.y === tiles[j].y){
                if(tiles[j].type === 'mud'){
                    if(this.stuck === false && this.direction != 'none'){
                        audio[4].play();
                    }
                    this.stuck = true;
                }
                else if(tiles[j].type === 'magic'){
                    if(this.direction === 'right'){
                        this.direction = 'down';
                        audio[5].play();
                    }
                    else if(this.direction === 'left'){
                        this.direction = 'up';
                        audio[5].play();
                    }
                    else if(this.direction === 'up'){
                        this.direction = 'right';
                        audio[5].play();
                    }
                    else if(this.direction === 'down'){
                        this.direction = 'left';
                        audio[5].play();
                    }
                }
                else if(tiles[j].type === 'lava'){
                    if(this.direction === 'none'){
                        deductions += 10;
						for(let i = 0; i < 20; i++){
							particles.push(new Particle(this.x*40+20, this.y*40+20, 20, 1));
						}
                    }
                    else{
                        cars.splice(cars.indexOf(this), 1);
                        deductions += 1;
                        audio[2].play();
						for(let i = 0; i < 20; i++){
							particles.push(new Particle(this.x*40+20, this.y*40+20, 20, 1));
						}
                    }
                    audio[1].play();
                    
                }
            }
        }
    }
}
class Particle{
	constructor(x, y, size, colour){
		this.x = x;
		this.y = y;
		this.vx = random(-5, 5);
		this.vy = random(-5, 5);
		this.size = size;
		this.colour = colour;
	}
	draw(){
		if(this.colour == 1){
			fill(255, 0, 0);
		}
		ellipse(this.x, this.y, this.size, this.size);
		this.x += this.vx;
		this.y += this.vy
		this.vx *= 0.9;
		this.vy *= 0.9;
		this.size *= 0.95;
	}
}

let cars = [];
let tiles = [];
let particles = [];
let t;
let state = 0;
let spawns = 9;
let timer = 30;
let round = 0;
let turn = 0;
let deductions = 0;
let tileAvailable = false;
let player;
let wait = 50;
let audio = [];
let images = []
function setup(){
    audio = [loadSound("sound/gameover"), loadSound("sound/deduction"), loadSound("sound/burndeduction"), loadSound("sound/carpush"), loadSound("sound/carmud"), loadSound("sound/carmagic"), 
    loadSound("sound/endofround"), loadSound("sound/newround"), loadSound("sound/placetile"), loadSound("sound/beepa"), loadSound("sound/beepb")];
	images = [loadImage("images/lava.png"), loadImage("images/pusher.png"), loadImage("images/magic.png"), loadImage("images/mud.png"), loadImage("images/player.png"), loadImage("images/carleft.png"),
			 loadImage("images/carright.png"), loadImage("images/carup.png"), loadImage("images/cardown.png")];
    audio[5].volume = 0.5;
    audio[4].volume = 0.5;
    audio[1].volume = 0.25;
    createCanvas(400,500);
    t = millis();
    player = new Car(0, 0, 'none');
}
function draw(){

    if(wait > 0){
		background(220);
        if(state == 0){
			background(230);
		}
        for(let i = 0; i < tiles.length; i++){
            tiles[i].draw();
        }
		image(images[4], player.sx*40,player.sy*40,40,40);
        player.sx = player.x*0.2+player.sx*0.8;
        player.sy = player.y*0.2+player.sy*0.8;
        for(let i = 0; i < cars.length; i++){
			if(cars[i].direction === "left"){
				image(images[5], cars[i].sx*40,cars[i].sy*40,40,40);
			}
			else if(cars[i].direction === "right"){
				image(images[6], cars[i].sx*40,cars[i].sy*40,40,40);
			}
			else if(cars[i].direction === "up"){
				image(images[7], cars[i].sx*40,cars[i].sy*40,40,40);
			}
			else if(cars[i].direction === "down"){
				image(images[8], cars[i].sx*40,cars[i].sy*40,40,40);
			}
            fill(255-25.5*cars[i].patience,25.5*cars[i].patience, 0);
            ellipse(cars[i].sx*40+34,cars[i].sy*40+6,10,10);
            cars[i].sx = cars[i].x*0.2+cars[i].sx*0.8;
            cars[i].sy = cars[i].y*0.2+cars[i].sy*0.8;
            if(!cars[i].checkPlace()){
                cars.splice(i, 1);
                i--;
            }
        }
		for(let i = 0; i < particles.length; i++){
			noStroke();
			particles[i].draw();
			if(particles[i].size < 0.5){
				particles.splice(i, 1);
				i--;
			}
		}
        if(deductions >= 10){
            wait--;
            if(wait == 0){
                audio[0].play();
            }
        }
        if(millis() - t > 1000){
            update();
            t = millis();
        }
		//stroke(0);
		fill(200);
		rect(0, 400, 400, 100);
		if(state != 0){
	        fill(0);
	        textSize(20);
	        textAlign(LEFT, TOP);
	        text("Round " + (round+1), 20, 415);
	        textSize(16);
	        text("Cars left: " + (Math.ceil(spawns)), 20, 445);
	        text("Time left: " + Math.max(timer, 0), 20, 465);
		}
        for(let i = 0; i < 10; i++){
            fill(0, 255, 0)
            if(i < deductions){
                fill(50);
            }
            ellipse(380-25*i, 424, 20, 20);
            if(i < deductions){
                fill(255, 0, 0);
                textSize(24);
                textAlign(CENTER, CENTER);
                text("X", 380-25*i, 426);
            }
        }
        fill(0);
        textSize(20);
        textAlign(CENTER, TOP);
		if(state === 0){
			text("Press 'p' to start", 270, 453);
		}
		if(state === 2){
			fill(0);
			rect(0, 0, 400, 400);
			textAlign(CENTER, CENTER);
			textSize(40);
			fill(255);
			text("Game Paused", 200, 180); 
			textSize(20);
			text("press 'p' to resume", 200, 220); 
		}
        else if(tileAvailable && player.x >= 1 && player.x <= 8 && player.y >= 1 && player.y <= 8){
            text("Space to place pusher tile", 270, 453);
        }
    }
    if(wait <= 0){
        background(255, 0, 0, 10);
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Game Over", 200, 225);
        text("Rounds survived: " + round, 200, 275);

    }
    

}
function update(){
	if(state === 1){
	    for(let i = 0; i < cars.length; i++){
	        if(turn === 0 && (cars[i].direction === 'right' || cars[i].direction === 'left')){
	            cars[i].move();
	        }
	        if(turn === 1 && (cars[i].direction === 'up' || cars[i].direction === 'down')){
	            cars[i].move();
	        }
	        
	        
	    }
	    for(let i = 0; i < spawns && timer >= 1; i++){
	        if(random(0, 1) < 1/timer){
	            if(turn === 0){
	                direction = random(['right', 'left']);
	            }
	            else if(turn === 1){
	                direction = random(['up', 'down']);
	            }
	            if(direction === 'right'){
	                cars.push(new Car(0, floor(random(1, 9)), 'right'));
	            } else if(direction === 'left'){
	                cars.push(new Car(9, floor(random(1, 9)), 'left'));
	            } else if(direction === 'up'){
	                cars.push(new Car(floor(random(1, 9)), 9, 'up'));
	            } else if(direction === 'down'){
	                cars.push(new Car(floor(random(1, 9)), 0, 'down'));
	            }
	            spawns--;
	        }
	    }
	    if(turn === 0 ){
	        turn = 1;
	    }
	    else if(turn === 1){
	        turn = 0;
	    }
	    for(let i = 0; i < cars.length; i++){
	        if(cars[i].x === player.x && cars[i].y === player.y){
	            spawns++;
	            cars.splice(i, 1);
	            i--;
	        }
	        else{
	            for(let j = i+1; j < cars.length; j++){
	                if(cars[i].x === cars[j].x && cars[i].y === cars[j].y){
	                    spawns++;
	                    cars.splice(j, 1);
	                    j--;
	                }
	            }
	        }
	    }
	    timer--;
	    if(cars.length === 0 && timer <= 0){
	        round++;
	        timer = 30+round*10;
	        spawns = (round+10)*0.03*timer;
	        if(round % 2 === 0){
	            tileAvailable = true;
	        }
	        audio[7].play();
	    }
	    else if(timer == 0){
	        audio[6].play();
	    }
	    if(timer <= 0){
	        spawns = 0;
	    }
	        
	}
}
function keyPressed(){
    if(deductions >= 10){
        return;
    }
	if(keyCode === 80){
		audio[3].play();
		if(state === 0){
			tiles.push(new Tile('lava'));
		    tiles.push(new Tile('mud'));
		    tiles.push(new Tile('mud'));
		    tiles.push(new Tile('magic'));
		    tiles.push(new Tile('magic'));
		}
		if(state === 1){
			state = 2;
		}
		else{
			state = 1;
		}
	}
	if(state != 2){
	    if(keyCode === UP_ARROW){
	        player.push('up');
	    }
	    else if(keyCode === DOWN_ARROW){
	        player.push('down');
	    }
	    else if(keyCode === LEFT_ARROW){
	        player.push('left');
	    }
	    else if(keyCode === RIGHT_ARROW){
	        player.push('right');
	    }
	    else if(keyCode === 32 && tileAvailable && player.x >= 1 && player.x <= 8 && player.y >= 1 && player.y <= 8){
	        for(let i = 0; i < tiles.length; i++){
	            if(tiles[i].x === player.x && tiles[i].y === player.y){
	                return;
	            }
	        } 
	        tiles.push(new Tile('pusher'));
	        tileAvailable = false;
	        audio[8].play();
	    }
	}
}
