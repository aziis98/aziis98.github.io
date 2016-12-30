// renderers.js //

(function(exports) {
	'use strict';

	exports.toTableElement = function toTableElement(array2d) {

        const $table = $(document.createElement('table'));

        _.each(array2d, function(row) {
            const $row = $(document.createElement('tr'));

            _.each(row, function(elem) {
                const $elem = $(document.createElement('td'));
                $elem.append(elem);
                $row.append($elem);
            });

            $table.append($row);
        });

        return $table;
    }

	exports.renderSquadraOption = function (name) {
		return $($.parseHTML('<option>' + name + '</option>'));
	};

}(window));
