const bgCanvas = document.getElementById("canvas-bg");
const mainCanvas = document.getElementById("canvas-main");
const bgCtx = bgCanvas.getContext("2d");
const mainCtx = mainCanvas.getContext("2d");

mainCanvas.width = 840;
mainCanvas.height = 480;
bgCanvas.width = 840;
bgCanvas.height = 480;

const buttonUp = document.getElementById("button-up");
const buttonDown = document.getElementById("button-down");
const buttonLeft = document.getElementById("button-left");
const buttonRight = document.getElementById("button-right");
const buttonFire = document.getElementById("button-fire");
const buttonX = document.getElementById("button-x");

const mainSprites = new Image();
mainSprites.src = "./img/gameSprites.png";
const bossSprites = new Image();
bossSprites.src = "./img/bossSprites.png";
const bgSprites1 = new Image();
bgSprites1.src = "./img/bgSprites1.png";
const bgSprites2 = new Image();
bgSprites2.src = "./img/bgSprites2.png";
//for all images, sprite dimensions and game dimensions of the character is same

const bgArray2 = [0, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 0, 1, 1, 2];
const bgArray3 = [0, 1, 2, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 2, 1, 0, 1, 2, 0, 1];
const bgArray4 = [0, 1, 2, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 0, 2, 1, 0, 1, 2, 2, 1, 0, 2, 0, 1, 0];
const bgArray5 = [0, 1, 2, 2, 0, 2, 1, 1, 0, 1, 0, 0, 1, 1, 2, 1, 0, 1, 2, 2, 0, 2, 1, 1, 0, 1, 0, 0];
const bgArray6 = [2, 2, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 2, 2, 1, 1, 0, 0, 1, 1];
const bgArray7 = [0, 0, 0];
const bgArray8 = [0];

// game helper variables
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    space: {
        pressed: false
    },
    x: {
        pressed: false
    }
}
let gameOver = false;
let gamePause = false;
let isLevelDark = true;
let specialAtttack = "missile"; //3 spAtk available, "missile", "laser", "wall";
let specialCount = 3;
let lives = 4;
const maxLives = 7;
let playerScore = 0;

