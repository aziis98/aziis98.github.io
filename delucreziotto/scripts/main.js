// main.js //

(function(exports) {
	'use strict';

	$(window).on('post-injection', () => {

		const $selezionaSquadra = $('#seleziona-squadra');
		const $selezionaDomanda = $('#seleziona-domanda');
		const $selezionaRisposta = $('#seleziona-risposta');
		const $inviaRisposta = $('#invia-risposta');
		const $inviaJolly = $('#invia-jolly');

		let momentInizioGara
		let momentFineGara

		let labelTempoRimasto = '???'

		$(window).on('inizio-gara', function (e, squadre, risposte, deriva, durata) {
			momentInizioGara = moment();
			momentFineGara = moment().add(durata, 'minutes');

			// Setup #seleziona-squadra
			$selezionaSquadra.empty();
			squadre.forEach(name => {
				const $option = renderSquadraOption(name);

				$selezionaSquadra.append($option);
			});

			// Setup #seleziona-domanda
			$selezionaDomanda.attr('max', risposte.length);

			// Setup #invia-risposta
			$inviaRisposta.on('click', function () {
				const nomeSquadra = $selezionaSquadra.val();
				const indiceDomanda = Number($selezionaDomanda.val()) - 1;
				const risposta = Number($selezionaRisposta.val());

				if ($selezionaRisposta.val().length > 0 && !isNaN(risposta)) {
					rispondi(nomeSquadra, indiceDomanda, risposta);
				}

				$selezionaRisposta.val('');
			});

			// Setup #invia-jolly
			$inviaJolly.on('click', function () {
				const nomeSquadra = $selezionaSquadra.val();
				const indiceDomanda = Number($selezionaDomanda.val()) - 1;

				impostaJolly(nomeSquadra, indiceDomanda);
			});


			exports.momentInizioGara = momentInizioGara;
			exports.momentFineGara = momentFineGara;
		});

		$(window).on('updated-simulation', function (e, simulation) {
			displayTable(simulation);
		});

		setInterval(function () {
			const now = moment();

			if (momentFineGara) {
				const hh = momentFineGara.diff(now, 'hours');
				const mm = momentFineGara.diff(now, 'minutes') % 60;
				const ss = momentFineGara.diff(now, 'seconds') % 60;

				labelTempoRimasto = '';

				if (hh > 0) {
					labelTempoRimasto = hh + ' ore ';
					labelTempoRimasto += mm + ' minuti ';
					labelTempoRimasto += ss + ' secondi';
				}
				else {
					if (mm > 0) {
						labelTempoRimasto = mm + ' minuti ' + ss + ' secondi';
					}
					else {
						labelTempoRimasto = ss + ' secondi';
					}
				}
			}

			exports.labelTempoRimasto = labelTempoRimasto;

			$('#table tr:first-child td:first-child').text(labelTempoRimasto);

			// if (window['simulation']) displayTable(simulation);

		}, 500);

		exports.momentInizioGara = momentInizioGara;
		exports.momentFineGara = momentFineGara;
		exports.labelTempoRimasto = labelTempoRimasto;

	});

}(window));

// setTimeout(function () {
// 	creaGara(['Gaussiani', 'Euclidei', 'Bat-1'], [1234, 0, 0, 0,0 ,0,0,0], 120);
// }, 1000);
