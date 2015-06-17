//Constant values 
TILE_WIDTH = 100;
TILE_HEIGHT = 80; 
PLAYER_INIT_X = 200;
PLAYER_INIT_Y = 400;
ENEMY_INIT_X = 0;
ENEMY_INIT_Y = 60;
GEM_INIT_X = 700;
GEM_INIT_Y = 0;
SPRITE_WIDTH = 100;
SPRITE_HEIGHT = 172;

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
    if (this.x > width + SPRITE_WIDTH) {

        this.x -= (width+2 * SPRITE_WIDTH);
        // varies the speed
        //this.speed = (Math.random() * 350) + 150;
    } 
    // reset player and reduce score by 50 points  up to 0 when enemy and player collude
    enemy.colludes = doesCollude;
    if (enemy.colludes (player.x, player.y, this.x, this.y)) {
        //reduce extra 50 points due to collision
        if (player.score > 100) {
            player.score -= 100;
        }
        else {
            player.score = 0;
        }
        player.resetPlayer();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
};


var Player = function() {
    
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
    // engine.js mySprite variable gives the value to this.sprite before rendering the player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
};

// stores player's position to send to Player.update() function
var newPos = [PLAYER_INIT_X,PLAYER_INIT_Y];
// This function handles players' move upon a key pressed. Makes sure that Player does not move off screen. If the Player reaches the water the game is reset.   
Player.prototype.handleInput = function(keyCode) {    
    player.off = offScreen;
    var deltaX = 0;
    var deltaY = 0;

    // move to left
    if (keyCode === 'left') {
        deltaX -= TILE_WIDTH;        
    }    
    
    // move to right
    if (keyCode === 'right') {
        deltaX += TILE_WIDTH;        
    } 

    // move down
    if (keyCode === 'down') {
        deltaY += TILE_HEIGHT;
    }
    
    // move up
    if (keyCode === 'up') {
        deltaY -= TILE_HEIGHT; 
    } 
    
    // player runs off screen 
    if (player.off (this.x+deltaX, this.y+deltaY)) {
        //if reach left or right edge
        deltaX = 0;
        //if reach bottom
        deltaY = 0;
    }    
    else {
        // 10 points per successful jump
        player.score += 10;
    }
    
    
    newPos[0] = this.x + deltaX;
    newPos[1] = this.y + deltaY;

    // check if water block reached
    if (newPos[1] < 60) {
        // add extra 500 points to reach the water
        this.score+=500;
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

var Gem = function() {
    this.sprite;
    // setting the initial location to off screen
    this.x = GEM_INIT_X;
    this.y = GEM_INIT_Y;
    // setting initial value
    this.collected = false;
};

Gem.prototype.update = function() {
    // updates only if player collects gem
    gem.colludes = doesCollude;
    if (gem.colludes (this.x, this.y, player.x, player.y)) {
        // gem moved off screen
        this.x = GEM_INIT_X;
        this.y = GEM_INIT_Y;
        this.collected = true;
        // add 200 extra points to score
        player.score += 200;
        console.log(doesCollude)
    };
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, SPRITE_WIDTH / 2, SPRITE_HEIGHT / 2);
};
// sets gem's position on a tile within canvas and on the paved block
Gem.prototype.resetGem = function() {
    this.x = Math.round(Math.random() * 4) * TILE_WIDTH +  (TILE_WIDTH - (SPRITE_WIDTH / 2)) / 2;
    this.y = Math.round(Math.random() * 2) * TILE_HEIGHT + (2 * ENEMY_INIT_Y);
    this.collected = false;
    index = allGems.indexOf(this);
    //make sure two gems do not occupy the same place
    for (i = 0; i < index; i++){
        if (this.x == allGems[i].x && this.y == allGems[i].y){
            this.resetGem();
        }
    }
    for (i = 0; i> index && i < allGems.length; i++) {
         if (this.x == allGems[i].x && this.y == allGems[i].y){
            this.resetGem();
        }
    }
};

//Place all gems objects in an array called allGems
var allGems = [];
var gemImages = [
    'images/Gem Green.png',
    'images/Gem Orange.png',
    'images/Gem Blue.png'
]; 

numGems = 5;
    
//create gems at random places on the paved block
gemCount = 0;
for (i = 0; i < numGems; i++) {
    gem = new Gem();
    gem.sprite = gemImages[gemCount];
    if (gemCount >= gemImages.length - 1) {
        gemCount = 0;
    }
    else gemCount++;
    // pos x, y on a tile within the canvas and on the paved block
    gem.resetGem();
    allGems.push(gem);
}
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
// create two enemies per row
for (i=0; i<2; i++) {
    for (j=0; j<3; j++) {
        enemy = new Enemy();
        //setting initial col, random distance from first bug
        enemy.x = j * ((Math.random() * 4) + 2) * TILE_WIDTH;
        var row = 0;
        // setting row
        enemy.y += ((row + j) * TILE_HEIGHT);
        // setting random speed
        enemy.speed = (Math.random() * 350) + 150;
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