class InputHandler {
    constructor(level) {
        this.level = level;
        // keyboard events
        window.addEventListener("keydown", (e) => {
            e.preventDefault();  //prevents the page scrolling
            if (gameOver || !level.active || gamePause) return;
            switch (e.key) {
                case "ArrowLeft":
                    keys.ArrowLeft.pressed = true;
                    break;
                case "ArrowRight":
                    keys.ArrowRight.pressed = true;
                    break;
                case "ArrowUp":
                    keys.ArrowUp.pressed = true;
                    break;
                case "ArrowDown":
                    keys.ArrowDown.pressed = true;
                    break;
                case " ":
                    if (!keys.space.pressed) {
                        this.level.playerProjectiles.push(new Projectile(true, this.level.player));
                        keys.space.pressed = true;
                    }
                    break;
                case "X":
                case "x":
                    if (!keys.x.pressed) {
                        if (specialCount > 0) {
                            switch (specialAtttack) {
                                case "missile": this.level.playerSpecial.push(new Missile(this.level));
                                    break;
                                case "laser": this.level.playerSpecial.push(new Laser(this.level));
                                    break;
                                case "wall": this.level.playerSpecial.push(new Wall(this.level));
                                    break;
                            }
                            specialCount--;
                        }
                        keys.x.pressed = true;
                    }
                    break;
            }
        });
        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    keys.ArrowLeft.pressed = false;
                    break;
                case "ArrowRight":
                    keys.ArrowRight.pressed = false;
                    break;
                case "ArrowUp":
                    keys.ArrowUp.pressed = false;
                    break;
                case "ArrowDown":
                    keys.ArrowDown.pressed = false;
                    break;
                case " ":
                    keys.space.pressed = false;
                    break;
                case "X":
                case "x":
                    keys.x.pressed = false;
                    break;
            }
        });

        // onscreen-buttons events
        buttonLeft.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            keys.ArrowLeft.pressed = true;
        })
        buttonLeft.addEventListener("pointerup", ()=>{
            keys.ArrowLeft.pressed = false;
        })
        buttonLeft.addEventListener("pointerout", ()=>{
            keys.ArrowLeft.pressed = false;
        })

        buttonRight.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            keys.ArrowRight.pressed = true;
        })
        buttonRight.addEventListener("pointerup", ()=>{
            keys.ArrowRight.pressed = false;
        })
        buttonRight.addEventListener("pointerout", ()=>{
            keys.ArrowRight.pressed = false;
        })

        buttonUp.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            keys.ArrowUp.pressed = true;
        })
        buttonUp.addEventListener("pointerup", ()=>{
            keys.ArrowUp.pressed = false;
        })
        buttonUp.addEventListener("pointerout", ()=>{
            keys.ArrowUp.pressed = false;
        })

        buttonDown.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            keys.ArrowDown.pressed = true;
        })
        buttonDown.addEventListener("pointerup", ()=>{
            keys.ArrowDown.pressed = false;
        })
        buttonDown.addEventListener("pointerout", ()=>{
            keys.ArrowDown.pressed = false;
        })
        // firing button events
        buttonFire.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            if (!keys.space.pressed) {
                this.level.playerProjectiles.push(new Projectile(true, this.level.player));
                keys.space.pressed = true;
            }
        })
        buttonFire.addEventListener("pointerup", ()=>{
            keys.space.pressed = false;
        })
        buttonFire.addEventListener("pointerout", ()=>{
            keys.space.pressed = false;
        })

        buttonX.addEventListener("pointerdown", ()=>{
            if (gameOver || !level.active || gamePause) return;
            if (!keys.x.pressed) {
                if (specialCount > 0) {
                    switch (specialAtttack) {
                        case "missile": this.level.playerSpecial.push(new Missile(this.level));
                            break;
                        case "laser": this.level.playerSpecial.push(new Laser(this.level));
                            break;
                        case "wall": this.level.playerSpecial.push(new Wall(this.level));
                            break;
                    }
                    specialCount--;
                }
                keys.x.pressed = true;
            }
        })
        buttonX.addEventListener("pointerup", ()=>{
            keys.x.pressed = false;
        })
        buttonX.addEventListener("pointerout", ()=>{
            keys.x.pressed = false;
        })
    }
}
// Hitbox class for player, background and boss
class Hitbox {
    constructor(x, y, width, height, offsetX, offsetY, immune) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
        this.width = width;
        this.height = height;
        this.immune = immune;
    }
    update(x, y) {
        this.x = x + this.offsetX;
        this.y = y + this.offsetY;
        //this.draw();         //uncomment for debugging hitbox
    }
    draw() {
        bgCtx.fillStyle = "red";
        if (this.immune) bgCtx.fillStyle = "blue";
        bgCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Shield {
    constructor(player) {
        this.player = player;
        this.image = mainSprites
        this.x = this.player.x - 20;
        this.y = this.player.y - 20;
        this.width = 130;
        this.height = 110;
        this.spriteSize = 150;
        this.maxFrames = 2;
        this.frameXStart = 2;
        this.frameY = 0;
        if (isLevelDark) this.frameXStart = 4;
        this.frameX = this.frameXStart;
        this.spriteTimer = 0;
        this.spriteInterval = 150;
    }
    update(deltaTime) {
        this.x = this.player.x - 20;
        this.y = this.player.y - 20;

        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Player {
    constructor(level) {
        this.level = level;
        this.image = mainSprites;
        this.width = 100;      // sprite width and game width is same
        this.height = 70;
        this.x = 20;
        this.y = 220;
        this.speedX = 2.5;
        this.speedY = 3;
        this.frameX = 0;    //starting x coordinate of the box in sprite
        this.frameY = 0;    //starting y coordinate of the box in sprite  
        this.spriteSize = 150;  // size of each box(uniform all over sprite)
        if (isLevelDark) this.frameX = 1;
        this.hit = false;         // is player hit
        this.delete = false;
        this.hitbox = new Hitbox(this.x, this.y, this.width - 10, this.height - 20, 0, 10, false);
        this.shield = new Shield(this);
        this.shieldOn = true;
        this.shieldInterval = 4000;
        this.shieldTimer = 0;
    }
    update(deltaTime) {
        // shield
        if (this.shieldTimer <= this.shieldInterval) {
            this.shieldTimer += deltaTime;
            this.shield.update(deltaTime);
        }
        else this.shieldOn = false;

        // update hitbox
        this.hitbox.update(this.x, this.y);

        // x-axis limits
        if (keys.ArrowLeft.pressed && this.x >= 0) this.x -= this.speedX;
        if (keys.ArrowRight.pressed && this.x <= mainCanvas.width - this.width) this.x += this.speedX;
        else this.x += 0;
        // y-axis limits
        if (keys.ArrowUp.pressed && this.y >= 50) this.y -= this.speedY;
        if (keys.ArrowDown.pressed && this.y <= mainCanvas.height - this.height) this.y += this.speedY;
        else this.y += 0;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Projectile {
    constructor(isPlayer, object) {
        this.object = object;
        this.isPlayer = isPlayer;  //boolean to differentiate enemy and player
        this.width = 20;
        this.height = 10;
        if (isPlayer) {
            this.x = this.object.x + this.object.width;
            this.y = this.object.y + this.object.height * 0.5 - this.height * 0.5;
            this.speed = 3;
        } else {
            this.x = this.object.x;
            this.y = this.object.y + this.object.height * 0.5 - this.height * 0.5;
            this.speed = -object.speedX - 1;
        }
        this.delete = false;
    }
    update() {
        this.x += this.speed;
        if (this.x >= mainCanvas.width || this.x < 0) this.delete = true;
        this.draw();
    }
    draw() {
        mainCtx.fillStyle = "#282828";
        if (isLevelDark) mainCtx.fillStyle = "#aad69c";
        mainCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}
// Special Power Ups
class PowerUp {
    constructor(x, y, speedX, speedY, movement, range, xbreak) {
        this.image = mainSprites;
        this.isPowerUp = true;
        this.width = 80;
        this.height = 70;
        this.x = x;
        this.y = y;
        this.spriteSize = 150;
        this.maxFrames = 2;
        this.frameXStart = 4;
        this.frameY = 6;
        if (isLevelDark) this.frameY = 7;
        this.frameX = this.frameXStart;
        this.delete = false;      // powerUp marked for deletion;
        this.speedX = speedX;
        this.speedY = speedY;
        this.movement = movement;
        this.range = range;
        this.xbreak = xbreak;
        this.angle = 0;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = 300;
        this.hit = false;  // flag for single collision else multiple power added

        //randomizing the power up awarded to the player
        this.randomize = Math.random();
        if (this.randomize < 0.25) this.powerup = "life";
        else if (this.randomize < 0.5) this.powerup = "missile";
        else if (this.randomize < 0.75) this.powerup = "laser";
        else this.powerup = "wall";
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        //movement
        switch (this.movement) {
            case "wave":
                this.x -= this.speedX;
                this.y = this.xbreak + this.range * Math.sin(this.angle);
                this.angle += this.speedY;
                break;

            case "linear":
            default:
                this.x -= this.speedX;
        }

        // garbage collection
        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Missile {
    constructor(level) {
        this.image = mainSprites;
        this.spriteX = 900;
        this.spriteY = 0;
        if (isLevelDark) this.spriteY = 150;
        this.level = level;
        this.width = 50;
        this.height = 30;
        this.x = this.level.player.x + this.level.player.width;
        this.y = this.level.player.y + this.level.player.height * 0.5 - this.height * 0.5;
        this.targetSet = false;
        this.target = null;
        this.speedX = 3;
        this.speedY = 0;
        this.delete = false;
        this.damage = 50;
        this.specialType = "missile";
        this.hit = false;
    }
    update() {
        // setting the target
        if (!this.targetSet) {
            this.level.enemies.forEach(enemy => {
                if (enemy.x > this.x + 40 && !this.targetSet) {
                    this.target = enemy;
                    this.targetSet = true;
                    this.speedX = 4;
                }
            });
        }

        if (this.target != null) {
            // unsetting target
            if (this.target.delete || this.target.x + this.target.width < this.x) {
                this.targetSet = false;
                this.speedX = 3;
            }

            // following target
            if (this.y >= this.target.y + this.target.height * 0.5) this.speedY = -5;
            else if (this.y + this.height * 0.5 <= this.target.y) this.speedY = 5;
            else this.speedY = 0;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x >= 840) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Laser {
    constructor(level) {
        this.level = level;
        this.x = this.level.player.x + this.level.player.width;
        this.y = this.level.player.y + this.level.player.height * 0.5 - 5;
        this.width = 600;
        this.height = 10;
        this.duration = 500;
        this.timer = 0;
        this.delete = false;
        this.hit = false;   //helper for score deduction for boss
        this.damage = 100;
        this.specialType = "laser";
    }
    update(deltaTime) {
        if (this.timer < this.duration) {
            this.draw();
            this.timer += deltaTime;
        }
        else this.delete = true;
    }
    draw() {
        if (isLevelDark) mainCtx.fillStyle = "#aad69c";
        else mainCtx.fillStyle = "#282828";

        mainCtx.fillRect(this.x, this.y - 10, 10, 10);
        mainCtx.fillRect(this.x, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 10, this.y, this.width, this.height);
    }
}
class Wall {
    constructor(level) {
        this.level = level;
        this.x = this.level.player.x + this.level.player.width;
        this.y = 50;
        this.width = 10;
        this.height = 430;
        this.speed = 4;
        this.hit = false;
        this.delete = false;
        this.damage = 100;
        this.specialType = "wall";
    }
    update() {
        this.x += this.speed;
        if (this.x > 840) this.delete = true;
        this.draw();
    }
    draw() {
        if (isLevelDark) mainCtx.fillStyle = "#aad69c";
        else mainCtx.fillStyle = "#282828";

        mainCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class EnemyMissile {
    constructor(boss) {
        this.boss = boss;
        this.x = this.boss.x;
        this.y = this.boss.y + this.boss.height * 0.5;
        this.width = 50;
        this.height = 30;
        this.target = currentLevel.player;
        this.speedX = 3;
        this.speedY = 0;
        this.delete = false;
    }
    update() {
        // seeking missile targeting the player
        if (this.y >= this.target.y + this.target.height * 0.5) this.speedY = -3;
        else if (this.y + this.height * 0.5 <= this.target.y) this.speedY = 3;
        else this.speedY = 0;

        this.x -= this.speedX;
        this.y += this.speedY;

        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.fillStyle = "#282828";
        mainCtx.fillRect(this.x, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 10, this.y, 20, 30);
        mainCtx.fillRect(this.x + 30, this.y + 10, 10, 10);
        mainCtx.fillRect(this.x + 40, this.y, 10, 30);
    }
}
//Explosion effect
class Explosion {
    constructor(x, y) {
        this.image = mainSprites;
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
        this.spriteSize = 150;
        this.maxFrames = 5;
        this.frames = 1;
        this.staggeredFrames = 5;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 8;
        if (isLevelDark) this.frameY = 9;
        this.delete = false;
    }
    update() {
        if (this.frames % this.staggeredFrames === 0) {
            this.frameX++;
            this.frames = 1;
        }
        else this.frames++;

        if (this.frameX >= this.maxFrames) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

//enemy classes
class Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        this.image = mainSprites;
        this.x = x;
        this.y = y;
        this.spriteSize = 150;
        this.hp = hp;
        this.score = this.hp;
        this.shoots = shoots;    // boolean; whether the enemy shoots back
        this.speedX = speedX;      // enemy speed x direction
        this.speedY = speedY;       // enemy speed y direction || angle speed for sin
        this.movement = movement;   // string: type of movement
        this.range = range;     // y axis range of enemy movement || 2nd break point on x axis for z movement
        this.xbreak = xbreak;   // x coordinate where the enemy starts z movement || the base on y for sinusoid
        this.delete = false;    // Enemy marked for Deletion
        this.angle = 0;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = Math.floor(Math.random() * 80) + 120;
        this.fireTimer = 0;       // projectile firing timer
        this.fireInteval = Math.floor(Math.random() * 2000) + 1000;   // projectile random firing interval b/w 1500 and 3500ms     
        this.hit = false;
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX - this.frameXStart >= this.maxFrames) this.frameX = this.frameXStart;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // projectile generation
        if (this.shoots) {
            if (this.fireTimer > this.fireInteval) {
                currentLevel.enemyProjectiles.push(new Projectile(false, this));
                this.fireTimer = 0;
            }
            else this.fireTimer += deltaTime;
        }
        //movement
        switch (this.movement) {
            case "wave":
                this.x -= this.speedX;
                this.y = this.xbreak + this.range * Math.sin(this.angle);
                this.angle += this.speedY;
                break;

            case "zigzag":
                this.x -= this.speedX;
                if (this.x < this.xbreak && this.x >= this.range) this.y += this.speedY;
                break;

            case "mini1":    // mini boss 1 in level 3
                if (this.x > this.xbreak) this.x -= this.speedX;
                else {
                    if (this.y > 330 || this.y < 70) this.speedY *= -1;
                    this.y += this.speedY;
                }
                break;

            case "mini2":    // mini boss 2 in level 5
                if (this.x > this.xbreak) this.x -= this.speedX;
                else {
                    if (this.y > 430 || this.y < 150) this.speedY *= -1;
                    this.y += this.speedY;
                }
                break;

            case "linear":
            default:
                this.x -= this.speedX;
        }

        // garbage collection
        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Meteor extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 100;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        this.frameX = this.frameXStart;
        this.frameY = 1;
    }
}
class Triship extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 60;
        this.height = 70;
        this.maxFrames = 2;
        this.frameXStart = 2;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 1;
    }
}
class Squid extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 80;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}
class Shuttle extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 2;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}
class Saucer extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 4;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 2;
    }
}
class Tadpole extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 90;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 3;
    }
}
class Kraken extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 70;
        this.height = 80;
        this.maxFrames = 1;
        this.frameXStart = 4;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 3;
    }
}
class Marble1 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 50;
        this.maxFrames = 1;
        this.frameXStart = 0;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}
class Marble2 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 40;
        this.maxFrames = 1;
        this.frameXStart = 1;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}
