const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let gameSpeed = 5;

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

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });

    requestAnimationFrame(animate);
};
animate();
