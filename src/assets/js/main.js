(function(window, document, $) {
	'use strict';

	window.mod = {};

	$(function(){
		// Carregando os modulos
		window.mod.common = new window.mod.common();

		var bodyClasses = $('body').attr('class').split(' ');
		$.each(bodyClasses, function(key, val) {
			val = val.replace('-', '');
			if (window.mod[val] !== undefined) {
				// console.log(key + ' => ' + val);
				window.mod[val] = new window.mod[val]();
			}
		});
	});

})(window, document, jQuery);
