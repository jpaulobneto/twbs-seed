window.mod.common = function() {

	// Scope
	var that = this;

	var init = function() {
		console.log('[my] begin common.js');
		window.mod['mask'] = new window.mod['mask']();
	};

	// Helper serialize
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	// Form Validation Function
	this.validateFields = function(formData,form){
		for(var key in formData){
			// console.log(key);
			// console.log(formData[key]);
			if(key == "data[Contact][email]"){
				if(!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(formData[key]))){
					// console.log('nao deu test');
					// console.log(form.find('input[type=email]').parent());
					form.find('input[type=email]').parent().addClass('danger');
					return false;
				}
				else {
					form.find('input[type=email]').parent().removeClass('danger');
				}
			}else{
				if(formData[key] == ''){
					// console.log('vazio');
					// console.log(form.find('[name="'+key+'"]').parent());
					form.find('[name="'+key+'"]').parent().addClass('danger');
					return false;
				}
				else {
					form.find('[name="'+key+'"]').parent().removeClass('danger');
				}
			}
		}
		return true;
	};

	init();

};
