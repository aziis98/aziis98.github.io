//////////////////////////////////////////////////////////////////////

function EventBus() {
	this.listeners = { };
}

EventBus.prototype.on = function (name, cb) {
	let listener = this.listeners[name];

	if (!listener) {
		this.listeners[name] = listener = [];
	}

	listener.push(cb);
};

EventBus.prototype.invoke = function (name) {
	const args = Array.prototype.slice(arguments, 1);

	this.listeners[name].forEach(cb => cb.apply(this, args));
};

// let gara = new EventBus();
//
// gara.on('inizio', function () {
// 	this.domande.forEach(domanda => {
// 		domanda.punteggio = 20;
// 	});
// });

//////////////////////////////////////////////////////////////////////

function EventSimulator() {
	this.eventMemory = [];
}

EventSimulator.prototype.pushEvent = function (name) {
	const args = Array.prototype.slice(arguments, 1);

	this.eventMemory.push({
		name: name,
		args: args
	});
};

EventSimulator.prototype.simulateWith = function (eventBus) {
	const eb = new EventBus();
	eb.listeners = eventBus.listeners;

	this.eventMemory.forEach(event => {
		eb.invoke.call(eb, [event.name].concat(event.args));
	});

	return eb;
};

//////////////////////////////////////////////////////////////////////

const gara = new EventBus()

debugger

gara.on('setup', function () {
	this.domande = []

	for(var i = 0; i < 20; i++) {
		this.domande.push({
			punteggio: 0,
			risposta: '0000'
		})
	}
})

gara.on('inizio', function () {
	console.log('gara.on "inizio"');

	this.ticks = 0;
})

gara.on('ogni minuto', function () {
	console.log('gara.on "ogni minuto"');

	this.ticks++;
})

const sim = new EventSimulator()

sim.pushEvent('setup')
sim.pushEvent('inizio')

console.log('Sim 1 <<<<');
console.log(sim.simulateWith(gara));
console.log('Sim 1 >>>>');

sim.pushEvent('ogni minuto')
sim.pushEvent('ogni minuto')

console.log('Sim 2 <<<<');
console.log(sim.simulateWith(gara));
console.log('Sim 2 >>>>');

console.log(sim.eventMemory);
sim.eventMemory.splice(2, 1);
console.log(sim.eventMemory);

console.log('Sim 3 <<<<');
console.log(sim.simulateWith(gara));
console.log('Sim 3 >>>>');

//////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////
