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
    // Variables applied to each of our instances go here
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // setting the initial location
    this.x = ENEMY_INIT_X;
    this.y = ENEMY_INIT_Y;
    // setting the initial speed 
    this.speed = 0;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Handles collision with the Player
Enemy.prototype.update = function(dt) {
    // multiplies any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    this.x += this.speed * dt;
    
    // launch enemy back to canvas at random speed 
    if (this.x > width) {
        this.x = -SPRITE_WIDTH;
        // varies the speed
        this.speed = (Math.random() * 350) + 50;
        this.x += this.speed * dt;
    } 
    // reset player and reduce score by one up to 0 when enemy and player collude
    enemy.colludes = doesCollude;
    if (enemy.colludes (player.x, player.y, this.x, this.y)) {
        if (player.score > 0) {
            player.score--;
        }
        player.resetPlayer();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
};


var Player = function() {
    // engine.js mySprite variable gives the value of this.sprite before rendering the player
    this.sprite;
    
    // setting the initial location
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
    // setting initial score
    this.score = 0;
}

// Update the player's position
Player.prototype.update = function() {
    this.x = newPos[0];
    this.y = newPos[1];
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
};

// stores position to send to Player.update() function
var newPos = [PLAYER_INIT_X,PLAYER_INIT_Y];
// This function handles players' move upon a key pressed. Makes sure that Player does not move off screen. If the Player reaches the water the game is reset.   
Player.prototype.handleInput = function(keyCode) {    
    player.off = offScreen;
    var deltaX = 0;
    var deltaY = 0;

    // move to left
    if (keyCode === 'left') {
     // player.x -= TILE_WIDTH;
        deltaX -= TILE_WIDTH;
        
    }    
    
    // move to right
    if (keyCode === 'right') {
      //player.x += TILE_WIDTH;
        deltaX += TILE_WIDTH;
        
    } 

    // player runs left or right off screen 
    if (player.off (this.x+deltaX, this.y+deltaY)) {
        //player.x = oldX;
        deltaX = 0;
    }    
    
    // move up
    if (keyCode === 'up') {
      //player.y -=TILE_HEIGHT;
        deltaY -= TILE_HEIGHT; 
    } 
    
    // move down
    if (keyCode === 'down') {
      //player.y += TILE_HEIGHT;
        deltaY += TILE_HEIGHT; 
      // player runs down off screen    
      if (player.off (this.x+deltaX, this.y+deltaY)) {
        //player.y = oldY;
        deltaY = 0;
      }        
    }
    
    newPos[0] = this.x + deltaX;
    newPos[1] = this.y + deltaY;

    // check if water block reached
    if (newPos[1] < 60) {
        this.score++;
        // reset player to initial position
        player.resetPlayer();
    }
};


// This function detects if an entity's position is off screen
var offScreen = function(posX,posY) {
    var x = posX;
    var y = posY;
    if ((x >= (width-10) || x < 0) || (y > (height-2 * TILE_HEIGHT))) {
        return true;
    }
    else {
        return false; 
    }
};


    
// This function detects if two entities collude and returns true if they collude otherwise return false.
var doesCollude = function checkCollisions (x1, y1, x2, y2) {
    if ((x1 >= x2) && 
       ((x2 + TILE_WIDTH) >= x1) && 
       (y1 >= y2) &&
       ((y2 + TILE_HEIGHT)> y1)) {
        return true;
    };
        return false;    
};    


// This function resets player's position to initial square
Player.prototype.resetPlayer = function() {
    // reset Player to initial position
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
    newPos[0] = this.x;
    newPos[1] = this.y;
};

// Place all enemy objects in an array called allEnemies

var allEnemies = [];
// create two enemies per row
for (i=0; i<2; i++) {
    for (j=0; j<3; j++) {
        enemy = new Enemy();
        //setting initial col
        enemy.x = j * TILE_WIDTH;
        var row = 0;
        // setting row
        enemy.y += ((row + j) * TILE_HEIGHT);
        // setting random speed
        enemy.speed = (Math.random() * 450) + 100;
        allEnemies.push(enemy);
        row++;
    }
};

// Place the player object in a variable called player
var player = new Player();

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

