/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 *
 * NOTE that I chosen not to use jQuery library in this project as I wanted to
 * get a practice in DOM handling. 
 */

"use strict";
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     * Also, setting mySprite variable with a default picture
     * that gets updated during Player selection.
     * 
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        title = doc.createElement('h1'),
        para = doc.createElement('p'),
        timer = doc.createElement('p'),
        canvasCont = doc.createElement('div'),
        btnPlay = doc.createElement('button'),
        btnBack = doc.createElement('button'),
        btnExit = doc.createElement('button'),
        //default player sprite gets overwritten by player selection
        mySprite = 'images/char-boy.png';
    
    canvas.width = 505;
    canvas.height = 606;
    // add all DOM elements that are required to play the game to class "game-play"
    canvasCont.id = "viewport";
    canvasCont.className = "view game-play";
    doc.body.appendChild(canvasCont);
    title.className = "game-play";
    canvasCont.appendChild(title);
    para.className = "game-play";
    canvasCont.appendChild(para);
    timer.className = "game-play";
    timer.id = "timer";
    canvasCont.appendChild(timer);
    btnPlay.id = "btn-play";
    btnPlay.className = "play game-play";
    btnPlay.innerHTML = "PLAY GAME";
    btnBack.id = "btn-back";
    btnBack.className = "back game-play";
    btnBack.innerHTML = "BACK";
    //exit button added to start-screen and to game-play screen
    btnExit.id = "btn-exit";
    btnExit.className = "exit game-play";
    btnExit.innerHTML = "EXIT";
    btnExit.style.color = "red";
    //add buttons to canvas
    canvasCont.appendChild(btnPlay);
    canvasCont.appendChild(btnBack);
    canvasCont.appendChild(btnExit);
    canvas.className = "game-play";
    canvasCont.appendChild(canvas); 
    
   
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods within timer function.
     */
    function main() {
        btnPlay.addEventListener("click", function() {
            btnPlay.style.display = "none";
            btnBack.style.display = "none";
            btnExit.style.display = "none";
            
            timer(30000,
            function (timeleft) { // called every step to update the visible countdown
                document.getElementById('timer').innerHTML = timeleft+" second(s) left";
            },
            function() { // time is over
                btnPlay.style.display = "block";
                btnBack.style.display = "block";
                btnExit.style.display = "block";
                //to initialize player's position for the next play
                player.resetPlayer();
                player.score = 0;
                // change gems' positions
                allGems.forEach(function(gem) {
                    gem.resetGem();
                });
            }); 
        });
        
        btnBack.addEventListener("click", function() {
            var play = doc.querySelectorAll('.game-play');
            // Hide all elements within that class 
            var i;
            for (i =0; i < play.length; i++) {
                play[i].style.display = "none";    
            }
            btnExit.style.display = "none";
            doc.getElementById("select-player-title").style.display = "block";
            doc.getElementById("select-player-content").style.display = "block";
            var hide = doc.querySelectorAll(".select-player");
            var j = 0;  
            for (j=0; j < hide.length; j++ ) {
                    hide[j].style.display = "inline-block";
            }                    
        });
    
    /* Timer function to allow timed game as an Udacious feature. The main game functions  
     * are inserted here and till timeleft is not over the game loops over and over.
     * Source : http://stackoverflow.com/questions/1191865/code-for-a-simple-
     * javascript-countdown-timer
     */
    function timer(time,timerOn,complete) {
        var start = new Date().getTime();
        var interval = setInterval(function() {
            var now = time-(new Date().getTime()-start);
            if( now <= 0) {
                clearInterval(interval);
                complete();
            }
            else { 
                var currentTime = Date.now();
                /* Get our time delta information which is required if your game
                 * requires smooth animation. Because everyone's computer processes
                 * instructions at different speeds we need a constant value that
                 * would be the same for everyone (regardless of how fast their
                 * computer is) - hurray time!
                 */
                var dt = (currentTime - lastTime) / 1000.0;
                /* Call our update/render functions, pass along the time delta to
                * our update function since it may be used for smooth animation.
                */
                update(dt);
                /* Set our lastTime variable which is used to determine the time delta
                * for the next time this function is called.
                */
                lastTime = currentTime;
                render();          
                timerOn(Math.floor(now/1000));
            }
        },100); // the smaller this number, the more accurate the timer will be
    }
        /* Author: I did not use this function as timer() replaces it. 
         * Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        //win.requestAnimationFrame(main);
        
    }
    
    

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    
    
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
     function update(dt) {
        updateEntities(dt);
    }

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
        }
            return false;    
    };    
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the collision function to 
     * reset Player when collision. It will then call the update function 
     * for your player object. These update methods should focus purely on
     * updating the data/properties related to  the object. 
     */
    function updateEntities(dt) {
       allEnemies.forEach(function(enemy) {
            enemy.colludes = doesCollude;
            enemy.update(dt);
       });
       player.sprite = mySprite;
       player.off = offScreen;
       player.update();
       allGems.forEach(function (gem) {
           gem.colludes = doesCollude; 
           gem.update();
       });       
    }
    
    
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        
        /* Add score to DOM 
        */
        title.innerHTML = "score";
        para.innerHTML = player.score + " points";
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        //Add collectible gems to canvas 
        allGems.forEach(function(gem) {
            gem.render();
        });
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
           enemy.render();            
        });        
        player.render();        
    }

    
    /* This function creates the initial menu to start the game, display game rules and to exit.  
    * It's only called once by the init() method.
     */
    function reset() {
        
        //setting player character images and names
        var playerSprites = {
            img : [
                'images/char-boy.png',
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png'],
            name :[
                'coccino',
                'vanille',
                'santoria',
                'venus',
                'altesse']
        };
        

        // Get all DOM elements belonging to class 'game-play'
        var play = doc.querySelectorAll('.game-play');
        // Hide all elements within that class 
        var i;
        for (i =0; i < play.length; i++) {
            play[i].style.display = "none";    
        }
        // Set game title element and their attributes, unique css values and add to DOM
        var startScreen = doc.createElement('h1');
        startScreen.className = 'start-screen-title';
        doc.body.appendChild(startScreen);
        startScreen.innerHTML = "frogger arcade game";
        startScreen.style.fontStyle = '900, Georgia, serif';
        startScreen.style.color = 'red';
        startScreen.style.paddingTop = "150px";
        // Create button elements and add to DOM
        // Start game button 
        var btnStart = doc.createElement("button");
        btnStart.id = "btn-start";
        btnStart.className = 'start-screen';
        var t = doc.createTextNode("START GAME");
        btnStart.appendChild(t);
        doc.body.appendChild(btnStart);
        btnStart.style.color = "green";
        // On click hide initial screen and get to Player selection screen
        btnStart.addEventListener('click', function (){            
            var i;
            var hide = doc.querySelectorAll(".start-screen");
            for (i=0; i < hide.length; i++ ) {
                hide[i].style.display = "none";
            }
            doc.querySelector(".start-screen-title").style.display = "none";
            var unhide = doc.getElementById("select-player-content");
            unhide.style.display = "inline-flex";
            unhide = doc.getElementById("select-player-title");
            unhide.style.display = "block";
        });
        
        // create "select player screen" elements and add to DOM  
        // add title
        var title = doc.createElement("h1");
        title.id = "select-player-title";
        title.className = "select-player";
        title.innerHTML = "Select your player";
        title.style.paddingTop = "150px";
        title.style.paddingBottom = "35px";
        title.style.display = "none";
        doc.body.appendChild(title);
        
        // add players pictures and captions
        var content = doc.createElement("div");
        content.id = "select-player-content";
        content.className = "select-player";
        content.style.display = "none";
        doc.body.appendChild(content);
        var imgWidth = 100;
        var imgHeight = 150;
        for (i = 0; i < playerSprites.img.length; i++) {
            var container = doc.createElement("figure");
            content.appendChild(container);
            container.className = "select-player";
            var image = doc.createElement("img");
            image.width = imgWidth;
            image.height = imgHeight;
            image.src = playerSprites.img[i];
            image.id = playerSprites.name[i];
            image.style.marginLeft = "15px";
            image.style.marginRight = "15px";
            image.style.border = "3px outset white";
            // select player by clicking the chosen picture
            // assign the chosen player to mySprite variable
            image.addEventListener("click", function(){
                var str = this.src;
                mySprite = str.slice(str.search('images'));
            });
            
            // once player selected, select player screen disappears and game play screen shows up 
            image.addEventListener("click", function (){
                var unhide = doc.querySelectorAll(".game-play");
                update(0);
                render();
                for (i=0; i < unhide.length; i++ ) {
                    unhide[i].style.display = "block";
                }
                btnExit.className = "exit";
                btnExit.style.display = "block";
                var hide = doc.querySelectorAll(".select-player");
                var j = 0;  
                for (j=0; j < hide.length; j++ ) {
                    hide[j].style.display = "none";
                }                    
            });
            
            
            container.appendChild(image);
            var fig = doc.createElement("figcaption");
            fig.style.color = "white";
            fig.innerHTML = playerSprites.name[i];
            container.appendChild(fig);
        }                
          
         //create game rules button
        var btnGameRules = doc.createElement("button");
        btnGameRules.id = "btn-game-rules";
        btnGameRules.className = 'start-screen';
        title = doc.createTextNode("GAME RULES");
        btnGameRules.appendChild(title);
        doc.body.appendChild(btnGameRules);
        btnGameRules.style.color = "green";
        // On click hide initial screen and get to Game rules screen
        btnGameRules.addEventListener('click', function (){            
            doc.querySelector(".start-screen-title").style.display = "none";
            var i;
            var hide = doc.querySelectorAll(".start-screen");
            for (i=0; i < hide.length; i++ ) {
                hide[i].style.display = "none";            
            }
            gameRulesload();
        });
        
        
        //src: http://stackoverflow.com/questions/9614932/best-way-to-create-large-static-dom-elements-in-javascript
        function gameRulesload (){
            doc.getElementById("game-rules-content").style.display = "block";
            // On click hide initial screen and get to start screen
            btnBackFromRules.addEventListener('click', function (){            
                var i;
                doc.getElementById("game-rules-content").style.display = "none";
                doc.querySelector(".start-screen-title").style.display = "block";
                var unHide = doc.querySelectorAll(".start-screen");
                for (i=0; i < unHide.length; i++ ) {
                    unHide[i].style.display = "inline-block";            
                }
            });
        }
        
        
        // Add exit button to start screen
        btnExit.className = 'start-screen';
        doc.body.appendChild(btnExit);
        btnExit.style.display = "inline-flex";
        // by clicking on "exit" button the game and the window  in the browser are closed
        btnExit.addEventListener("click", function() {
            win.close();
        });
        
        // Create Game Rules screen DOM elements
        var gameRulesContent = doc.createElement("div");
        gameRulesContent.id = "game-rules-content";
        gameRulesContent.className = "rules-content";
        doc.body.appendChild(gameRulesContent);
        var contentText = "<h1>GAME RULES</h1><p>You'll start the game by selecting an image for your player character.<br>The goal is to get the player to reach the water within 30 seconds, as many times as you can by reaching highest score.<br>At start the Player is shown on the greengrass in the middle at the starting square. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. Once a player collides with an enemy, the player will be moved back to starting square and loose points. Once the player reaches the water will be moved back to starting square and within your timeframe you can move it again to water.Your player can collect gems that are thrown on the paved block for extra points.<br><h2>TIMING</h2><p>You have only 30 seconds to move one Player from the green zone to reach the water.Time is monitored and remaining seconds displayed at the top of the screen right under SCORE.</p><h2>SCORING</h2><p>Your score is displayed at the top of the screen throughout the game. Points accumulate as follows:<br><ul><li>Successfully jumping Player without jumping off screen adds 10 points per jump</li><li>Successfully jumping Player to reach the water  adds 500 points</li><li>Collecting a gem adds 200 points</li><li>Colliding with an enemy reduces 100 points</li></ul><h3>Enjoy the game as I enjoyed coding it! Hope you find my game Udacious!</h3><button id='btnBackFromRules'>Back</button>";
        gameRulesContent.innerHTML = contentText;
        doc.getElementById("game-rules-content").style.display = "none";
    }
    
    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Gem Blue.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object and canvas width and canvas height to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.width = canvas.width;
    global.height = canvas.height;
})(this);
