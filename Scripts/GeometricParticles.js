
/*
   Code by: metwas seup
   Date: 17 March 2018

   this is code has the same particle class from my other javascript particle systems code,
   but this time we are utilizing the lineTo() method on the canvas context object
   
*/
var particleRadius = 6;
var defaultParticleCount = 75;
var defaultCanvasWidth = 500;
var defaultCanvasHeight = 500;
var lineDistance = 80;
var backColor = "rgb(0,0,0)";
var lineWidth = 0.5;
var fantasyEffect = false;

var Particles = [];
var canvas,ctx = {};

window.onload = function () {
    canvas = document.getElementsByTagName("CANVAS")[0];
    ctx = canvas.getContext('2d');
    setup();
};

class Particle {
    constructor(radius) {
        this.x = random(0,canvas.width); 
        this.y = random(0,canvas.height);
        this.vx = random(22, -11);
        this.vy = random(10, -10);
        this.radius = radius;
        this.padding = 450;
        this.color = new Color(random(255),random(255),random(255),random(120,255));
        this.lifeSpan = random(5, 225);
        this.count = 0;
    }

    update() {
        this.x += this.vx * 0.1;
        this.y += this.vy * 0.1;
        this.count++;
        this.evaluate();
        this.edge();
    }

    show(color) {
        this.ID++;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        this.color.dyeParticle();
        ctx.arc(this.x, this.y,this.radius,0,2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    lineTo(distance,particles){
        var _distance = 0;
        for(var i =0;i< particles.length;i++){
            _distance = dist(this.x,this.y,particles[i].x,particles[i].y);
            if(particles[i] instanceof Particle && _distance < lineDistance){
                ctx.beginPath();
                ctx.moveTo(this.x,this.y);
                ctx.lineWidth = lineWidth;
                ctx.lineTo(particles[i].x,particles[i].y);
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }
        }
    }

    evaluate() {
        
        // limit the particle travel speed dependant on the size of the canvas, the particles seem to get  get out of hand :D
        if(this.vx > 4){
            this.vx -= 2;
        }
        if(this.vy > 4){
            this.vy -= 2;
        }
        
        if (this.count > this.lifeSpan) {
            this.color.dyeParticle();
            ctx.arc(this.x, this.y,this.radius,0,2 * Math.PI);
            this.color = new Color(random(255),random(255),random(255),random(120,255));
            this.lifeSpan = random(5, 225);
            this.count = 0;
        }
    }

    edge() {

        if ((this.x - this.radius) < 10) {
            this.vx *= -1;
        }
        if ((this.y - this.radius) < 10) {
            this.vy *= -1;
        }
        if ((this.x + this.radius) > canvas.width - 10) {
            this.vx *= -1;
        }
        if ((this.y + this.radius) > canvas.height - 10) {
            this.vy *= -1;
        }
    }
}


function random(min,max){
    var rand = Math.random();

    if(typeof min === "undefined"){
        return rand;
    }else if(typeof max === "undefined"){
        if(min instanceof Array){
            // return a random value in an array
            return min[Math.floor(rand * min.length)];
        }
        else{
            return Math.floor(rand * min);
        }
    }else{
        // get the highest of the two supplied values
        if(min > max){
            // swap the values
            var temp = min;
            min = max;
            max = temp;
        }

        return rand  * (max - min) + min;
    }
}

function Color(R, G, B, Alpha) {
    this.r = R > 255 ? 0 : R || 0;
    this.g = G > 255 ? 0 : G || 0;
    this.b = B > 255 ? 0 : B || 0;
    this.alpha = Alpha || 255;

    this.dyeParticle = function () {
        ctx.strokeStyle = 'rgba('+this.r+','+ this.g+','+ this.b+','+ this.alpha+')';
    }
}

function dist(x0,y0,x1,y1){
    return Math.sqrt(((x1 - x0) * (x1 - x0)) +  ((y1 - y0) * (y1 - y0)));
}


function setup() {
    
    if(canvas.getAttribute("data-canvas-fullscreen")){
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }else{
        canvas.width  = defaultCanvasWidth;
        canvas.height = defaultCanvasHeight;
    }
    if(fantasyEffect){
        backColor = "rgba(0,0,0,0.17)";
        lineWidth = 0.01;
    }

    for (var i = 0; i < defaultParticleCount; i++) {
        Particles.push(new Particle(particleRadius));
    }

}

function draw() {
    ctx.fillStyle = backColor; 
    ctx.save();
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (var i = 0; i < Particles.length; i++) {
        if (Particles[i] !== null) {
            Particles[i].update();
            Particles[i].show();
            Particles[i].lineTo(85,Particles);
        }
    }
}

window.setInterval(function(){
    //console.log(Particles[0].x);
    draw();
},1000/60);


