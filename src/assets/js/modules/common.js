// Common
window.mod.common = function() {

	// Scope
	var that = this;

	var init = function() {
		console.log('[my] begin common.js');
		window.mod['maps'] = new window.mod['maps']();
		window.mod['mask'] = new window.mod['mask']();
	};

	init();

};
