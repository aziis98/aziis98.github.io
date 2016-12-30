// eventbus.js //

(function(exports) {
	'use strict';

	// EventBus //

	let masterIndex = 0

	function EventBus() {
		this.listeners = { };
	}

	EventBus.prototype.on = function (name, cb) {
		let listener = this.listeners[name];

		if (!listener) {
			this.listeners[name] = listener = {};
		}

		const index = masterIndex;
		listener['hash' + index] = cb;

		masterIndex++;

		return index;
	};

	EventBus.prototype.invoke = function (name, args) {
		Object.keys(this.listeners[name]).forEach(key => {
			// console.log('name: %s | key: %s | args: %s', name, key, args);
			this.listeners[name][key].apply(this, [args]);
		});
	};

	EventBus.prototype.clear = function (name, hash) {
		delete this.listeners[name][hash];
	}

	// EventSimulator //

	function EventSimulator() {
		this.eventMemory = [];
	}

	EventSimulator.prototype.pushEvent = function (name, args) {
		// const args = Array.prototype.slice.call(arguments, 1);

		this.eventMemory.push({
			name: name,
			args: args
		});
	};

	EventSimulator.prototype.simulateWith = function (eventBus) {
		const eb = new EventBus();
		eb.listeners = eventBus.listeners;

		this.eventMemory.forEach(event => {
			eb.invoke(event.name, event.args);
		});

		return eb;
	};

	// Exports //

	exports.EventBus = EventBus;
	exports.EventSimulator = EventSimulator;

}(window));