class Marble3 extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 50;
        this.height = 30;
        this.maxFrames = 1;
        this.frameXStart = 3;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 4;
    }
}
class Beetle extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 80;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 5;
    }
}
class Rock extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 70;
        this.height = 70;
        this.maxFrames = 1;
        this.frameXStart = 4;
        this.frameX = this.frameXStart;
        this.frameY = 5;
    }
}
class Flipper extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 60;
        this.height = 60;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 6;
    }
}
class Dragonfly extends Enemy {
    constructor(hp, x, y, shoots, speedX, speedY, movement, range, xbreak) {
        super(hp, x, y, shoots, speedX, speedY, movement, range, xbreak);
        this.width = 100;
        this.height = 50;
        this.maxFrames = 2;
        this.frameXStart = 0;
        if (isLevelDark) this.frameXStart += this.maxFrames;
        this.frameX = this.frameXStart;
        this.frameY = 7;
    }
}
class Torpedo {
    constructor(x, y, offsetX, offsetY) {
        this.image = mainSprites;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = 70;
        this.height = 50;
        this.x = x + offsetX;
        this.y = y + offsetY;
        this.delete = false;
        this.hp = 150;
        this.torpToggle = true;    // toggling torpedoes up and down
    }
    update(x) {
        if (this.hp <= 0) {
            this.x -= 7;
        } else {
            this.x = x + this.offsetX;
        }
        if (this.x + this.width < 0) this.delete = true;

        this.draw();
    }
    draw() {
        mainCtx.drawImage(this.image, 900, 300, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

// Boss Classes
class Boss {
    constructor() {
        this.image = bossSprites;
        this.isBoss = true;
        this.spriteTimer = 0;     //sprite animation helper
        this.spriteInterval = 200;
        this.fireTimer = 0;       // projectile firing timer
        this.spriteSize = 400;
        this.frameX = 0;
        this.maxFrames = 2;
        this.speedX = 2;
        this.speedY = 1.5;
        this.supportEnemies = [];
        this.chargeType = 0;     // 0: no charge, 1: fwd , 2: back and then fwd
        this.xMin = 20;
        this.charge = false;
        this.retreat = false;
        this.chargeTimer = 0;
        this.chargeInterval = 9000;
        this.support = false;
        this.delete = false;
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;
            if (this.frameX >= this.maxFrames) this.frameX = 0;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // projectile generation
        if (this.fireTimer > this.fireInteval) {
            currentLevel.enemyProjectiles.push(new Projectile(false, this));
            this.fireTimer = 0;
        }
        else this.fireTimer += deltaTime;


        // movement
        if (!this.charge && !this.retreat) {
            //entry and basic movement;
            if (this.x > this.xbreak + 1) this.x -= this.speedX;
            else if (this.x < this.xbreak - 1) this.x += this.speedX;
            else {
                if (this.y + this.height >= this.yMax || this.y <= this.yMin) this.speedY *= -1;
                this.y += this.speedY;
            }
        }
        if (this.chargeTimer > this.chargeInterval) {
            switch (this.chargeType) {
                case 1: this.charge = true;
                    break;
                case 2: this.retreat = true;
                    break;
                case 0: this.charge = false;
                    break;
            }
            this.chargeTimer = 0;
        }
        else this.chargeTimer += deltaTime;

        if (this.retreat) {
            this.retreatMovement();
        }

        if (this.charge) {
            this.chargeMovement();
        }

        //update hitbox
        this.hitbox.forEach(hb => hb.update(this.x, this.y));

        // support ship generation, collision, and deletion
        if (this.support) {
            if (this.supportTimer >= this.supportInterval) {
                this.supportGen();
                this.supportTimer = 0;
            } else this.supportTimer += deltaTime;

            this.supportEnemies.forEach((e, i) => {
                currentLevel.playerProjectiles.forEach(pp => {
                    if (checkCollision(pp, e)) {
                        e.hp -= 10;
                        if (e.hp <= 0) e.delete = true;
                        pp.delete = true;
                    }
                });
                currentLevel.playerSpecial.forEach(sp => {
                    if (checkCollision(sp, e)) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                        if (sp.specialType === "missile") sp.delete = true;
                    }
                });
                // collision detection with player and shield
                if (currentLevel.player.shieldOn) {
                    if (checkCollision(currentLevel.player.shield, e)) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                    }
                }
                else if (checkCollision(currentLevel.player, e)) {
                    if (!currentLevel.player.hit) {
                        currentLevel.player.hit = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                        e.delete = true;
                        currentLevel.playerDead();
                    }
                }
                e.update(deltaTime);
                if (e.delete) this.supportEnemies.splice(i, 1);
            });
        }

        // draw
        this.draw();
    }
    chargeMovement() {
        if (this.x > this.xMin) this.x -= 4;
        else this.charge = false;
    }
    retreatMovement() {
        if (this.x <= 840) this.x += 2
        else {
            this.retreat = false;
            this.charge = true;
            this.y = this.chargeY;
        }
    }
    draw() {
        mainCtx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Boss1 extends Boss {
    constructor() {
        super();
        this.width = 200;
        this.height = 230;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 50, this.height - 30, 50, 0, false)];
        this.xbreak = 550;
        this.hp = 200;
        this.score = 100;
        this.delete = false;
        this.frameY = 0;
        this.yMin = 50;
        this.yMax = 480;
        this.fireInteval = 1500;
    }
}
class Boss2 extends Boss {
    constructor() {
        super();
        this.width = 230;
        this.height = 210;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 50, this.height - 10, 50, 0, false)];
        this.xbreak = 550;
        this.hp = 200;
        this.score = 100;
        this.delete = false;
        this.frameY = 1;
        this.yMin = 50;
        this.yMax = 480;
        this.fireInteval = 1500;
    }
}
class Boss3 extends Boss {
    constructor() {
        super();
        this.width = 220;
        this.height = 200;
        this.x = 840;
        this.y = 120;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 10, this.height - 10, 10, 10, false)];
        this.xbreak = 500;
        this.hp = 300;
        this.score = 100;
        this.delete = false;
        this.frameY = 2;
        this.yMin = 50;
        this.yMax = 340;
        this.fireInteval = 1500;
        this.chargeType = 1;
    }
}
class Boss4 extends Boss {
    constructor() {
        super();
        this.width = 150;
        this.height = 250;
        this.x = 840;
        this.y = 120;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width, 70, 0, 0, false),
            new Hitbox(this.x, this.y, 100, 140, 50, 70, false)
        ];
        this.xbreak = 550;
        this.hp = 250;
        this.score = 100;
        this.delete = false;
        this.frameY = 3;
        this.yMin = 50;
        this.yMax = 450;
        this.fireInteval = 1500;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 3000;
    }
    supportGen() {
        currentLevel.enemyProjectiles.push(new EnemyMissile(this));
    }
}
class Boss5 extends Boss {
    constructor() {
        super();
        this.width = 190;
        this.height = 210;
        this.x = 840;
        this.y = 220;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 10, this.height - 10, 10, 10, false)];
        this.xbreak = 500;
        this.hp = 350;
        this.score = 100;
        this.delete = false;
        this.frameY = 4;
        this.yMin = 210;
        this.yMax = 480;
        this.fireInteval = 1500;
        this.chargeType = 1;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Beetle(20, this.x, this.y + Math.random() * (this.height - 50), false, 3, 0, "linear", 0, 0));
    }
}
class Boss6 extends Boss {
    constructor() {
        super();
        this.width = 200;
        this.height = 190;
        this.x = 840;
        this.y = 220;
        this.hitbox = [new Hitbox(this.x, this.y, this.width - 30, this.height, 30, 0, false)];
        this.xbreak = 500;
        this.hp = 350;
        this.score = 100;
        this.delete = false;
        this.frameY = 5;
        this.yMin = 140;
        this.yMax = 480;
        this.fireInteval = 1500;
        this.speedX = 3;
        this.chargeY = 270;
        this.chargeInterval = 12000;
        this.chargeType = 2;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Tadpole(20, this.x, this.y + Math.random() * (this.height - 50), false, 3, 0, "linear", 0, 0));
    }
}
class Boss7 extends Boss {
    constructor() {
        super();
        this.width = 300;
        this.height = 250;
        this.x = 840;
        this.y = 120;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width - 20, 120, 20, 10, false),
            new Hitbox(this.x, this.y, 220, this.height - 20, 80, 10, false),
            new Hitbox(this.x, this.y, this.width, 50, 0, 200, false)
        ];
        this.xbreak = 550;
        this.hp = 300;
        this.score = 100;
        this.delete = false;
        this.frameY = 6;
        this.yMin = 50;
        this.yMax = 400;
        this.fireInteval = 1500;
        this.chargeY = 60;
        this.chargeInterval = 12000;
        this.chargeType = 2;
        this.support = true;
        this.supportTimer = 0;
        this.supportInterval = 4000;
    }
    supportGen() {
        this.supportEnemies.push(new Flipper(20, this.x, this.y + Math.random() * (this.height - 60), false, 3, 0, "linear", 0, 0));
    }
}
class Boss8 extends Boss {
    constructor() {
        super();
        this.width = 380;
        this.height = 380;
        this.x = 840;
        this.y = 50;
        this.hitbox = [
            new Hitbox(this.x, this.y, this.width - 20, 120, 20, 10, true),
            new Hitbox(this.x, this.y, 100, 60, 100, 130, true),
            new Hitbox(this.x, this.y, 100, 60, 100, 220, true),
            new Hitbox(this.x, this.y, 90, 100, 210, 150, false)
        ];
        this.xbreak = 460;
        this.hp = 250;
        this.score = 100;
        this.delete = false;
        this.frameY = 7;
        this.fireTimer = 0;
        this.fireInteval = 3000;
        this.torpedoes = [
            new Torpedo(this.x, this.y, 50, 150),
            new Torpedo(this.x, this.y, 30, 220),
        ];
        this.retreat = false;
        this.retreatTimer = 0;
        this.retreatInterval = 6000;
        this.retreatFire = false;   // to trigger retreat swarm only once
    }
    update(deltaTime) {
        //sprite animation
        if (this.spriteTimer > this.spriteInterval) {
            this.frameX++;

            this.torpedoes.forEach(torp => {
                if (torp.hp > 0) {
                    if (torp.torpToggle) {
                        torp.y += 10;
                        torp.torpToggle = !torp.torpToggle;
                    } else {
                        torp.y -= 10;
                        torp.torpToggle = !torp.torpToggle;
                    }
                }
            });

            if (this.frameX >= this.maxFrames) this.frameX = 0;
            this.spriteTimer = 0;
        } else this.spriteTimer += deltaTime;

        // torpedo
        this.torpedoes.forEach((torp, i) => {
            currentLevel.playerProjectiles.forEach(pp => {
                if (checkCollision(pp, torp)) {
                    torp.hp -= 5;
                    pp.delete = true;
                }
            });
            currentLevel.playerSpecial.forEach(sp => {
                if (checkCollision(sp, torp)) {
                    if (!sp.hit) {
                        sp.hit = true;
                        if (sp.specialType === "missile") {
                            sp.delete = true;
                            torp.hp -= 30;
                        }
                        else torp.hp -= 50;
                    }
                }
            });
            torp.update(this.x);
            if (torp.delete) this.torpedoes.splice(i, 1);
        });

        // projectile generation aka support ships
        if (this.fireTimer >= this.fireInteval && !this.retreat) {
            this.supportEnemies.push(new Triship(30, this.x, 240, false, 3, 0, "linear", 0, 0));
            this.fireTimer = 0;
        } else this.fireTimer += deltaTime;

        this.supportEnemies.forEach((e, i) => {
            currentLevel.playerProjectiles.forEach(pp => {
                if (checkCollision(pp, e)) {
                    e.hp -= 10;
                    if (e.hp <= 0) {
                        e.delete = true;
                        currentLevel.explosions.push(new Explosion(e.x, e.y));
                    }
                    pp.delete = true;
                }
            });
            currentLevel.playerSpecial.forEach(sp => {
                if (checkCollision(sp, e)) {
                    e.delete = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                    if (sp.specialType === "missile") sp.delete = true;
                }
            });
            // collision detection with player and shield
            if (currentLevel.player.shieldOn) {
                if (checkCollision(currentLevel.player.shield, e)) {
                    e.delete = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                }
            }
            else if (checkCollision(currentLevel.player, e)) {
                if (!currentLevel.player.hit) {
                    currentLevel.player.hit = true;
                    currentLevel.explosions.push(new Explosion(e.x, e.y));
                    e.delete = true;
                    currentLevel.playerDead();
                }
            }
            e.update(deltaTime);
            if (e.delete) this.supportEnemies.splice(i, 1);
        });

        // forward movement
        this.speedX = 0.105 * deltaTime;
        if (this.x > this.xbreak && !this.retreat) this.x -= this.speedX;

        // Retreat when both the torpedoes are fired & dragonfly swarm
        if (this.torpedoes.length === 0) {
            if (this.retreatTimer > this.retreatInterval && !this.retreat) {
                this.retreat = true;
                this.retreatTimer = 0;
            }
            if (this.retreat && this.x <= 840) {
                this.x += 2;    // retreat back out of the screen
            } else if (!this.retreatFire && this.retreat) {
                this.supportEnemies.push(new Dragonfly(40, 1040, 60, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 60, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 120, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 120, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 180, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 180, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1040, 240, false, 4, 0, "linear", 0, 0));
                this.supportEnemies.push(new Dragonfly(40, 1150, 240, false, 4, 0, "linear", 0, 0));
                this.retreatFire = true;
            }

            if (this.retreat && this.retreatTimer > this.retreatInterval) {
                this.retreat = false;
                this.retreatFire = false;
                this.retreatTimer = 0;
            }
            this.retreatTimer += deltaTime;
        }

        //update hitbox
        this.hitbox.forEach(hb => hb.update(this.x, this.y));

        this.draw();
    }
}

