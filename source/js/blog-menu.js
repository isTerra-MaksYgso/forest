var BlogMenuModule = (function() {
	var init = function () {
		_setUpListeners();
		var list = $('.my-articles__list').child().lenght();
		console.log(list);
	};

	var _setUpListeners = function () {
		// прослушка событий.
	}

	return {
		init: init
	};

})();