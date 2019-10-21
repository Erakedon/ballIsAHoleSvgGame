document.addEventListener("DOMContentLoaded",onLoad)

function onLoad()
{
    document.addEventListener("keydown",keyHandler);
    document.querySelector("#restartBtn").addEventListener("click",() => {Game.restart()});
    Game.setGame();
    document.querySelector("#startBtn").addEventListener("click",() => {
        Game.setMove(true);
        document.querySelector("#startInfo").style.display = "none";
    });
    
    window.addEventListener("deviceorientation",orientationChange);

}

let Game =
{
    element: document.querySelector("#gameBoard"),
    map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,1],
        [1,1,0,0,1,1,0,1,0,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,1,1,2,0,0,0,0,1,0,1],
        [1,0,1,1,0,1,1,2,0,0,0,1,2,0,1,1,0,1,0,1],
        [1,2,2,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,0,1],
        [1,0,0,0,2,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
        [1,0,1,0,0,0,1,1,0,1,2,1,0,1,0,2,0,1,0,1],
        [1,0,1,1,0,1,1,0,0,0,0,1,0,1,0,2,0,1,0,1],
        [1,0,2,1,0,0,1,0,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,2,2,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,2,1],
        [1,0,1,0,1,0,0,0,0,1,0,2,1,0,1,0,1,0,2,1],
        [1,0,1,0,0,0,0,1,1,1,0,1,1,0,0,0,1,0,2,1],
        [1,0,1,0,1,2,2,1,0,1,0,0,1,1,0,0,1,0,2,1],
        [1,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,1],
        [1,0,1,0,0,0,0,1,2,1,1,1,1,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,0,1,2,0,0,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,2,0,1,1,1,0,0,1,0,1],
        [1,2,1,1,1,0,1,1,1,0,0,0,1,0,1,2,0,1,0,1],
        [1,2,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,1],
        [1,2,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,1],
        [1,1,0,1,1,0,1,0,0,1,0,1,2,2,0,0,0,2,2,1],
        [1,0,0,1,0,0,1,0,0,1,0,0,0,1,1,0,1,1,1,1],
        [1,0,1,1,2,2,1,1,0,1,1,1,0,0,1,0,0,0,0,1],
        [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1],
        [1,0,0,0,0,2,2,1,0,1,0,1,0,1,1,1,0,1,0,1],
        [1,1,0,1,0,1,1,1,0,0,0,2,0,0,0,0,0,1,0,1],
        [1,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],

    //Number of columns and rows
    partsNum:
    {
        x: 20,
        y: 30
    },
    partSize: 10,//size of part
    bounciness: 0.5,//Percentage loos of speed while bouncing
    
    //size of map
    width: 200,
    height: 300,
    scale: 0,
    friction: 0.01,
    gravity: 0.005,
    
    mainPlayer: {},
    antiPlayer: {},

    menuElement: document.querySelector("#menu"),
    
    firstLoose: true, //different gameover page for first lose
    restart: function()
    {
        this.menuElement.style.display = "none";
        if(this.firstLoose)
        {
            this.firstLoose = false;
            this.menuElement.querySelector("#add").style.display = "none";  
        }
        
        let wallsGroup = this.element.querySelector("#walls");
        while (wallsGroup.firstChild) {
            wallsGroup.removeChild(wallsGroup.firstChild);
        }        
        this.mainPlayer.element.remove();        
        this.antiPlayer.element.remove();
        
        this.setGame();
        this.setMove(true);
        
        document.addEventListener("keydown",keyHandler);

    },

    setGame: function()
    {
        this.scale = Game.element.getBoundingClientRect().width / Game.width;

        this.renderMap();
        this.mainPlayer = new Player(35,15,"green");
        this.antiPlayer = new Player(155,285,"blue");
        this.checkForWin();
    },

    renderMap: function()
    {
        let wallsGroup = this.element.querySelector("#walls");
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                    newEl = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                    newEl.setAttribute("x",j*this.partSize*this.scale+0.3);
                    newEl.setAttribute("y",i*this.partSize*this.scale+0.3);
                    
                    newEl.setAttribute("width",this.partSize*this.scale-0.6);
                    newEl.setAttribute("height",this.partSize*this.scale-0.6);
                    
                    if(this.map[i][j] == 0) newEl.setAttribute("fill","#aaa");
                    else if(this.map[i][j] == 1) newEl.setAttribute("fill","black");
                    else if(this.map[i][j] == 2) newEl.setAttribute("fill","red");       

                    wallsGroup.appendChild(newEl);
            }            
        }
    },

    //checking if balls are meeting
    checkForWin: function()
    {
        let dx = this.mainPlayer.x - this.antiPlayer.x;
        let dy = this.mainPlayer.y - this.antiPlayer.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if(this.mainPlayer.r + this.antiPlayer.r > distance)
            this.win();
        else
            requestAnimationFrame(() => {this.checkForWin()});
    },

    //Showing win page
    win: function()
    {
        this.menuElement.querySelector("#info").innerHTML = "YOU WIN";
        this.showMenu();
    },

    //Showing game over page
    gameOver: function()
    {        
        this.menuElement.querySelector("#info").innerHTML = "GAME OVER";
        if(this.firstLoose) this.menuElement.querySelector("#add").style.display = "inline";
        this.showMenu();
    },

    //Showing menu
    showMenu: function()
    {        
        this.menuElement.style.display = "flex";
        
        document.removeEventListener("keydown",keyHandler);
        this.setMove(false);
    },

    //When game starts or restarts
    setMove: function(val)
    {        
        this.mainPlayer.ableToMove = val;
        this.antiPlayer.ableToMove = val;

        //setting acceleration to zero
        this.mainPlayer.acc = {x:0,y:0};
        this.antiPlayer.acc = {x:0,y:0};
        
        if(val)
        {
            this.mainPlayer.move();
            this.antiPlayer.move();
        }
    }
}