// UI class for displaying lives, spAtk and score;
class UI {
    constructor() {
        this.image = mainSprites;
        this.frameX = 6;       // grid x on spritesheet
        this.heartY = 3;       // grid y on spritesheet
        this.missileY = 0;
        this.laserY = 5;
        this.wallY = 7;
        if (isLevelDark) {
            this.heartY++;
            this.missileY++;
            this.laserY++;
            this.wallY++;
        }
        this.spriteSize = 150;
        this.width = 50;
        this.height = 40;
    }
    draw() {
        // drawing hearts for lives
        for (let i = 0; i < lives; i++) {
            bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.heartY * this.spriteSize, this.width, this.height, i * 55 + 5, 5, this.width, this.height);
        }

        // drawing special Attack and the counts remining;
        switch (specialAtttack) {
            case "missile": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.missileY * this.spriteSize, this.width, this.height, 400, 10, this.width, this.height);
                break;
            case "laser": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.laserY * this.spriteSize, this.width, this.height, 400, 5, this.width, this.height);
                break;
            case "wall": bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.wallY * this.spriteSize, this.width, this.height, 400, 5, this.width, this.height);
                break;
        }
        bgCtx.save();
        if (isLevelDark) bgCtx.fillStyle = "#aad69c";
        else bgCtx.fillStyle = "#282828";
        bgCtx.font = "bold 52px Silkscreen";
        bgCtx.fillText(specialCount.toString().padStart(2, "0"), 460, 45);

        //score
        bgCtx.fillText(playerScore.toString().padStart(5, "0"), 600, 45);
        bgCtx.restore();
    }
}
// Star Particle effect in the home screen
class Particle {
    constructor() {
        this.initialX = Math.floor(Math.random() * 440) + 200;
        this.initialY = Math.floor(Math.random() * 280) + 100;
        this.x = this.initialX;
        this.y = this.initialY;
        this.speedX = Math.abs(420 - this.x) * 0.0025;
        this.speedY = Math.random() * 0.3;
        if(this.initialX <= bgCanvas.width * 0.5) this.speedX *= -1;
        if(this.initialY <= bgCanvas.height * 0.5) this.speedY *= -1;
        this.radius = Math.random() * 2;
        this.color = "white";
        this.opacity = 0.001;
        this.increase = Math.random() * 0.01 + 0.001;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.increase;
        if(this.x < 0 || this. x > 840 || this.y < 0 || this.y > 480){
            this.x = this.initialX;
            this.y = this.initialY;
            this.opacity = 0.001;
        }
        this.draw();
    }
    draw() {
        bgCtx.save();
        bgCtx.globalAlpha = this.opacity;
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        bgCtx.fillStyle = this.color;
        bgCtx.fill();
        bgCtx.closePath();
        bgCtx.restore();
    }
}
const particles = [];
for(let i = 0; i< 100; i++){
    particles.push(new Particle());
}

// Background classes
class Background {
    constructor(level, frameX) {
        this.level = level;
        this.frameX = frameX;
        this.speed = 0;
        this.hitbox = [];
    }
    update(deltaTime) {
        if (!this.level.bgStop) {
            this.speed = 0.105 * deltaTime;  // 0.105 comes from 840px in 8000ms.
            this.x -= this.speed;
        }
        this.hitbox.forEach(hb => hb.update(this.x, this.y));
        if (this.x + this.width < 0) this.delete = true;
        this.draw();
    }
    draw() {
        bgCtx.drawImage(this.image, this.frameX * this.spriteSize, this.spriteY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}
class Background2 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 0;           // y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        switch (frameX) {
            case 0: this.height = 160;
                break;
            case 1: this.height = 80;
                break;
            case 2: this.height = 60;
                break;
        }
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
    }
}
class Background3 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 200;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        this.hitbox = [];
        switch (frameX) {
            case 0: this.height = 70;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 10, 0, 10, false));
                break;
            case 1: this.height = 80;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 2: this.height = 160;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 60, 0, 100, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 30, 130, 60, 30, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 100, 150, 90, 10, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 120, 230, 40, false));
                break;
        }
        this.delete = false;    // marked for deletion
    }
}
class Background4 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 400;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        switch (frameX) {
            case 0: this.height = 70;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 1: this.height = 80;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, this.height - 20, 0, 20, false));
                break;
            case 2: this.height = 160;
                this.y = bgCanvas.height - this.height;
                this.hitbox.push(new Hitbox(this.x, this.y, this.width, 60, 0, 100, false));
                this.hitbox.push(new Hitbox(this.x, this.y, 60, 150, 100, 10, false));
        }
        this.delete = false;    // marked for deletion
    }
}
class Background5 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites1;
        this.spriteY = 600;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 320;
        this.x = this.width * index;
        this.y = 50;
        switch (frameX) {
            case 0: this.height = 170;
                break;
            case 1: this.height = 80;
                break;
            case 2: this.height = 50;
                break;
        }
        this.hitbox.push(new Hitbox(this.x, this.y, this.width - 40, this.height - 5, 20, 0, false));
        this.delete = false;    // marked for deletion
    }
}
class Background7 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites2;
        this.spriteY = 0;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 2800;
        this.height = 160;
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
        this.hitbox = [
            new Hitbox(this.x, 430, this.width, 50, 0, 110, false),
            new Hitbox(this.x, this.y, 60, 150, 1880, 10, false),
            new Hitbox(this.x, this.y, 60, 150, 2200, 10, false)
        ];
    }
}
class Background8 extends Background {
    constructor(level, frameX, index) {
        super(level, frameX);
        this.image = bgSprites2;
        this.spriteY = 200;           //y position in px on sprite sheet
        this.spriteSize = 400;
        this.width = 2800;
        this.height = 160;
        this.x = this.width * index;
        this.y = bgCanvas.height - this.height;
        this.delete = false;    // marked for deletion
        this.hitbox = [
            new Hitbox(this.x, 430, this.width, 50, 0, 110, false),
            new Hitbox(this.x, this.y, 110, 100, 670, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 780, 10, false),
            new Hitbox(this.x, this.y, 110, 100, 990, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 1100, 10, false),
            new Hitbox(this.x, this.y, 110, 100, 1950, 60, false),
            new Hitbox(this.x, this.y, 100, 150, 2060, 10, false)
        ];
    }
}

