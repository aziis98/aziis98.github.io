// framework.js //

(function(exports) {

    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }

    exports.compileTemplate = function compileTemplate(source) {
        return function(data) {
            data = data || {};

            const compiledTemplate = source.replace(/\{\{(.+?)\}\}/g, function(match, code) {
                with(data) {
                    return eval(code);
                }
            });

            return $.parseHTML(compiledTemplate.trim())[0];
        }
    };

    exports.loadTemplate = function loadTemplate(name, cb) {
        $.get('./templates/' + name + '.template.html', function(data) {
            cb(data);
        });
    }

    // function injectAdlLoads() {
    //     const $adlLoadList = document.querySelectorAll('adl-load');
    //     let c = 0;
	//
    //     $adlLoadList.forEach(elem => {
    //         const src = elem.attributes['src'].value + '.template.html';
	//
    //         loadPartialHMTL(src, function(injectedElem) {
    //             console.log('Loaded: ' + src);
    //             $(elem).replaceWith(injectedElem);
	//
    //             c++;
	//
    //             if (c === $adlLoadList.length) {
    //                 $(window).trigger('post-injection');
    //             }
    //         })
    //     });
    // }

    $(function() {
        // injectAdlLoads();
    });

}(window));