//Constructor for both balls
let Player = function(posX,posY,color)
{
    this.element = {};

    //player position
    this.x = 0;
    this.y = 0;
    this.r = 4.5;
    this.ableToMove = false;

    //player acceleration
    this.acc =
    {
        x: 0,
        y: 0,
        max: 4
    };
    
    //Player on table position
    this.pPos =
    {
        x: 1,
        y: 1
    };

    this.setPlayer(posX,posY,color);
    this.move();
}

//Putting player on Gameboard
Player.prototype.setPlayer = function(posX,posY,color)
{
    this.x = posX;
    this.y = posY;
    
    this.pPos.x = parseInt(this.x / Game.partSize);        
    this.pPos.y = parseInt(this.y / Game.partSize);
    
    this.element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    this.element.setAttribute("cx",this.x);
    this.element.setAttribute("cy",this.y);
    this.element.setAttribute("r", Game.partSize*this.r*0.1*Game.scale);
    this.element.setAttribute("fill", color);
    
    Game.element.appendChild(this.element);
}


Player.prototype.addVelocityX = function(val)
{
    this.acc.x += val;
    if(Math.abs(this.acc.x) > this.acc.max) this.acc.x = this.acc.max * Math.sign(this.acc.x);
}

Player.prototype.addVelocityY = function(val)
{
    this.acc.y += val;
    if(Math.abs(this.acc.y) > this.acc.max) this.acc.y = this.acc.max * Math.sign(this.acc.y);
}

//Moving player and running collistion tests
Player.prototype.move = function()
{
    this.x += this.acc.x;
    this.y += this.acc.y;
    
    this.bouncing();
    
    this.pPos.x = parseInt(this.x / 10);        
    this.pPos.y = parseInt(this.y / 10);

    this.isFloorLava();
    
    this.element.setAttributeNS(null,"cx", this.x*Game.scale);
    this.element.setAttributeNS(null,"cy", this.y*Game.scale);

    this.acc.x -= Math.sign(this.acc.x) * Game.friction;
    this.acc.y -= Math.sign(this.acc.y) * Game.friction;


    if(this.ableToMove) requestAnimationFrame(() => {this.move()});
}

Player.prototype.isFloorLava = function()
{
    if(Game.map[this.pPos.y][this.pPos.x] == 2)
        Game.gameOver();
}

//Checking if player is colliding to wall
Player.prototype.bouncing = function()
{
    //Checking only near walls
    if(Game.map[this.pPos.y][this.pPos.x + 1] == 1)
    {
        if(this.x + this.r > (this.pPos.x + 1)*10)
        {
            this.acc.x = Math.abs(this.acc.x) * -Game.bounciness;
            this.x = (this.pPos.x + 1)*10 - this.r - 0.1;
        }
    }
    if(Game.map[this.pPos.y][this.pPos.x - 1] == 1)
    {
        if(this.x - this.r < (this.pPos.x)*10)
        {
            this.acc.x = Math.abs(this.acc.x) * Game.bounciness;
            this.x = (this.pPos.x)*10 + this.r + 0.1;
        }
    }

    if(Game.map[this.pPos.y + 1][this.pPos.x] == 1)
    {
        if(this.y + this.r > (this.pPos.y + 1)*10)
        {
            this.acc.y = Math.abs(this.acc.y) * -Game.bounciness;
            this.y = (this.pPos.y + 1)*10 - this.r - 0.1;
        }
    }

    if(Game.map[this.pPos.y - 1][this.pPos.x] == 1)
    {
        if(this.y - this.r < (this.pPos.y)*10)
        {
            this.acc.y = Math.abs(this.acc.y) * Game.bounciness;
            this.y = (this.pPos.y)*10 + this.r + 0.1;
        }
    }   
}

//For keyboard steriing
const keyStrenght = 0.2;
function keyHandler(e)
{
    switch (e.key) {
        case 'w': 
            Game.mainPlayer.addVelocityY(-keyStrenght);
            Game.antiPlayer.addVelocityY(keyStrenght);            
            break;
        case 's': 
            Game.mainPlayer.addVelocityY(keyStrenght);    
            Game.antiPlayer.addVelocityY(-keyStrenght);            
            break;
        case 'a': 
            Game.mainPlayer.addVelocityX(-keyStrenght);
            Game.antiPlayer.addVelocityX(-keyStrenght);            
            break;
        case 'd': 
            Game.mainPlayer.addVelocityX(keyStrenght);
            Game.antiPlayer.addVelocityX(keyStrenght);           
            break;
    
        default:
            break;
    }
}

//For sensor steriing
function orientationChange(e)
{
    Game.mainPlayer.addVelocityX(e.alpha * Game.gravity);
    Game.antiPlayer.addVelocityX(e.alpha * Game.gravity);

    Game.mainPlayer.addVelocityY((e.beta - 90) * Game.gravity);
    Game.antiPlayer.addVelocityY((e.beta - 90) * -1 * Game.gravity);
}