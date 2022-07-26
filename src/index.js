import Section from './scripts/section';
import Letter from './scripts/letter';  

let background = null;
let myLetters = [];
let selectedLetter = null;
let currentLetterIdx = null;
let isDragging = false;
let queryArea;
let query = '';

let ctx;
let myCanvas;
let startX;
let startY;
let mouseX;
let mouseY;
let offsetX;
let offsetY;


document.addEventListener('DOMContentLoaded', () => {

    console.log("hello world")

    myCanvas = document.getElementById('mycanvas');
    myCanvas.width = 1000;
    myCanvas.height = 1000;
    
    ctx = myCanvas.getContext('2d')
   
    initialize ();
    addCanvasEventListeners(myCanvas);
})


function initialize () {
    background = new Image(); 
    background.src = "/Users/EtaCarinaeDua/Dropbox/aabootcamp/theCoolerDictionary_JS/assets/images/fridge_door.png"; // 1149x860
    background.onload = function() {  // Make sure the image is loaded first otherwise nothing will draw.
        myCanvas.width = 1149;
        myCanvas.height = 860;
        ctx.drawImage(background,0,0,background.width,background.height,0,0,1149,860);

        spawn(ctx);
    }
}

function backgroundOnly () {
    ctx.drawImage(background,0,0,background.width,background.height,0,0,1149,860);
}

function spawn(ctx) {
    // Set regions of frige doors
    const letters1 = new Section (ctx, 200,100,700,150); // rendered for testing
    const letters2 = new Section (ctx, 200,550,700,150); // rendered for testing
    queryArea = new Section (ctx, 200,350,700,100);

    // Spawn original letters
    const lettersArr = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < alphabet.length/2; i++){ 
        const x = randomX(letters1)+(50 * Math.random());          
        const y = randomY(letters1)+(50 * Math.random());          

        const letter = new Letter (ctx, x, y, lettersArr, alphabet);
        myLetters.push(letter);
    }
    for (let i = 0; i < alphabet.length/2; i++){ 
        const x = randomX(letters2)+(50 * Math.random());    // offset for fridge graphic       
        const y = randomY(letters2)+(50 * Math.random());          

        const letter = new Letter (ctx, x, y, lettersArr, alphabet);
        myLetters.push(letter);
    }
    console.log(myLetters);
}

function get_offset() {
    let canvas_offsets = canvas.getBoundingClientRect();
    offsetX = canvas_offsets.left;
    offsetY = canvas_offsets.top;
}

function addCanvasEventListeners(canvas) {
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmouseout = mouseOut;
    canvas.onmousemove = mouseMove;
}
function randomX (sect) {
    let x = 0;
    while (!sect.containsX(x)){// && queryArea.containsY(y)) {
        x = sect.x + (Math.random() * sect.width);
    }
    return x;
}

function randomY (sect) {
    let y = 0;
    while (!sect.containsY(y)){// && queryArea.containsY(y)) {
        y = sect.y + (Math.random() * sect.height); // slight offset
    }
    return y;
}


function mouseDown (event) {
    event.preventDefault();
    
    startX = parseInt(event.offsetX);
    startY = parseInt(event.offsetY);

    for (let i = 0; i < myLetters.length; i++) {
        let letterObj = myLetters[i];
        if (letterObj.contains(startX, startY)) {
            currentLetterIdx = i;
            isDragging = true;
            bringToFront();
        }
    }
}

function mouseUp (event) {
    if (!isDragging) { // No action if we are not currently dragging
        return;
    } else {
        event.preventDefault();
        isDragging = false; // Else, we exit dragging mode
    }
}

function mouseOut (event) {
    if (!isDragging) {
        return;
    } else {
        event.preventDefault();
        isDragging = false;
    }
}

function mouseMove (event) {
    mouseX = parseInt(event.offsetX)
    mouseY = parseInt(event.offsetY)
    
    // if (insideQuery) hoverQuery();

    if (!isDragging) {
    } else {
        event.preventDefault();

        let dx = mouseX - startX;
        let dy = mouseY - startY;
        
        selectedLetter = myLetters[currentLetterIdx];
        selectedLetter.x += dx;
        selectedLetter.y += dy;

        startX = mouseX;
        startY = mouseY;
    }

    drawLetters();
}

function insideQuery () {
    if (queryArea.contains(mouseX,mouseY)) return true;
    return false;
}

function hoverQuery() {
// ctx.shadowBlur = 10;
    // ctx.shadowColor = "black";
    // ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw a path
    ctx.beginPath();
    ctx.moveTo(queryArea.x, queryArea.y);        
    ctx.lineTo(queryArea.x + queryArea.width, queryArea.y); 
    ctx.lineTo(queryArea.x + queryArea.width, queryArea.y + queryArea.height);     
    ctx.lineTo(queryArea.x, queryArea.y + queryArea.height);     
    ctx.closePath();

    // Create fill gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, queryArea.height);
    gradient.addColorStop(0, "#C6CACD");
    gradient.addColorStop(1, "#faf100");
        
    // Fill the path
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawLetters() {
    if (isDragging) backgroundOnly();
    if (insideQuery()) {
        hoverQuery();
    } else {
        backgroundOnly();
    }

    for (let letter of myLetters) {
        letter.draw();
        console.log('just writing the letters')
    }
}

function bringToFront() {
    let temp = myLetters[currentLetterIdx];
    myLetters.splice(currentLetterIdx, 1);
    myLetters.push(temp);
    console.log(myLetters);
}