class Level {
    constructor(level, isDark) {
        this.active = true;
        this.number = level;     // level number
        isLevelDark = isDark;
        if (isLevelDark) bgCanvas.style.background = "#282828";
        else bgCanvas.style.background = "#aad69c";
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.ui = new UI();
        this.sourceEnemyArray = [];
        this.enemies = [];
        this.playerProjectiles = [];
        this.playerSpecial = [];      // special weapons
        this.enemyProjectiles = [];
        this.background = [];
        this.explosions = [];
        this.i = 0;         // index for global level enemy array
        this.levelTime = 0;
        this.flag = true;     // prevents index overflow of enemy array
        this.bgStop = false;  // stops background
        this.levelComplete = false;

        // create background and assigns enemy array of the current level
        switch (this.number) {
            case 1: this.sourceEnemyArray = enemiesLvl1;
                break;
            case 2: this.sourceEnemyArray = enemiesLvl2;
                bgArray2.forEach((frame, index) => this.background.push(new Background2(this, frame, index)));
                break;
            case 3: this.sourceEnemyArray = enemiesLvl3;
                bgArray3.forEach((frame, index) => this.background.push(new Background3(this, frame, index)));
                break;
            case 4: this.sourceEnemyArray = enemiesLvl4;
                bgArray4.forEach((frame, index) => this.background.push(new Background4(this, frame, index)));
                break;
            case 5: this.sourceEnemyArray = enemiesLvl5;
                bgArray5.forEach((frame, index) => this.background.push(new Background5(this, frame, index)));
                break;
            case 6: this.sourceEnemyArray = enemiesLvl6;
                bgArray6.forEach((frame, index) => this.background.push(new Background5(this, frame, index))); // lvl 5 & 6 have same bg
                break;
            case 7: this.sourceEnemyArray = enemiesLvl7;
                bgArray7.forEach((frame, index) => this.background.push(new Background7(this, frame, index)));
                break;
            case 8: this.sourceEnemyArray = enemiesLvl8;
                bgArray8.forEach((frame, index) => this.background.push(new Background8(this, frame, index)));
                break;
        }
    }
    update(deltaTime) {
        // ui draw
        this.ui.draw();

        // player update
        if (!this.player.delete) this.player.update(deltaTime);

        // player projectiles
        this.playerProjectiles.forEach(projectile => projectile.update());
        this.playerProjectiles = this.playerProjectiles.filter(projectile => !projectile.delete);

        // player special attack
        this.playerSpecial.forEach(special => special.update(deltaTime));
        this.playerSpecial = this.playerSpecial.filter(special => !special.delete);

        // pushing enemies from source array into the level enemies array
        if (this.flag && this.levelTime > this.sourceEnemyArray[this.i].time) {
            this.swarm(this.sourceEnemyArray[this.i].object);
            this.i++;
            if (this.i >= this.sourceEnemyArray.length) {
                this.flag = false;
                this.bgStop = true;
            }
        }

        //updating all the enemies, and thier collision detection
        this.enemies.forEach(enemy => {

            enemy.update(deltaTime);

            // interaction with player projectile;
            this.playerProjectiles.forEach(pp => {
                if (enemy.isBoss) {   // for boss
                    enemy.hitbox.forEach(hb => {
                        if (checkCollision(hb, pp)) {
                            pp.delete = true;
                            if (!hb.immune) {
                                enemy.hp -= 5;
                                playerScore += 5;
                                if (enemy.hp <= 0) {
                                    playerScore += enemy.score;
                                    for (let i = 0; i < 3; i++) {  //add 3 explosions
                                        this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                    }
                                    this.levelComplete = true;
                                    enemy.delete = true;
                                }
                            }
                        }
                    });
                }
                else if (checkCollision(pp, enemy)) {   // for others
                    if (enemy.isPowerUp) pp.delete = true;
                    else {
                        pp.delete = true;
                        enemy.hp -= 10;
                        if (enemy.hp <= 0) {
                            this.explosions.push(new Explosion(enemy.x, enemy.y));
                            playerScore += enemy.score;
                            enemy.delete = true;
                        }
                    }
                }
            });

            //interaction with player special attack
            this.playerSpecial.forEach(sp => {
                if (enemy.isBoss) {         // for boss
                    enemy.hitbox.forEach(hb => {
                        if (checkCollision(hb, sp)) {
                            if (sp.specialType === "missile") sp.delete = true;
                            if (!hb.immune) {
                                if (!sp.hit) {
                                    enemy.hp -= sp.damage;
                                    sp.hit = true;
                                    playerScore += sp.damage;
                                    if (enemy.hp <= 0) {
                                        playerScore += enemy.score;
                                        for (let i = 0; i < 3; i++) {  //add 3 explosions
                                            this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                        }
                                        this.levelComplete = true;
                                        enemy.delete = true;
                                    }
                                }

                            }
                        }
                    });
                }
                else if (!enemy.isPowerUp) {  // everyone except powerup
                    if (checkCollision(sp, enemy)) {
                        if (!enemy.hit || !sp.hit) {
                            enemy.hp -= sp.damage;
                            enemy.hit = true;
                            sp.hit = true;
                            if (enemy.hp <= 0) {
                                this.explosions.push(new Explosion(enemy.x, enemy.y));
                                playerScore += enemy.score;
                                enemy.delete = true;
                            }
                        }
                        if (sp.specialType === "missile") sp.delete = true;
                    }
                }
            });

            //interaction with player and its shield
            if (enemy.isPowerUp) {
                if (checkCollision(enemy, this.player.hitbox)) {
                    enemy.delete = true;
                    if (enemy.powerup === "life") {
                        if (lives === maxLives) specialCount++;
                        else lives++;
                    }
                    else if (specialAtttack === enemy.powerup) {
                        if (specialAtttack === "wall") specialCount++;
                        else specialCount += 3;
                    }
                    else {
                        specialAtttack = enemy.powerup;
                        if (specialAtttack == "wall") specialCount = 1;
                        else specialCount = 3;
                    }
                }
            }
            else if (enemy.isBoss) {
                enemy.hitbox.forEach(hb => {
                    if (this.player.shieldOn) {   //when shieldOn check with shield
                        if (checkCollision(hb, this.player.shield)) {
                            enemy.hp -= 1;
                            playerScore += 1;
                            if (enemy.hp <= 0) {
                                playerScore += enemy.score;
                                for (let i = 0; i < 3; i++) {  //add 3 explosions
                                    this.explosions.push(new Explosion(Math.random() * enemy.width + enemy.x, Math.random() * enemy.height + enemy.y));
                                }
                                this.levelComplete = true;
                                enemy.delete = true;
                            }
                        }
                    }
                    else if (checkCollision(hb, this.player.hitbox)) {
                        if (!this.player.hit) {
                            this.player.hit = true;
                            this.explosions.push(new Explosion(this.player.x, this.player.y));
                            this.playerDead();
                        }
                    }
                });
            }
            else {
                if (this.player.shieldOn) {  //other enemies, when shield is on
                    if (checkCollision(this.player.shield, enemy)) {
                        playerScore += enemy.score;
                        this.explosions.push(new Explosion(enemy.x, enemy.y));
                        enemy.delete = true;
                    }
                }
                // other enemies when shield is off
                else if (checkCollision(enemy, this.player.hitbox)) {
                    if (!this.player.hit) {
                        this.player.hit = true;
                        this.explosions.push(new Explosion(this.player.x, this.player.y));
                        this.explosions.push(new Explosion(enemy.x, enemy.y));
                        enemy.delete = true;
                        this.playerDead();
                    }
                }
            }
        });
        this.enemies = this.enemies.filter(enemy => !enemy.delete);

        //enemy projectiles
        this.enemyProjectiles.forEach(projectile => {
            projectile.update();
            // interaction with player projectile
            this.playerProjectiles.forEach(pp => {
                if (checkCollision(projectile, pp)) {
                    this.explosions.push(new Explosion(pp.x, pp.y));
                    pp.delete = true;
                    projectile.delete = true;
                }
            });
            // interaction with player special attack
            this.playerSpecial.forEach(sp => {
                if (checkCollision(projectile, sp)) {
                    projectile.delete = true;
                }
            });
            // interaction with player 
            if (!this.player.shieldOn && checkCollision(this.player.hitbox, projectile)) {
                if (!this.player.hit && this.active) {
                    this.player.hit = true;
                    projectile.delete = true;
                    this.explosions.push(new Explosion(this.player.x, this.player.y));
                    this.playerDead();
                }
            }
            //interaction with player shield
            if (this.player.shieldOn) {
                if (checkCollision(this.player.shield, projectile)) {
                    projectile.delete = true;
                }
            }
        });
        this.enemyProjectiles = this.enemyProjectiles.filter(projectile => !projectile.delete);

        // explosions update
        this.explosions.forEach(explosion => explosion.update());
        this.explosions = this.explosions.filter(explosion => !explosion.delete);

        // background and collision detection with player and projectiles
        this.background.forEach(bg => {
            bg.update(deltaTime);
            bg.hitbox.forEach(hb => {
                if (checkCollision(this.player.hitbox, hb)) {
                    if (!this.player.hit) {
                        this.player.hit = true;
                        this.explosions.push(new Explosion(this.player.x, this.player.y));
                        this.playerDead();
                    }
                }

                this.playerProjectiles.forEach(pp => {
                    if (checkCollision(pp, hb)) {
                        pp.delete = true;
                    }
                })
            })
        });
        this.background = this.background.filter(bg => !bg.delete);

        //level complete;
        if (this.levelComplete) {
            this.active = false;
            if (this.number != 5 && this.number != 6) {
                if (this.player.y <= 55) this.player.x += 5;
                else this.player.y -= 2;
            }
            else {
                if (this.player.y + this.player.height >= 400) this.player.x += 5;
                else this.player.y += 2;
            }
            //player crosses canvas width and next level
            if (this.player.x >= 840) {
                if (this.number === 8) {
                    gameOver = true;
                }
                else if (this.number != 4 && this.number != 5) {
                    nextLevel(this.number + 1, false);
                }
                else {
                    nextLevel(this.number + 1, true);
                }
            }
        }

        this.levelTime += deltaTime;
    }
    swarm(array) {
        array.forEach(object => {
            this.enemies.push(object);
        })
    }
    playerDead() {
        this.player.delete = true;
        lives--;
        if (lives > 0) setTimeout(() => { this.player = new Player(); }, 500);
        else setTimeout(() => {
            gameOver = true;
        }, 500);
    }
}

