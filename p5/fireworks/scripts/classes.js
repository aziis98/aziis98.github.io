const maxAge = 75;

// ------------< Particle >------------

function Particle(x, y, col, isFirework) {
	this.col = col;

	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);

	this.isFirework = isFirework;
	this.age = 0;
}

Particle.prototype.isOld = function () {
	return this.age > maxAge;
};

Particle.prototype.applyForce = function (force) {
	this.acc.add(force);
};

Particle.prototype.update = function () {
	this.applyForce(gravity);

	this.vel.add(this.acc);
	this.pos.add(this.vel);

	this.acc.mult(0);

	this.age++;
};

Particle.prototype.show = function () {

	if (this.isFirework) {
		stroke(this.col);
	}
	else {
		let lc = lerpColor(this.col, color(0, 0), this.age / maxAge);
		lc._array[3] *= 255;
		stroke(lc);
	}

	point(this.pos.x, this.pos.y);
};

// ------------< Firework >------------

function Firework() {
	this.col = color('hsba({0}, 100%, 100%, 1.0)'.format(floor(random(360))));

	this.firework = new Particle(random(width), height, this.col, true);
	this.firework.vel = createVector(0, random(-17, -10));

	this.particles = [];

	this.isExploded = false;
}

Firework.prototype.isDead = function () {
	return this.isExploded && this.particles.length === 0;
};

Firework.prototype.update = function () {
	if (!this.isExploded) {
		this.firework.update();

		if (this.firework.vel.y >= 0) {
			this.isExploded = true;
			this.explode();
		}
	}
	else {
		this.particles = this.particles.filter(p => {
			p.vel.mult(0.99);
			p.update();
			return !p.isOld();
		});
	}
};

Firework.prototype.explode = function () {
	for(var i = 0; i < 100; i++) {
		const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.col, false);

		p.vel = p5.Vector.random2D();
		p.vel.mult(random(1.0, 10.0));

		this.particles.push(p);
	}
};

Firework.prototype.show = function () {
	if (!this.isExploded) {
		this.firework.show()
	}
	else {
		this.particles.forEach(p => p.show());
	}
};
