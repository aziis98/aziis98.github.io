(function(exports) {
	'use strict';

	function text(text) {
		return document.createTextNode(text);
	}

	function displayTable(simulation) {
		const $table = $('#table');

		$table.empty();

		function renderCell(squadra, domanda) {
			const $elem = $('<div></div>');

			$elem.text(squadra.punteggiPerDomanda[domanda.index]);

			const state = squadra.statoPerDomanda[domanda.index];

			if (state === 1) {
				$elem.addClass('good');
			}
			if (state === -1) {
				$elem.addClass('bad');
			}

			if (squadra.jolly === domanda.index) {
				$elem.addClass('jolly');
			}

			return $elem;
		}

		function renderDomandaLabel(domanda) {
			return $($.parseHTML('<div class="domanda"><span class="indice">{0}</span><span class="punteggio">{1}</span></div>'.format(
				domanda.index + 1,
				domanda.punteggio
			)));
		}

		function renderNomeSquadra(squadra) {
			return $($.parseHTML('<div class="squadra"><span class="name">{0}</span><span class="score">{1}<span></div>'.format(
				squadra.name,
				squadra.punteggio
			)));
		}


		const headersPunteggiDomande = simulation.domande.map(d => renderDomandaLabel(d))
		const headers = [text(labelTempoRimasto), ...headersPunteggiDomande];

		const righeSquadre = simulation.squadre
			.map(s => [renderNomeSquadra(s), ...(simulation.domande.map(d => renderCell(s, d)))]);

		$table.append(toTableElement([headers, ...righeSquadre]));
	}

	exports.displayTable = displayTable;

}(window));
