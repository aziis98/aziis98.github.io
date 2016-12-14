(function(exports) {
	'use strict';

	const $board = $('#board');

	// load / save notes

	if (localStorage.getItem('notes2d.store')) {
		loadAll();
	}

	// hides all menu at start except the main one

	$('#menu-add').hide();

	// main menu

	$('#btn-add').click(function () {
		$('#menu-add').show();
		$('#menu-main').hide();
	});

	// $('#btn-save').click(function () {
	// 	saveAll();
	// });

	// add menu

	$('#btn-add-text').click(function () {
		addTextNote()

		// show initial menus
		$('#menu-main').show();
		$('#menu-add').hide();
	});

	$('#btn-add-flow').click(function() {


	    // show initial menus
	    $('#menu-main').show();
	    $('#menu-add').hide();
	});

	$('#btn-add-image').click(function() {

	    // show initial menus
	    $('#menu-main').show();
	    $('#menu-add').hide();
	});

	$('#btn-add-group').click(function() {
		addGroup()

	    // show initial menus
	    $('#menu-main').show();
	    $('#menu-add').hide();
	});

	function addGroup() {
		const $group = $(fromTemplate('template-note-group'))
			.appendTo($board)
			.draggable({
				handle: '.handle',
				snap: true
			});

		$group
			.on('dragstop', function () {
				saveAll();
			});

		return $group;
	}

	function addTextNote() {
		const $note = $(fromTemplate('template-note-text'))
			.appendTo($board)
			.draggable({
				handle: '.handle',
				snap: true
			});

		$note
			.on('dragstop', function () {
				saveAll();
			})
			.find('.text')
				.on('input', function () {
					// const innerHTML = $(this).html();
					// const pattern = /(?:^|<br>)(#+)(\S+?)(?:$|<br>)/
					// if (innerHTML.match(pattern)) {
					// 	$(this).html(innerHTML.replace(pattern, function (match, hashes, title) {
					// 		return '<h' + hashes.length + '>' + title + '</h' + hashes.length + '>';
					// 	}));
					// }

					saveAll();
				})

		return $note;
	}

	// localstorage save

	function saveAll() {
		const store = $('#board .note')
			.map(function () {
				return {
					type: 'text',
					text: $(this).find('.text').html(),
					offset: $(this).offset()
				};
			})
			.get()

		// console.log('Saving: ', store);

		localStorage.setItem('notes2d.store', JSON.stringify(store));
	}

	function loadAll() {
		console.log('Loading the store');
		const store = JSON.parse(localStorage.getItem('notes2d.store'));

		store.forEach(note => {
			if (note.type === 'text') {
				const $note = addTextNote();

				$note.find('.text').html(note.text);
				$note.offset(note.offset);
			}
			else {
				console.error('Unable to load note', note);
			}
		});
	}

	function fromTemplate(templateId, data) {
		data = data || {};

		const templateCode = $('#' + templateId).html();

		const compiledTemplate = templateCode
			.replace(/\{\{(.+?)\}\}/, function (match, code) {
				return (function() {
					return eval(code);
				}.bind(data)());
			});

		return $.parseHTML(compiledTemplate.trim())[0];
	}

	exports.fromTemplate = fromTemplate;

}(window));
