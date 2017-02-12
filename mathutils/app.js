(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ = require('lodash/fp');

window._ = _;

document.addEventListener('DOMContentLoaded', function () {

	var $resultPanel = document.querySelector('.result');
	$resultPanel.style.display = 'none';

	var $compute = document.querySelector('#compute');
	$compute.onclick = onCommand;

	document.querySelector('#expression').focus();
	document.querySelector('#expression').onkeydown = function (e) {
		if (e.key === 'Enter') {
			onCommand();
		}
	};

	function onCommand() {
		$resultPanel.style.display = '';

		var result = compute(document.querySelector('#expression').value.trim());
		document.querySelector('.result .content').innerHTML = '<pre><code>' + result + '</code></pre>';
	}
});

function compute(query) {
	if (query.trim().length === 0) return 'You may type something';

	try {
		return calculate(query).join(' ');
	} catch (e) {
		return JSON.stringify({
			error: e.message
		});
	}
}

function calculate(expression) {
	var tokens = tokenize(expression).filter(function (token) {
		return !token.match(/\s+/);
	});

	tokens = scanForBinary(tokens, _.contains(_, ['%', 'mod']), function (a, op, b) {
		return parseFloat(a) % parseFloat(b);
	});

	tokens = scanForBinary(tokens, _.contains(_, ['*', '/']), function (a, op, b) {
		if (op === '*') {
			return parseFloat(a) * parseFloat(b);
		} else if (op === '/') {
			return parseFloat(a) / parseFloat(b);
		}
	});

	tokens = scanForBinary(tokens, _.contains(_, ['+', '-']), function (a, op, b) {
		if (op === '+') {
			return parseFloat(a) + parseFloat(b);
		} else if (op === '-') {
			return parseFloat(a) - parseFloat(b);
		}
	});

	tokens = scanForBinary(tokens, _.contains(_, ['>', '<', '<=', '>=']), function (a, op, b) {
		switch (op) {
			case '>':
				return parseFloat(a) > parseFloat(b);
				break;
			case '<':
				return parseFloat(a) > parseFloat(b);
				break;
			case '>=':
				return parseFloat(a) >= parseFloat(b);
				break;
			case '<=':
				return parseFloat(a) >= parseFloat(b);
				break;
		}
	});

	tokens = scanForBinary(tokens, _.contains(_, ['or', 'and']), function (a, op, b) {
		switch (op) {
			case 'and':
				return a && b;
				break;
			case 'or':
				return a || b;
				break;
		}
	});

	return tokens;
}

function scanForBinary(list, symbolPredicate, mergeFn) {
	var reachedIndex = 0;

	theWhile: while (true) {
		for (var i = reachedIndex; i < list.length; i++) {
			reachedIndex = i;
			if (symbolPredicate(list[i])) {
				list.splice(i - 1, 3, mergeFn(list[i - 1], list[i], list[i + 1]));
				continue theWhile;
			}
		}
		return list;
	}
}

function isChar(character) {
	return function (char) {
		return char.length === 1 && char === character;
	};
}

function isLetter(char) {
	return char.length === 1 && char.match(/[a-z]/i);
}

function isDigit(char) {
	return char.length === 1 && char.match(/[0-9]/);
}

function tokenize(source) {
	var list = [source[0]];

	var cases = [[isDigit, isDigit], [isLetter, isLetter], [isLetter, isDigit], [isDigit, isChar('.')], [isChar('.'), isDigit], [isChar(' '), isChar(' ')], [isChar('>'), isChar('=')], [isChar('<'), isChar('=')]];

	function testChars(a, b) {
		var result = false;
		cases.forEach(function (caseElem) {
			var _caseElem = _slicedToArray(caseElem, 2),
			    lft = _caseElem[0],
			    rgt = _caseElem[1];

			if (lft(a) && rgt(b)) result = true;
		});
		return result;
	}

	for (var i = 1; i < source.length; i++) {
		var lastStr = list[list.length - 1];

		if (testChars(lastStr[lastStr.length - 1], source[i])) {
			list[list.length - 1] += source[i];
		} else {
			list.push(source[i]);
		}
	}

	return list;
}

function assert(expected, actual) {
	if (!_.isEqual(expected, actual)) throw 'Assertion failed, got ' + JSON.stringify(actual) + ' insted of ' + JSON.stringify(expected);else console.log('Assertion passed, got ' + JSON.stringify(actual));
}

function test1() {
	assert(['1', ' '], tokenize('1 '));
	assert(['1', ' ', '1'], tokenize('1 1'));
	assert(['11'], tokenize('11'));
	assert(['11', ' '], tokenize('11 '));
	assert(['111'], tokenize('111'));

	assert(['111', ' '], tokenize('111 '));
	assert(['1', ' ', '1', ' '], tokenize('1 1 '));

	assert(['111', '  ', '10', ' '], tokenize('111  10 '));
	assert(['list', ' ', '=', ' ', '10.0', ';'], tokenize('list = 10.0;'));
}
// console.log('Testing:');
// test1();

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map