// all level enemies source array
const enemiesLvl1 = [
    {
        time: 2000,
        object: [
            new Meteor(10, 840, 80, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1040, 80, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1240, 80, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 5000,
        object: [
            new Meteor(10, 840, 200, false, 3.5, 0, "linear", 0, 0),
            new Meteor(10, 1040, 200, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 8000,
        object: [
            new Meteor(10, 840, 200, false, 2, 0, "linear", 0, 0),
            new Meteor(10, 1040, 200, false, 2, 0, "linear", 0, 0)
        ]
    },
    {
        time: 12000,
        object: [
            new Meteor(10, 840, 300, false, 3, 0, "linear", 0, 0),
            new Meteor(10, 1040, 300, false, 3, 0, "linear", 0, 0),
            new Meteor(10, 1240, 300, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15000,
        object: [
            new Meteor(25, 840, 80, false, 3, 0, "linear", 0, 0),
            new PowerUp(950, 70, 3, 0, "linear", 0, 0),
            new Meteor(25, 1120, 80, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 21000,
        object: [
            new Triship(15, 840, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 960, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1080, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1200, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1320, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1440, 200, false, 2, 0.03, "wave", 120, 200),
            new Triship(15, 1560, 50, false, 2, 1.5, "zigzag", 300, 620),
            new Triship(15, 1680, 200, false, 2, 0.03, "wave", 120, 200)
        ]
    },
    {
        time: 35500,
        object: [new Squid(10, 840, 280, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 38000,
        object: [
            new Squid(10, 840, 70, false, 3, 0, "linear", 0, 0),
            new Squid(10, 1000, 70, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 41000,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 42500,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 44000,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 45500,
        object: [new Squid(10, 840, 200, true, 2, 0.03, "wave", 120, 200)]
    },
    {
        time: 49000,
        object: [
            new Squid(10, 840, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1040, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1240, 50, true, 3, 2, "zigzag", 300, 620),
            new Squid(10, 1440, 50, true, 3, 2, "zigzag", 300, 620)
        ]
    },
    {
        time: 57000,
        object: [new PowerUp(840, 280, 3, 0, "linear", 0, 0)]
    },
    {
        time: 61000,
        object: [
            new Shuttle(15, 840, 50, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 1000, 110, false, 2, 0, "linear", 0, 0),
            new Shuttle(15, 1100, 60, false, 2, 0, "linear", 0, 0),
            new Shuttle(15, 1300, 330, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 68000,
        object: [new Boss1()] //boss
    }
];
isLevelDark = false;//solves bug, otherwise need to declare level before
const enemiesLvl2 = [
    {
        time: 2000,
        object: [
            new Triship(15, 840, 50, false, 2, 1, "zigzag", 300, 780),
            new Triship(15, 840, 300, false, 2, -1, "zigzag", 300, 780),
            new Triship(15, 960, 50, false, 2, 1, "zigzag", 300, 780),
            new Triship(15, 960, 300, true, 2, -1, "zigzag", 300, 780),
            new Triship(15, 1080, 50, true, 2, 1, "zigzag", 300, 780),
            new Triship(15, 1080, 300, false, 2, -1, "zigzag", 300, 780)
        ]
    },
    {
        time: 8000,
        object: [
            new Saucer(20, 840, 100, false, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, false, 2, 0.03, "wave", 50, 340)
        ]
    },
    {
        time: 9000,
        object: [
            new Saucer(20, 840, 100, false, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, true, 2, 0.03, "wave", 50, 340),
            new PowerUp(840, 220, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 10000,
        object: [
            new Saucer(20, 840, 100, true, 2, 0.03, "wave", 50, 100),
            new Saucer(20, 840, 340, false, 2, 0.03, "wave", 50, 340)
        ]
    },
    {
        time: 13000,
        object: [
            new Squid(15, 840, 50, true, 2, 1, "zigzag", 250, 780),
            new Squid(15, 1200, 130, true, 3, 0.07, "wave", 40, 130),
            new Squid(15, 1200, 350, true, 2, 0.05, "wave", 40, 350),
            new Squid(15, 1800, 240, true, 3, 0, "linear", 0, 0),
            new Squid(15, 2000, 120, true, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 21000,
        object: [
            new Squid(15, 840, 240, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 170, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 310, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 100, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 380, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 24000,
        object: [
            new Squid(15, 840, 240, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 170, false, 3, 0, "linear", 0, 0),
            new Squid(15, 940, 310, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 100, false, 3, 0, "linear", 0, 0),
            new Squid(15, 1040, 380, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 28000,
        object: [
            new Shuttle(25, 840, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 960, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1080, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1200, 250, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1320, 250, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 30000,
        object: [
            new Shuttle(25, 840, 70, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1040, 70, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1240, 250, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1440, 220, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1640, 150, false, 3, 0, "linear", 0, 0),
            new Shuttle(25, 1840, 220, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 38000,
        object: [new Boss2()]  //boss
    }
];
const enemiesLvl3 = [
    {
        time: 2000,
        object: [
            new Tadpole(15, 840, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1020, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1200, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1380, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1560, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1740, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 1920, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 2100, 50, true, 2, 1, "zigzag", 250, 750),
            new Tadpole(15, 2280, 50, true, 2, 1, "zigzag", 250, 750)
        ]
    },
    {
        time: 16000,
        object: [
            new Saucer(15, 840, 280, false, 4, 0, "linear", 0, 0),
            new Saucer(15, 1040, 280, false, 4, 0, "linear", 0, 0),
            new Saucer(15, 1240, 280, false, 4, 0, "linear", 0, 0),
            new PowerUp(1340, 280, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 22000,
        object: [
            new Squid(20, 840, 180, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 120, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 240, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 60, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 300, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 26000,
        object: [
            new Squid(20, 840, 180, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 120, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1000, 240, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 60, false, 4, 0, "linear", 0, 0),
            new Squid(20, 1160, 300, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 30000,
        object: [new Marble1(20, 840, 110, true, 3, 0.04, "wave", 50, 110)]
    },
    {
        time: 30300,
        object: [new Marble2(20, 840, 110, true, 3, 0.04, "wave", 50, 110)]
    },
    {
        time: 30600,
        object: [
            new Marble3(20, 840, 110, true, 3, 0.04, "wave", 50, 110),
            new Marble1(20, 840, 270, true, 3, 0.04, "wave", 50, 270)
        ]
    },
    {
        time: 30900,
        object: [new Marble2(20, 840, 270, true, 3, 0.04, "wave", 50, 270)]
    },
    {
        time: 31200,
        object: [new Marble3(20, 840, 270, true, 3, 0.04, "wave", 50, 270)]
    },
    {
        time: 33000,
        object: [new Kraken(150, 840, 150, true, 3, 2, "mini1", 0, 480)]
    },
    {
        time: 51000,
        object: [new Boss3()]   //boss
    }
];
const enemiesLvl4 = [
    {
        time: 2000,
        object: [
            new Beetle(15, 840, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 990, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1140, 50, false, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1290, 50, true, 3, 1, "zigzag", 700, 800),
            new Beetle(15, 1440, 50, false, 3, 1, "zigzag", 700, 800)
        ]
    },
    {
        time: 6000,
        object: [
            new Beetle(15, 840, 50, true, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 990, 50, false, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1140, 50, true, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1290, 50, false, 3, 2, "zigzag", 400, 700),
            new Beetle(15, 1440, 50, true, 3, 2, "zigzag", 400, 700)
        ]
    },
    {
        time: 10000,
        object: [
            new Beetle(15, 840, 270, true, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 990, 270, true, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1140, 270, false, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1290, 270, false, 3, -2, "zigzag", 370, 700),
            new Beetle(15, 1440, 270, true, 3, -2, "zigzag", 370, 700)
        ]
    },
    {
        time: 14500,
        object: [new Shuttle(15, 840, 250, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 17500,
        object: [
            new Shuttle(15, 840, 120, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 980, 120, false, 3, 0, "linear", 0, 0),
            new Shuttle(15, 1120, 120, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 20500,
        object: [new Shuttle(25, 840, 250, false, 3, 0, "linear", 0, 0)]
    },
    {
        time: 24000,
        object: [
            new Shuttle(15, 840, 180, false, 4, 0, "linear", 0, 0),
            new Shuttle(15, 980, 180, false, 4, 0, "linear", 0, 0),
            new Shuttle(15, 1120, 180, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 29300,
        object: [new PowerUp(840, 180, 1.788, 0.07, "wave", 80, 180)]
    },
    {
        time: 36000,
        object: [
            new Rock(80, 840, 130, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1040, 180, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1240, 240, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1440, 90, false, 2, 0, "linear", 0, 0),
            new Rock(80, 1640, 250, false, 2, 0, "linear", 0, 0)
        ]
    },
    {
        time: 50500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 51000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 51500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 52000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 52500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 53000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 53500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 54000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 54500,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 90, 190)]
    },
    {
        time: 58000,
        object: [
            new Triship(20, 840, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 940, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1160, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1260, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1480, 50, true, 3, 3, "zigzag", 600, 800),
            new Triship(20, 1580, 50, true, 3, 3, "zigzag", 600, 800)
        ]
    },
    {
        time: 66500,
        object: [new Boss4()] //boss
    }
];
isLevelDark = true;
const enemiesLvl5 = [
    {
        time: 2000,
        object: [
            new Marble3(15, 840, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1000, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1160, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1320, 440, true, 2.8, -2, "zigzag", 300, 600),
            new Marble3(15, 1480, 440, true, 2.8, -2, "zigzag", 300, 600)
        ]
    },
    {
        time: 4000,
        object: [
            new Marble3(15, 840, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1000, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1160, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1320, 410, false, 3.5, 0, "linear", 0, 0),
            new Marble3(15, 1480, 410, false, 3.5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 9500,
        object: [new Kraken(100, 840, 390, true, 2, -3, "zigzag", 500, 600)]
    },
    {
        time: 16000,
        object: [new PowerUp(840, 300, 2, 0.07, "wave", 100, 300)]
    },
    {
        time: 21000,
        object: [
            new Tadpole(15, 840, 320, true, 3, 0.07, "wave", 110, 320),
            new Tadpole(15, 940, 320, true, 2, 0.05, "wave", 110, 320),
            new Tadpole(15, 1040, 320, false, 2, 0.08, "wave", 110, 320),
            new Tadpole(15, 1140, 320, false, 3, 0.03, "wave", 110, 320),
            new Tadpole(15, 1240, 320, true, 3, 0.09, "wave", 110, 320),
            new Tadpole(15, 1340, 320, false, 2, 0.04, "wave", 110, 320),
            new Tadpole(15, 1440, 320, false, 3, 0.06, "wave", 110, 320),
            new Tadpole(15, 1540, 320, true, 3, 0.03, "wave", 110, 320),
            new Tadpole(15, 1640, 320, false, 3, 0.07, "wave", 110, 320)
        ]
    },
    {
        time: 30000,
        object: [
            new Squid(25, 840, 320, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 230, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 410, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 32000,
        object: [
            new Squid(25, 840, 320, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 230, false, 4, 0, "linear", 0, 0),
            new Squid(25, 980, 410, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 34000,
        object: [
            new Triship(15, 840, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 840, 410, false, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1000, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1000, 410, true, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1160, 210, true, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1160, 410, false, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1320, 210, false, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1320, 410, true, 2, -1, "zigzag", 225, 600),
            new Triship(15, 1480, 210, true, 2, 1, "zigzag", 225, 600),
            new Triship(15, 1480, 410, false, 2, -1, "zigzag", 225, 600)
        ]
    },
    {
        time: 46000,
        object: [
            new Squid(25, 840, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 980, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1120, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1260, 160, true, 3, 2, "zigzag", 400, 760),
            new Squid(25, 1400, 160, true, 3, 2, "zigzag", 400, 760)
        ]
    },
    {
        time: 53000,
        object: [
            new Squid(15, 840, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 980, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1120, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1260, 430, true, 3, -2, "zigzag", 350, 650),
            new Squid(15, 1400, 430, true, 3, -2, "zigzag", 350, 650)
        ]
    },
    {
        time: 56000,
        object: [new Squid(150, 840, 180, true, 1.8, -2, "mini2", 300, 450)]
    },
    {
        time: 75200,
        object: [new Boss5()]   //boss
    }
];
const enemiesLvl6 = [
    {
        time: 2000,
        object: [
            new Triship(15, 840, 350, false, 6, 0, "linear", 0, 0),
            new Triship(15, 980, 300, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1120, 250, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1260, 200, false, 6, 0, "linear", 0, 0),
            new Triship(15, 1400, 150, false, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 4000,
        object: [
            new Squid(15, 840, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 960, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1080, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1200, 220, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1320, 220, true, 4, 2, "zigzag", 300, 700)
        ]
    },
    {
        time: 7500,
        object: [
            new Triship(15, 840, 410, false, 5, 0, "linear", 0, 0),
            new Triship(15, 980, 360, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1120, 310, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1260, 260, false, 5, 0, "linear", 0, 0),
            new Triship(15, 1400, 210, false, 5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 10000,
        object: [new PowerUp(840, 240, 4, 0, "linear", 0, 0)]
    },
    {
        time: 12000,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 12500,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 13000,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 13500,
        object: [new Beetle(15, 840, 350, true, 4, 0.04, "wave", 50, 350)]
    },
    {
        time: 15000,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.05, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380),
            new PowerUp(840, 270, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15500,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.04, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380)
        ]
    },
    {
        time: 16000,
        object: [
            new Saucer(20, 840, 210, true, 4, 0.04, "linear", 50, 100),
            new Saucer(20, 840, 380, true, 4, 0.06, "wave", 50, 380)
        ]
    },
    {
        time: 20000,
        object: [
            new Triship(15, 840, 210, false, 4, 4, "zigzag", 400, 600),
            new Triship(15, 840, 410, false, 4, -4, "zigzag", 400, 600),
            new Triship(15, 1000, 210, false, 4, 4, "zigzag", 400, 600),
            new Triship(15, 1000, 410, true, 4, -4, "zigzag", 400, 600),
            new Triship(15, 1160, 210, true, 4, 4, "zigzag", 400, 600),
            new Triship(15, 1160, 410, false, 4, -4, "zigzag", 400, 600)
        ]
    },
    {
        time: 22000,
        object: [new Beetle(15, 840, 420, true, 3, 0, "linear", 0, 0)]
    },
    {
        time: 25000,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 25400,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 25800,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 26200,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 26600,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 27000,
        object: [new Marble2(15, 840, 320, true, 4, 0.06, "wave", 110, 320)]
    },
    {
        time: 28000,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 28700,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 29400,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 30100,
        object: [new Flipper(25, 840, 320, true, 3, 0.06, "wave", 100, 320)]
    },
    {
        time: 32300,
        object: [
            new Dragonfly(15, 840, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 840, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 430, true, 3.5, -3, "zigzag", 350, 600)
        ]
    },
    {
        time: 37000,
        object: [new PowerUp(840, 200, 4, 0, "linear", 0, 0)]
    },
    {
        time: 40000,
        object: [new Beetle(15, 840, 200, true, 3, 0.07, "wave", 50, 200)]
    },
    {
        time: 43000,
        object: [
            new Squid(15, 840, 210, true, 4, 2, "zigzag", 300, 700),
            new Squid(15, 1140, 210, true, 4, 2, "zigzag", 300, 700)
        ]
    },
    {
        time: 48000,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 48400,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 48800,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 49200,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 49600,
        object: [new Flipper(10, 840, 300, true, 4, 0.06, "wave", 120, 300)]
    },
    {
        time: 51000,
        object: [
            new Dragonfly(15, 840, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 840, 430, true, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 210, false, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1000, 430, false, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1160, 430, false, 3.5, -3, "zigzag", 350, 600),
            new Dragonfly(15, 1320, 210, true, 3.5, 3, "zigzag", 350, 600),
            new Dragonfly(15, 1320, 430, false, 3.5, -3, "zigzag", 350, 600)
        ]
    },
    {
        time: 57000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 57500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 58000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 58500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 59000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 59500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 60000,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 60500,
        object: [new Squid(20, 840, 320, true, 5, 0.05, "wave", 110, 320)]
    },
    {
        time: 61000,
        object: [new Boss6()]  //boss
    },
    {
        time: 65000,
        object: []    // bg stop trigger
    }
];
isLevelDark = false;
const enemiesLvl7 = [
    {
        time: 2000,
        object: [
            new Kraken(25, 840, 100, true, 3, 0.05, "wave", 40, 100),
            new Kraken(25, 840, 320, true, 5, 0.06, "wave", 40, 320)
        ]
    },
    {
        time: 2500,
        object: [
            new Kraken(25, 900, 100, true, 3, 0.05, "wave", 40, 100),
            new Kraken(25, 840, 320, true, 5, 0.06, "wave", 40, 320)
        ]
    },
    {
        time: 6000,
        object: [
            new Kraken(25, 840, 150, true, 5, 0.06, "wave", 40, 150),
            new Kraken(25, 840, 320, true, 3, 0.05, "wave", 40, 320)
        ]
    },
    {
        time: 6500,
        object: [
            new Kraken(25, 840, 150, true, 5, 0.06, "wave", 40, 150),
            new Kraken(25, 900, 320, true, 3, 0.05, "wave", 40, 320)
        ]
    },
    {
        time: 9000,
        object: [
            new Kraken(25, 840, 100, true, 5, 0.06, "wave", 40, 100),
            new Kraken(25, 840, 300, true, 3, -3, "zigzag", 400, 650),
            new Kraken(25, 980, 300, true, 3, -3, "zigzag", 400, 650)
        ]
    },
    {
        time: 9500,
        object: [new Kraken(25, 840, 100, true, 5, 0.06, "wave", 40, 100)]
    },
    {
        time: 13000,
        object: [
            new Beetle(15, 840, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 980, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1120, 180, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1260, 180, true, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 15000,
        object: [
            new Beetle(15, 840, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 980, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1120, 310, true, 6, 0, "linear", 0, 0),
            new Beetle(15, 1260, 310, true, 6, 0, "linear", 0, 0)
        ]
    },
    {
        time: 16000,
        object: [
            new Beetle(15, 840, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 980, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1120, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1260, 50, true, 5, 4, "zigzag", 300, 600),
            new Beetle(15, 1400, 50, true, 5, 4, "zigzag", 300, 600)
        ]
    },
    {
        time: 18500,
        object: [
            new Beetle(15, 840, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 980, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 1120, 180, true, 5, 0, "linear", 0, 0),
            new Beetle(15, 1260, 180, true, 5, 0, "linear", 0, 0)
        ]
    },
    {
        time: 20500,
        object: [
            new Triship(25, 840, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 980, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1120, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1260, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1400, 50, true, 2, 1.5, "zigzag", 450, 800),
            new Triship(25, 1540, 50, true, 2, 1.5, "zigzag", 450, 800)
        ]
    },
    {
        time: 22000,
        object: [
            new Triship(25, 840, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 980, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1120, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1260, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1400, 300, true, 4, -4, "zigzag", 350, 600),
            new Triship(25, 1540, 300, true, 4, -4, "zigzag", 350, 600)
        ]
    },
    {
        time: 30500,
        object: [
            new Shuttle(25, 1120, 50, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 120, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 840, 190, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 260, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1120, 330, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 35000,
        object: [
            new Shuttle(25, 1120, 50, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 120, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 840, 190, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 980, 260, false, 4, 0, "linear", 0, 0),
            new Shuttle(25, 1120, 330, false, 4, 0, "linear", 0, 0)
        ]
    },
    {
        time: 40000,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 40700,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 41400,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 42100,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 42800,
        object: [
            new Beetle(15, 840, 100, true, 4, 0.06, "wave", 50, 100),
            new Beetle(25, 840, 170, true, 4, 0.06, "wave", 50, 170)
        ]
    },
    {
        time: 44000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 44500,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 45000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 45500,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 46000,
        object: [
            new Beetle(15, 840, 170, true, 4, 0.06, "wave", 50, 170),
            new Beetle(25, 840, 240, true, 4, 0.06, "wave", 50, 240)
        ]
    },
    {
        time: 52000,
        object: [new Boss7()]  //boss
    }
];
const enemiesLvl8 = [
    {
        time: 2000,
        object: [
            new Squid(70, 840, 70, false, 3, 0, "linear", 0, 0),
            new Squid(70, 840, 170, false, 3, 0, "linear", 0, 0),
            new Squid(70, 840, 270, false, 3, 0, "linear", 0, 0)
        ]
    },
    {
        time: 4000,
        object: [
            new Dragonfly(25, 840, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 940, 200, true, 2, 0.04, "wave", 130, 180),
            new Dragonfly(25, 1040, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1140, 200, true, 2, 0.06, "wave", 130, 180),
            new Dragonfly(25, 1240, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1340, 200, true, 2, 0.03, "wave", 130, 180),
            new Dragonfly(25, 1440, 50, true, 2, 2, "zigzag", 350, 600),
            new Dragonfly(25, 1540, 200, true, 2, 0.05, "wave", 130, 180)
        ]
    },
    {
        time: 12050,
        object: [new Boss8()]
    },
    {
        time: 15700,
        object: []
        // bg stop trigger component so blank object
    }
];

function checkCollision(rect1, rect2) {
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
}

let currentLevel = new Level(1, true);
let lastTime = 0;    // previous time stamp
const logo = document.getElementById("logo");
const playButton = document.getElementById("play");
const exitButton = document.getElementById("exit");
const pauseButton = document.getElementById("pause-button");
let isMainScreen = true;    // game doesn't start in main screen
let newGame = false;

function nextLevel(num, isDark) {
    currentLevel = new Level(num, isDark);
}
function gameWin() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    particles.forEach(particle => particle.update());

    mainCtx.save();
    mainCtx.font = "bold 60px Silkscreen"
    bgCanvas.style.background = "#282828";
    mainCtx.textAlign = "center";
    mainCtx.fillStyle = "#aad69c";
    mainCtx.fillText("You Win!", 420, 150);
    mainCtx.fillText("High Score: " + playerScore.toString().padStart(5, "0"), 420, 250);
    mainCtx.restore();
    exitButton.style.display = "block";
    pauseButton.style.visibility = "hidden";
}
function gameLose() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    particles.forEach(particle => particle.update());

    mainCtx.save();
    bgCanvas.style.background = "#282828";
    mainCtx.fillStyle = "#aad69c";
    mainCtx.font = "bold 60px Silkscreen"
    mainCtx.textAlign = "center";
    mainCtx.fillText("Game Over!", 420, 120);
    mainCtx.fillText("Score: " + playerScore.toString().padStart(5, "0"), 420, 220);
    mainCtx.font = "bold 50px Silkscreen"
    mainCtx.fillText("Better Luck Next Time", 420, 320);
    mainCtx.restore();
    exitButton.style.display = "block";
    pauseButton.style.visibility = "hidden";
}
function gameStart() {
    playButton.style.display = "none";
    pauseButton.style.visibility = "visible";
    isMainScreen = false;
}
function mainScreen() {
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    particles.forEach(particle => particle.update());
    bgCanvas.style.background = "#282828";
    mainCtx.drawImage(logo, 0, 0, 1190, 430, 100, 100, 640, 245);
}

function animate(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (isMainScreen) mainScreen();
    else if (!gamePause && !gameOver) {
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        currentLevel.update(deltaTime);
    }
    else {
        mainCtx.save();
        mainCtx.fillStyle = "red";
        mainCtx.textAlign = "center";
        mainCtx.font = "bold 60px Silkscreen"
        mainCtx.fillText("|| Game Paused", 420, 260);
        mainCtx.restore();
    }
    if (gameOver) {
        lives > 0 ? gameWin() : gameLose();
    }

    requestAnimationFrame(animate);
}
animate(0);

playButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}`+"px";
exitButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}`+"px";

exitButton.addEventListener("click", () => {
    document.location.reload();   // !!! reloading this because game not loading properly second time, tried everything, still unknown bug
});
pauseButton.addEventListener("click", () => {
    gamePause = !gamePause;
    if (gamePause) pauseButton.innerHTML = "Resume";
    else pauseButton.innerHTML = "Pause";
    pauseButton.blur();
});

playButton.addEventListener("click", gameStart);
exitButton.addEventListener("click", gameStart);
window.addEventListener("resize", ()=>{
    playButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}`+"px";
    exitButton.style.top = `${bgCanvas.getBoundingClientRect().height - 70}`+"px";

})