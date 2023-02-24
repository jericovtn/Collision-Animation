const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = '50px Impact';
let gameSpeed = 10;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

// for Parallax Background
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer5.png';
const backgroundLayer6 = new Image();
backgroundLayer6.src = 'layer6.png';
const backgroundLayer7 = new Image();
backgroundLayer7.src = 'layer7.png';
const backgroundLayer8 = new Image();
backgroundLayer8.src = 'layer8.png';

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 1930;
        this.height = 860;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = 0;
        }
        this.x = this.x - this.speed;
        //this.x = gameFrame * this.speed % this.width;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.5);
const layer2 = new Layer(backgroundLayer2, 0.5);
const layer3 = new Layer(backgroundLayer3, 0.5);
const layer4 = new Layer(backgroundLayer4, 0.5);
const layer5 = new Layer(backgroundLayer5, 0.5);
const layer6 = new Layer(backgroundLayer6, 0.5);
const layer7 = new Layer(backgroundLayer7, 0.5);    
const layer8 = new Layer(backgroundLayer8, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8];

// for Shooter Game
let aliens = [];
class Alien {
    constructor(){
        this.spriteWidth = 200; //depends on the size of the spitesheet
        this.spriteHeight = 200;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'sandwichAlien.png';
        this.frame = 0;
        this.maxFrame = 8;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltatime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;
        }

        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;

        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if (this.hasTrail){
                for (let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }

        if (this.x < 0 - this.width) gameOver = true;
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 150;
        this.markedForDeletion = false;
    }

    update(deltatime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            if(this.frame > 5) this.markedForDeletion = true;
        }
    }

    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
}

let particles = [];
class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/3 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.font = '40px Candara';
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 50, 75);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.font = '150px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER!', canvas.width/2, canvas.height/2 + 30);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER!', canvas.width/2 + 5, canvas.height/2 + 35);
    ctx.fillStyle = 'indigo ';
    ctx.fillText('GAME OVER!', canvas.width/2 + 8, canvas.height/2 + 38);
    return;
}

window.onload = function(){
    document.getElementById('bgMusic').play();
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    aliens.forEach(object => {
        if (object.randomColors[0] === pc [0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            // collision detected
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    })
});

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval){
        aliens.push(new Alien());
        timeToNextRaven = 0;
        aliens.sort(function(a, b){
            return a.width - b.height;
        });
    };
    drawScore();
    [...particles, ...aliens, ...explosions].forEach(object => object.update(deltatime));
    [...particles, ...aliens, ...explosions].forEach(object => object.draw());
    
    aliens = aliens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);

    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();

}


animate(0);