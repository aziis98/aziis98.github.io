// logic.js //

(function(exports) {
	'use strict';

	const bonus = [20, 15, 10, 8, 6, 5, 4, 3, 2, 1];
	const RISPOSTO_BENE = 1;
	const NON_RISPOSTO = 0;
	const RISPOSTO_MALE = -1;

	let simulator
	let gara

	function creaGara(squadre, risposte, durata, deriva) {
		if (deriva === undefined) {
			deriva = 1;
		}

		simulator = new EventSimulator();
		simulator.pushEvent('setup');

		gara = new EventBus();

		function cheHaRispostoBene(squadra, domanda) {
			return squadra.statoPerDomanda[domanda.index] === RISPOSTO_BENE;
		}

		function fattoreJolly(squadra, domanda) {
			return squadra.jolly === domanda.index ? 2 : 1;
		}

		// For debugging
		exports.gara = {
			squadre: squadre,
			risposte: risposte,
			durata: durata,
			deriva: deriva
		};

		gara.on('setup', function () {
			// console.log('Setup');

			this.squadre = [ ];
			this.domande = [ ];
			this.ticks = 0;
			this.deriva = deriva;
			this.durata = durata;

			// Risposte
			for(let i = 0; i < risposte.length; i++) {
				this.domande.push({
					index: i,
					punteggio: 20,
					risposta: risposte[i],
					numeroRisposteCorrette: 0
				});
			}

			// Squadre
			for(let i = 0; i < squadre.length; i++) {
				this.squadre.push({
					name: squadre[i],
					punteggio: 10 * risposte.length,
					statoPerDomanda: _.range(risposte.length).map(x => NON_RISPOSTO),
					punteggiPerDomanda: _.range(risposte.length).map(x => 0),
					jolly: -1
				});
			}
		});

		gara.on('1min', function () {
			// console.log('1mim : %s', this.ticks);

			if (this.ticks < 100) {
				this.domande
					.filter(d => d.numeroRisposteCorrette < this.deriva)
					.forEach(d => {
						d.punteggio += 1;
						this.squadre
							.filter(s => cheHaRispostoBene(s, d))
							.forEach(s => {
								s.punteggio += fattoreJolly(s, d);
								s.punteggiPerDomanda[d.index] += fattoreJolly(s, d);
							});
					});
			}

			this.ticks++;

			// 10 min passed
			if (this.ticks === 10) {
				this.squadre.forEach(s => {
					if (s.jolly === -1) s.jolly = 0;
				})
			}

			if (this.ticks === this.durata) {
				this.invoke('fine');
			}
		});

		gara.on('risposta', function (args) {
			const [nomeSquadra, indiceDomanda, risposta] = args;

			const squadra = this.squadre.filter(s => s.name === nomeSquadra)[0];
			const domanda = this.domande[indiceDomanda];

			// console.log('Risposta da %s alla domanda %s (%s)',
			//  	squadra.name,
			// 	domanda.index + 1,
			// 	domanda.risposta === risposta ? 'buona' : 'sbagliata'
			// );

			if (domanda.risposta === risposta && squadra.statoPerDomanda[domanda.index] !== RISPOSTO_BENE) {
				// risposta giusta
				const pntg = fattoreJolly(squadra, domanda) * (domanda.punteggio + bonus[domanda.numeroRisposteCorrette++]);

				squadra.punteggio += pntg;
				squadra.punteggiPerDomanda[domanda.index] = pntg;

				squadra.statoPerDomanda[domanda.index] = RISPOSTO_BENE;
			}
			else {
				// risposta sbagliata

				const pntg = 10 * fattoreJolly(squadra, domanda);

				squadra.punteggio -= pntg;
				squadra.punteggiPerDomanda[domanda.index] -= pntg;
				squadra.statoPerDomanda[domanda.index] = RISPOSTO_MALE;

				domanda.punteggio += 2;
			}
		})

		gara.on('jolly', function (args) {
			const [nomeSquadra, indiceDomanda] = args;

			// console.log('Impostato jolly a %s alla domanda %s', squadra.name, indiceDomanda + 1);

			const squadra = this.squadre.filter(s => s.name === nomeSquadra)[0];

			// if (squadra.jolly === -1) {
				squadra.jolly = indiceDomanda;
			// }
			// else {
				// console.log('  La squadra ha già impostato il jolly!!! D: D: D:');
			// }
		})

		gara.on('fine', function () {
			// console.log('Fine!');
		});

		let timer = setInterval(function () {

			simulator.pushEvent('1min');

			updateSimulation();

			if (simulation.ticks === durata) {
				clearInterval(timer);
			}

		}, 60 * 1000);

		updateSimulation();

		exports.simulator = simulator;

		$(window).trigger('inizio-gara', [ squadre, risposte, deriva, durata ]);
	}

	function rispondi(nomeSquadra, indiceDomanda, risposta) {
		simulator.pushEvent('risposta', [nomeSquadra, indiceDomanda, risposta]);

		updateSimulation();
	}

	function impostaJolly(nomeSquadra, indiceDomanda) {
		simulator.pushEvent('jolly', [nomeSquadra, indiceDomanda]);

		updateSimulation();
	}

	function updateSimulation() {

		console.time('simulation');

		// console.log('Doing simulation...');
		const simulation = simulator.simulateWith(gara);
		// console.log('-------------------\n\n');

		console.timeEnd('simulation');

		exports.simulation = simulation;

		$(window).trigger('updated-simulation', [ simulation ]);

		// localStorage['simulator'] = JSON.stringify(simulator);
	}

	exports.creaGara = creaGara;
	exports.rispondi = rispondi;
	exports.impostaJolly = impostaJolly;

	exports.RISPOSTO_BENE = RISPOSTO_BENE;
	exports.RISPOSTO_MALE = RISPOSTO_MALE;
	exports.NON_RISPOSTO = NON_RISPOSTO;

}(window));
