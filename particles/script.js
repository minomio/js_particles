//by default canvas is transparent, can be layered
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particelsArray = [];
//console.log ctx will see this 2d object and can see all its properites with dot notation ctx.arc to draw a circle.. drawing methods <prototype>
//console.log(ctx);
let hue = 0;

//to get correct scaling when page loads and changes size:
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//create mouse object
const mouse = {
  x: undefined,
  y: undefined,
};
// Event Listener Click
canvas.addEventListener("click", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //drawCircle();
  //Each time click, push new particle into particles array. This makes one particle per click
  //particelsArray.push(new Particle());
  //To make more than one particle per click, create for loop:
  // for (let i = 0; i < 10; i++) {
  //   particelsArray.push(new Particle());
  // }
});

// function drawCircle() {
//   ctx.fillStyle = "red";
//   ctx.strokeStyle = "red";
//   ctx.lineWidth = 5;
//   ctx.beginPath();
//   ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
//   ctx.stroke();
// }
// Event Listener Mousemove, like simple pain brush on canvas:
canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  // drawCircle();
  for (let i = 0; i < 3; i++) {
    particelsArray.push(new Particle());
  }
});

//can use JS classes to make many object of same thing, new syntax:
//Capitalize name. each particle will be circle. includes constructor and class methods.
class Particle {
  constructor() {
    //Start particles under mouse:
    this.x = mouse.x;
    this.y = mouse.y;
    //Start particles all over canavs:
    // this.x = Math.random() * canvas.width;
    //this.y = Math.random() * canvas.height;
    // this.radius = Math.random() * 10 + 2;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5; //if positive number, will  only move right. so betwen -1.5 to 1.5
    this.speedY = Math.random() * 3 - 1.5;
    //To create particles that remember their hue color after first appear, then assign this.color to ctx.fillStyle in draw():
    this.color = "hsl(" + hue + ",100%, 50%)";
  }
  update() {
    //Create 2D vecotr with this.x and this.y
    this.x += this.speedX;
    this.y += this.speedY;
    //Change size of particles over time:
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw() {
    //ctx.fillStyle = "blue";
    // HSL first value is 0-360 degree on color wheel, 0 = red, 120 = green, 240 = blue. Saturation 0 - 100 % 0 is grey and 100 is full color.  Lightness 0 - 100%, 0 is black, 100 is white.
    //Concotenate the hue varaible declared earlier into hsl: cycles through all colors:
    //ctx.fillStyle = "hsl(" + hue + ",100%, 50%)";
    ctx.fillStyle = this.color;

    //ctx.strokeStyle = "hsl(" + hue + ",10%, 50%)";
    //ctx.strokeStyle = "blue";
    //ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

//function to create Particle runs on the first page load and runs 1000 times: Dont use this if want particles under moouse. instead put it in click event function.
// function init() {
//   for (let i = 0; i < 1000; i++) {
//     particelsArray.push(new Particle());
//   }
// }
// init();

//cycle through array and updtate and draw each circle they move around
function handleParticles() {
  for (let i = 0; i < particelsArray.length; i++) {
    particelsArray[i].update(); //update from Particle constructor
    particelsArray[i].draw(); //draw from Particle constructor
    //constilation effect, connecting the dots: acchieved by comparing every particle in array with every other particle in array by caluclating their distance and if in certain rainge of another, draw a line between the particles. create nested for loop in which to cycle through and compare their distances.
    //Get error if compare distance after the loop to get rid of small particles. This loop must go first.
    for (let j = i; j < particelsArray.length; j++) {
      //use pathagareon theoroem to calculate distance between particle i and j
      //dx is distance of x, subtract distance of i particle from distance of particle from j loop
      const dx = particelsArray[i].x - particelsArray[j].x;
      const dy = particelsArray[i].y - particelsArray[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      //check if d is < 100 px and if it is, draw a line connecting dots:
      if (d < 100) {
        //ctx.beginPath() to draw line:
        ctx.beginPath();

        //ctx.moveTo(x,y) takes x and y coordiantes. put in the ones for particle i
        ctx.moveTo(particelsArray[i].x, particelsArray[i].y);
        //ctx.lineTo(x,y) put in particle j coordinates:
        ctx.lineTo(particelsArray[j].x, particelsArray[j].y);
        //call ctx.Stroke() to actaully draw the line:
        ctx.stroke();
        //set stroke color to that of particle:
        ctx.strokeStyle = particelsArray[i].color;
        //create dynamic stroke size (.size from constructor):
        ctx.lineWidth = particelsArray[i].size / 10;
        ctx.closePath(); //for bugs
      }
    }
    //get rid of particles that are a certain size:
    if (particelsArray[i].size <= 0.3) {
      particelsArray.splice(i, 1);
      i--; //stops the blinking when removing particles
    }
  }
}
//This creates circle tracking mouse because clearRect clears the trail each frame:
function animate() {
  // Comment out clearRect if want circles to leave behind trails:
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas
  //To make trails fade away slowly, draw semi transparent rectangle on canvas over an over again: (next 2 lines of code)
  //ctx.fillStyle = "rgba(0,0,0,0.15";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  // Increase hue by 1 for every frame:
  // hue++;
  //Can change speed of color cycle:
  hue += 12;
  requestAnimationFrame(animate); //pass animate in itself to make loop. request Animation frame calls any function we pass it only once. if we use animate it will create loop.
  // drawCircle();
}

animate();
