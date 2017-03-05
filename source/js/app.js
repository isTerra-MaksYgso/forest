var BlogMenuModule = (function() {

	var init = function () {
		_setUpListeners();

		$('.my-articles__link').eq(0).addClass('my-articles__link-active');
		$(window).on("scroll", function() {
			_blogMenuFixed();
			_blogArticlesScroll();
			if ($(window).scrollTop() == 0) {
				if (window.location.hash != "") {
					window.location.hash = "";
					var needUrl = window.location.href.replace("#", "");
					history.pushState('', '', needUrl);
				}
			}
		});

		if (window.location.hash != "") {
			_showBlogSection(window.location.hash, false);
		}
	};


	// прослушка событий
	var _setUpListeners = function () {
		$('.my-articles__link').on('click', function (e){
			e.preventDefault();
			_showBlogSection($(this).attr('href'), true);
			window.location.hash = $(this).attr('href');
		});
	}// прослушка событий -> END


	// фиксация блогового меню 
	var _blogMenuFixed = function () {		
	    if ($(window).scrollTop() > $('.header').height()) {
	    	$('.my-articles__list').addClass('menu-fixed');
	    } else {
	    	$('.my-articles__list').removeClass('menu-fixed');
	    }	    
	}// фиксация блогового меню -> END


	// скролинг статей в блоге и соответствующее изменение в меню блога
	var _blogArticlesScroll = function () {
		$('.my-articles-itself').each(function () {
			var $this = $(this),
				topEdge = $this.offset().top - 60,
				bottomEdge = topEdge + $this.height(),
				wScroll = $(window).scrollTop();
			if(topEdge < wScroll && bottomEdge > wScroll){
				var currentId = $this.data('section');
				$('.my-articles__link').each(function (){
					if ($(this).attr('href') == '#' + currentId) {
						$('.my-articles__link').removeClass('my-articles__link-active')
						$(this).addClass('my-articles__link-active');
						// window.location.hash = $(this).attr('href');
					}
				});
			}
		});
	}// скролинг статей в блоге -> END


	// перемещение по статьям по клику меню
	var _showBlogSection = function (section, isAnimate) {
		var direction = section.replace('#', ''),
			reqSection = $('.my-articles-itself').filter('[data-section="'+direction+'"]'),
			reqSectionPos = reqSection.offset().top;

		if (isAnimate) {
			$('body, html').animate({scrollTop: reqSectionPos}, 500);
		} else {
			$('body, html').scrollTop(reqSectionPos);
		}
	}// перемещение по статьям по клику меню -> END

	return {
		init: init
	};
})();












var mainMenuModule = (function() {
	var init = function () {
		_setUpListeners();

		// то, что должно сразу произойти на странице.
	};


	// прослушка событий
	var _setUpListeners = function () {
		$('#main-menu').on('click', function () {
			$('.main-menu').toggleClass('main-menu--active');
		});
	}

	return {
		init: init
	};

})();








var autorizateForm = (function() {
	var init = function () {
		_setUpListeners();
	};

	// прослушка событий
	var _setUpListeners = function (e) {
		$('#enter').on('click', _submitForm);
	}

	
	var _submitForm = function (e) {
		e.preventDefault();
		var form = $('.login-form'),
			url = 'autorizateForm.php',
			defObj = _ajaxForm(form, url),
			people = form.find('input[name="people"]'),
			chekYes = form.find('input[name="yes"]'),
			chekMaybe = form.find('input[name="maybe"]');
	}

	var _ajaxForm = function (form, url) {
		if (!validation.validateForm(form, 5, 20)) return false;
		if (people.checked == true) {
			console.log('try');
		}

		validation.ajaxForm(form, url);
	}

	return {
		init: init
	};

})();

autorizateForm.init();





















