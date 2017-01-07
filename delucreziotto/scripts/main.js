// main.js //

(function(exports) {
	'use strict';

	let $settingsSection
	let $playSection

	$(function () {
		$settingsSection = $('#settings-section');
		$playSection = $('#play-section');

		loadTemplate('settings', function (source) {
			$settingsSection.empty().append($.parseHTML(source));
			setupSettingsSection();
		});

		loadTemplate('play', function (source) {
			$playSection.empty().append($.parseHTML(source));
			setupPlaySection();
		});

		$settingsSection.show();
		$playSection.hide();

	});

	function setupSettingsSection() {
		// async
		let renderItemRisposta;
		let renderItemSquadra;

		const $listaRisposte = $('#lista-risposte');
		const $listaSquadre = $('#lista-squadre');

		const $numeroRisposte = $('#numero-risposte');
		const $numeroSquadre = $('#numero-squadre');

		// async
		loadTemplate('item-risposta', function (source) {
			renderItemRisposta = compileTemplate(source);

			displayListaRisposte();
		});

		// async
		loadTemplate('item-squadra', function (source) {
			renderItemSquadra = compileTemplate(source);

			displayListaSquadre();
		});

		// listaRisposte

		let hackState = _.range(50).map(h => '0000');
		function displayListaRisposte() {
			$listaRisposte.empty();

			_.range(Number($numeroRisposte.val())).forEach(i => {
				const $item = $(renderItemRisposta({ index: i, value: hackState[i] }));
				$item.find('input').on('change', function () {
					hackState[i] = $(this).val();
				});
				$listaRisposte.append($item)
			});
		}

		$numeroRisposte.on('change', function () {
			displayListaRisposte();
		});

		// listaSquadre

		function displayListaSquadre() {
			$listaSquadre.empty();

			_.range(Number($numeroSquadre.val())).forEach(i =>
				$listaSquadre.append(renderItemSquadra({ index: i, value: undefined }))
			);
		}

		$numeroSquadre.on('change', function () {
			displayListaSquadre();
		});

		//

		$('#crea-gara').on('click', function () {
			const risposte = $('.item-risposta input')
				.map((i, el) => $(el).val().trim())
				.map(vl => Number(vl))
				.toArray();
			const squadre = $('.item-squadra input')
				.map((i, el) => $(el).val().trim())
				.toArray();
			const durata = Number($('#durata-gara').val());
			const deriva = Number($('#deriva-gara').val())

			if (risposte.filter(r => isNaN(r)).length > 0 || squadre.filter(r => r.trim().length === 0).length > 0) {
				console.error('Invalid inputs');
			}
			else {
				creaGara(squadre, risposte, durata, deriva);
				$settingsSection.hide();
				$playSection.show();
			}
		})
	}

	function setupPlaySection() {
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
	}

}(window));

// setTimeout(function () {
// 	creaGara(['Gaussiani', 'Euclidei', 'Bat-1'], [1234, 0, 0, 0,0 ,0,0,0], 120);
// }, 1000);
