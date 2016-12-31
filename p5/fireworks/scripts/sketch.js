'use strict';

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ?
            args[number] :
            match;
    });
};

// P5.js experiment boilerplate

// plug in Stats
// let stats = new Stats();
// stats.setMode(0);
// document.body.appendChild(stats.domElement);

// plug in dat.GUI
window.onload = function() {
    let gui = new dat.GUI();
    gui.add(window, 'fireworkChance', 0, 0.25);
};

// -----------------------------

window.fireworkChance = 0.05;

let fireworks = [];
let gravity;

function setup() {
    createCanvas(windowWidth, windowHeight);

    gravity = createVector(0, 0.2);

    strokeWeight(4);
	noFill();
	// colorMode(RGB, 255, 255, 255, 255);
}

function draw() {
    // stats.begin();

    background(0, 50);

    if (random(1.0) < fireworkChance) {
        fireworks.push(new Firework());
    }

    fireworks = fireworks.filter(firework => {
        firework.update();
        firework.show();
        return !firework.isDead();
    });

    // stats.end();
}
