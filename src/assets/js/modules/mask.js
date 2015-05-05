window.mod.mask = function() {

	var init = function(){
		console.log('[brz] begin mask.js');
		initMasks();
	};

	var initMasks = function(){
		var masks = ['(00) 00000-0000', '(00) 0000-00009'],
		maskBehavior = function(val, e, field, options) {
			return val.length > 14 ? masks[0] : masks[1];
		};

		// Masks
		$('.mask-phone').mask(maskBehavior, {onKeyPress:
			function(val, e, field, options) {
				field.mask(maskBehavior(val, e, field, options), options);
			}
		});

		$('.mask-date').mask('00/00/0000');
		$('.mask-cnpj').mask('00.000.000/0000-00', {reverse: true});
		$('.mask-time').mask('00:00:00');
		$('.mask-date-time').mask('00/00/0000 00:00:00');
		$('.mask-cep').mask('00000-000');
		$('.mask-phone-us').mask('(000) 000-0000');
		$('.mask-cpf').mask('000.000.000-00', {reverse: true});
		$('.mask-rg').mask('0.000.000', {reverse: true});
		$('.mask-size').mask('0000,00', {reverse: true});
		$('.mask-money').mask('000.000.000.000.000,00', {reverse: true});
		$('.mask-percent').mask('##0,00%', {reverse: true});
	};

	init();

};