var validation = (function() {
	var init = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		$('form').on('keydown', '.has-error', _removeNeedClass);
		$('form').on('keydown', '.not-error', _removeNeedClass);
	};

	var _removeNeedClass = function () {
		$(this).removeClass('has-error');
		$(this).removeClass('not-error');
	};

	var clearForm = function (form) {
		var form = form;
		form.find('input, textarea').val("");
		$('.login-error-box').css('display','none');
		$('.has-error').removeClass('has-error');
		$('.not-error').removeClass('not-error');
	};


	var validateForm = function (form, minL, maxL) {
		var elements = form.find('input').not('input[type="file"], input[type="hidden"], input[type="checkbox"]'),
			valid = true,
			textarea = form.find('textarea');
		$('.login-error-box').css('display', 'none');

		$.each(elements, function (index, val){
			var element = $(val),
				val = element.val();
			if (val.length === 0 ) {
				element.addClass('has-error');
				element.next('.login-error-box')
					.css('display', 'block')
					.text(element.data("loginContent"));
				valid = false;
			} else {
				if (minL <= val.length && val.length <= maxL) {
					element.addClass('not-error');
				} else {
					element.addClass('has-error');
					element.next('.login-error-box')
						.css('display', 'block')
						.text('Поле должно содержать от '+minL+' до '+maxL+' символов');
					valid = false;
				}
			}
		});

		if (textarea.val().length === 0) {
			textarea.addClass('has-error');
				textarea.next('.login-error-box')
					.css('display', 'block')
					.text(textarea.data("loginContent"));
			valid = false;
		} else {
			if (textarea.val.length > 0 && textarea.val.length <= 3000) {
				textarea.addClass('not-error');
			} else {
				textarea.addClass('has-error');
					textarea.next('.login-error-box')
						.css('display', 'block')
						.text('Поле должно содержать от 1 до 3000 символов');
					valid = false;
			}
		};


		return valid;
	};

	var ajaxForm = function (form, url) {
		console.log('var ajaxForm = function (form, url)');
		data = form.serialize();

		var result = $.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
		}).fail(function (ans) {
			console.log('Проблемы на сервере');
			alert('\n Произошла ошибка на стороне сервера,\n повторите попытку позже! \n');
		});

		return result;
	};

	return {
		init: init,
		validateForm: validateForm,
		ajaxForm: ajaxForm,
		clearForm: clearForm
	};

})();

validation.init();














var contactMeForm = (function() {
	var init = function () {
		_setUpListeners();
	};

	// прослушка событий.
	var _setUpListeners = function () {
		$('#submitMeForm').on('click', _submitForm);
		$('#resetForm').on('click', function(e){
			e.preventDefault();
			validation.clearForm($('.contact-me-form'));
		});
	}

	var _submitForm = function (e) {
		e.preventDefault();
		var form = $('.contact-me-form');

		if(!validation.validateForm(form, 4, 35)) return false;

		alert('Осталось отправить форму!');
	};

	return {
		init: init
	};

})();

contactMeForm.init();




























var preloader = (function(){
	var percentsTotal = 0;
	var preloader = $('.preloader');

	var imgPath = $('*').map(function (ndx, element) {
		var background = $(element).css('background-image');
		var isImg = $(element).is('img');
		var path = '';

		if (background != 'none') {
			path = background.replace('url("', '').replace('")', '');
		}

		if (isImg) {
			path = $(element).attr('src');
		}

		if (path) return path;
	});

	var _setPercents = function(total, current) {
		var percents = Math.ceil(current / total * 100);

		$('.preloader__percents').text(percents + '%');

		/*if (percents >= 100) {
			setTimeout(function () {
				preloader.fadeOut();
			},3000);
		}*/
		if (percents >= 100) {
			preloader.fadeOut();
		}
	}

	var _loadImages = function(images) {

		if (!images.length) preloader.fadeOut();

		images.forEach(function(img, i, images){
			var fakeImage = $('<img>', {
				attr : {
					src : img
				}
			});

			fakeImage.on('load error', function(){
				percentsTotal++;
				_setPercents(images.length, percentsTotal);
			});
		});

	}

	return {
		init: function () {
			var imgs = imgPath.toArray();

			_loadImages(imgs);
		}
	}
}());

$(function () {
	preloader.init();
});













var SliderModule = (function() {
	var init = function () {
		_setUpListeners();
	};

	var _setUpListeners = function () {
		$('slider-next').on('click', _next);
		$('slider-prev').on('click', _prev);
	}

	var i = 0;

	$('.slider-counter--first, .slider-counter--main').text(i+1);
	$('.slider-counter--last').text('last');

	var _next = function () {

	};

	var _prev = function () {

	};

	return {
		init: init
	};

})();

SliderModule.init();


























$(document).ready(function () {

	// Rotate wellcome block
	$('.autorizate-button').on('click', function (e) {
		e.preventDefault();
		$('.wellcome-box-front').css('transform', 'rotateY(-180deg)')
		$('.wellcome-box-login').css('transform', 'rotateY(0deg)');
		setTimeout(function () {
			$('.autorizate-button').hide();
		}, 1300);
	});

	$('#toMain').on('click',function (e) {
		e.preventDefault();
		$('.wellcome-box-front').css('transform', 'rotateY(0deg)');
		$('.wellcome-box-login').css('transform', 'rotateY(180deg)');
		setTimeout(function () {
			$('.autorizate-button').show();
		}, 1300);
	});// Rotate wellcome block -> END


	$('.go-top__icon').on('click', function () {
		$('html, body').animate({scrollTop: 0},500);
	});

	



	BlogMenuModule.init();

	mainMenuModule.init();

	SliderModule.init();
});