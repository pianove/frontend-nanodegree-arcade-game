//Constant values 
TILE_WIDTH = 100;
TILE_HEIGHT = 80; 
PLAYER_INIT_X = 200;
PLAYER_INIT_Y = 400;
ENEMY_INIT_X = 0;
ENEMY_INIT_Y = 60;
SPRITE_WIDTH = 101;
SPRITE_HEIGHT = 171;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = ENEMY_INIT_X;
    this.y = ENEMY_INIT_Y;
    // TODO setting the initial location
    // TODO setting the initial speed 
    this.speed = 0;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // TODO You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    this.x += this.speed * dt;
// launch enemy back to canvas at random speed
    this.off = offScreen;
    if (this.off(this.x, this.y)) {
        this.x = 0;
        this.speed = (Math.random() * 200) + 5;
    }
}

// check if player intersects with enemy and reset player    
Enemy.prototype.collision = function () {
    if ((this.x <= player.x && (this.x + TILE_WIDTH) >= player.x) && (this.y <= player.y && (this.y + TILE_HEIGHT > player.y))){
        console.log('COLLISION');
        player.resetPlayer();
        
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // setting the initial location
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
}

// Update the player's position
Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 171);
};


//TODO Player.handleInput() method
Player.prototype.handleInput = function(keyCode) {    
    player.off = offScreen;
    var oldX = player.x;
    var oldY = player.y;
    
// move to left
    if (keyCode === 'left') {
      player.x -= TILE_WIDTH;
    }    
    
// move to right
    if (keyCode === 'right') {
      player.x += TILE_WIDTH;
    } 

// player runs left or right off screen 
    if (player.off (this.x, this.y)) {
        player.x = oldX;
    }    

    
// move up
    if (keyCode === 'up') {
      player.y -=TILE_HEIGHT;
    } 
    
// move down
    if (keyCode === 'down') {
      player.y += TILE_HEIGHT;
    }
    
// player runs down off screen    
    if (player.off (this.x, this.y)) {
      player.y = oldY;
    }    
    
// check if water block reached
    if (player.y < 60) {
    //    ctx.fillText("You won! Well done!", width/2,height/2);    
        console.log("WON");
//reset player to initial position
      player.resetPlayer();
    }

};



var offScreen = function(posX,posY) {
    var x = posX;
    var y = posY;
    if ((x >= (width-10) || x < 0) || (y > 400)) {
      return true;
    }
    else {
      return false; 
    }
};


// TODO Player.resetPlayer() method

Player.prototype.resetPlayer = function() {
// reset Player to initial position
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
// draw player on canvas
    this.render();
};



// TODO Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
// create two enemies per row

for (i=0; i<2; i++) {
    for (j=0; j<3; j++) {
        enemy = new Enemy();
        var row = 0;
        // setting row
        enemy.y += ((row + j) * TILE_HEIGHT);
        // setting random speed
        enemy.speed = (Math.random() * 400) + 5;
        allEnemies.push(enemy);
        row++;
    }
};


var player = new Player();
player.loc = [player.x, player.y];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

