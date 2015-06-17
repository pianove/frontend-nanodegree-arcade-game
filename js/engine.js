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
 * get a practice in DOM handling. It definitely multiplies codelines but I 
 * learnt tremendously about DOM attributes, events and debugging. 
 */


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
        //default player sprite gets overwritten by player selection
        mySprite = 'images/char-boy.png';
    
    canvas.width = 505;
    canvas.height = 606;
    // add all DOM elements that are required to play the game to class "game-play"
    canvasCont.id = "viewport";
    canvasCont.className = "game-play";
    doc.body.appendChild(canvasCont);
    title.className = "game-play";
    canvasCont.appendChild(title);
    para.className = "game-play";
    canvasCont.appendChild(para);
    timer.className = "game-play";
    timer.id = "timer";
    canvasCont.appendChild(timer);
    btnPlay.id = "btn-play";
    btnPlay.className = "game-play";
    btnPlay.innerHTML = "PLAY GAME";
    canvasCont.appendChild(btnPlay);
    canvas.className = "game-play";
    canvasCont.appendChild(canvas); 
    
   
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods within timer function.
     */
    function main() {
        btnPlay.addEventListener("click", function() {
            btnPlay.style.display = "none";
            
            timer(30000,
            function (timeleft) { // called every step to update the visible countdown
                document.getElementById('timer').innerHTML = timeleft+" second(s) left";
            },
            function() { // time is over
                btnPlay.style.display = "block";
                //to initialize player's position for the next play
                player.resetPlayer();
                player.score = 0;
            }) 
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
                currentTime = Date.now();
                /* Get our time delta information which is required if your game
                 * requires smooth animation. Because everyone's computer processes
                 * instructions at different speeds we need a constant value that
                 * would be the same for everyone (regardless of how fast their
                 * computer is) - hurray time!
                 */
                dt = (currentTime - lastTime) / 1000.0;
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
        /* I did not use this function as timer() replaces it. 
         * Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        //win.requestAnimationFrame(main);
        
    };
    
    

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

    
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the collision function to 
     * reset Player when collision. It will then call the update function 
     * for your player object. These update methods should focus purely on
     * updating the data/properties related to  the object. Do your drawing
     * in your render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        })
       player.sprite = mySprite;
       player.update();
        
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
        renderEntities()
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
           enemy.render();            
        });
        player.render();
    }

    
    /* This function creates the initial menu to start the game or to exit. 
    * Then proceeds to player selection screen. 
    * It's only called once by the init() method.
     */
    function reset() {
        
        //setting players character pictures and names
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
        

        // Get all elements belonging to class 'game-play'
        var play = doc.querySelectorAll('.game-play');
        // Hide all elements within that class 
        var i;
        for (i =0; i < play.length; i++) {
            play[i].style.display = "none";    
        }
        // Set game title element and their attributes, unique css values and add to DOM
        var startScreen = doc.createElement('h1');
        startScreen.className = 'start-screen';
        doc.body.appendChild(startScreen);
        startScreen.innerHTML = "frogger arcade game";
        startScreen.style.fontStyle = '900, Georgia, serif';
        startScreen.style.color = 'red';
        startScreen.style.paddingTop = "150px";
        
        // Create button elements to start the game and to exit from the game and add to DOM
        
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
                var hide = doc.querySelectorAll(".select-player");
                var j = 0;  
                for (j=0; j < hide.length; j++ ) {
                    hide[j].style.display = "none";
                }                    
            });
            
            
            container.appendChild(image);
            var t = doc.createElement("figcaption");
            t.style.color = "white";
            t.innerHTML = playerSprites.name[i];
            container.appendChild(t);
        }
        
                
                
        // Create Exit button and add to DOM
        var btnExit = doc.createElement("button");
        btnExit.id = "btn-exit";
        btnExit.className = 'start-screen';
        t = doc.createTextNode("EXIT");
        btnExit .appendChild(t);
        doc.body.appendChild(btnExit);
        btnExit.style.color = "red";
        // by clicking on "exit" button player closes the game and the window in the browser 
        btnExit.addEventListener("click", function() {
            win.close();
        })
        
    };

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
        'images/Key.png'
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
