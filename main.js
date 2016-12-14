(function(exports) {
	'use strict';

	$('#show-all')
		.hide()
		.on('click', function () {
			postQueue.forEach(post => {
				addPost(post);
			});
			$(this).hide();
		});

	const $posts = $('#posts');
	let postQueue = [];

	$.get('/website.json', function (data) {
		data.posts.forEach((post, i) => {
			if (i < 10) {
				addPost(post);
			}
			else {
				$('#show-all').show();
				postQueue.push(post);
			}
		});
	});

	function addPost(post) {
		let postElement
		$posts.append(postElement = fromTemplate('post', post));
		$(postElement).on('click', function () {
			window.location.href = post.link;
		});
	}

	function fromTemplate(templateId, data) {
		data = data || {};

		const templateCode = $('#' + templateId).html();

		const compiledTemplate = templateCode
			.replace(/\{\{(.+?)\}\}/g, function (match, code) {
				return (function() {
					return eval(code);
				}.bind(data)());
			});

		return $.parseHTML(compiledTemplate.trim())[0];
	}

	exports.fromTemplate = fromTemplate;

}(window));
