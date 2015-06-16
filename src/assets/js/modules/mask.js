// Mask
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
		$('.Mask-phone').mask(maskBehavior, {onKeyPress:
			function(val, e, field, options) {
				field.mask(maskBehavior(val, e, field, options), options);
			}
		});

		$('.Mask-date').mask('00/00/0000');
		$('.Mask-cnpj').mask('00.000.000/0000-00', {reverse: true});
		$('.Mask-time').mask('00:00:00');
		$('.Mask-date-time').mask('00/00/0000 00:00:00');
		$('.Mask-cep').mask('00000-000');
		$('.Mask-phone-us').mask('(000) 000-0000');
		$('.Mask-cpf').mask('000.000.000-00', {reverse: true});
		$('.Mask-rg').mask('0.000.000', {reverse: true});
		$('.Mask-size').mask('0000,00', {reverse: true});
		$('.Mask-money').mask('000.000.000.000.000,00', {reverse: true});
		$('.Mask-percent').mask('##0,00%', {reverse: true});
	};

	init();

};
