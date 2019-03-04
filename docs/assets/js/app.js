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
			defObj = _ajaxForm(form, url);
	}

	var _ajaxForm = function (form, url) {
		if (!validation.validateForm(form, 5, 20)) return false;

		var people = form.find('input[name="people"]'),
			robot = form.find('input[name="robot"]:checked').val();

		if ((people.prop('checked') == true) && (robot == 'yes')) {			
			validation.ajaxForm(form, url);
		} else {
			alert('Вы не прошли проверку на робота :(');
		}
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
		var elements = form.find('input').not('input[type="file"], input[type="hidden"], input[type="checkbox"], input[type="radio"]'),
			valid = true,
			textarea = form.find('textarea');

		$('.login-error-box').css('display', 'none');
		$.each(elements, function (index, val){
			var element = $(val),
				val = element.val();
			if (val.length === 0 ) {
				element.addClass('has-error');
				element.next('.login-error-box').css('display', 'block').text(element.data("loginContent"));
				valid = false;
			} else {
				if ((minL <= val.length) && (val.length <= maxL)) {
					element.addClass('not-error');
				} else {
					element.addClass('has-error');
					element.next('.login-error-box').css('display', 'block').text('Поле должно содержать от '+minL+' до '+maxL+' символов');
					valid = false;
				}
			}
		});

		if (!(form.is('textarea'))) return false;

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

		if (percents >= 100) {
			setTimeout(function () {
				preloader.fadeOut();
			},3000);
		}
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













/*var SliderModule = (function() {
	var init = function () {
		_setUpListeners();
	};

	var nextSlides = $('.my-works-slider__buttons-next .my-works-slider__element'),
			prevSlides = $('.my-works-slider__buttons-prev .my-works-slider__element'),
			isAnimate = false,
			allSlides = $('.my-works-slider__elements').children('.my-works-slider__element').length/2,
			animateTime = 300;

	nextSlides.eq(0).css('top', '0');
	prevSlides.eq(allSlides - 1).css('top', '0');

	var _setUpListeners = function () {
		$('.slider-next').on('click', function () {
			// if (!isAnimate) {
				// isAnimate = true;
			_slider();
			// }
		});
	}


	var _slider = function () {

		var i = 0,
			lastNumber = allSlides - 1;
			

		nextSlides.css('opacity','1');
		prevSlides.css('opacity','1');

		if (i <= lastNumber) {

			$(nextSlides.eq(i)).animate({
				'top': '100%'
			}, animateTime, function () {
				$(this).css('opacity','0');
				$(this).css('top','-100%');
			});
			$(nextSlides.eq(i+1)).animate({
				'top': '0'
			}, animateTime, function () {
				isAnimate = false;
			});

			$(prevSlides.eq(lastNumber)).animate({
				'top': '-100%'
			}, animateTime, function () {
				$(this).css('opacity','0');
				$(this).css('top','100%');
			});
			$(prevSlides.eq(lastNumber-1)).animate({
				'top': '0'
			}, animateTime, function () {
				isAnimate = false;
			});

			i++;
			lastNumber--;

		} else {

			i = 0;
			lastNumber = allSlides - 1;


			$(nextSlides.eq(lastNumber)).animate({
				'top': '100%'
			}, animateTime, function () {
				$(this).css('opacity','0');
				$(this).css('top','-100%');
			});
			$(nextSlides.eq(i)).animate({
				'top': '0'
			}, animateTime, function () {
				$(this).css('top','100%');
			});

			$(prevSlides.eq(i)).animate({
				'top': '-100%'
			}, animateTime);
			$(prevSlides.eq(lastNumber)).animate({
				'top': '0'
			}, animateTime, function () {
				isAnimate = false;
			});

			return isAnimate;
		}
		
	};
	return {
		init: init
	};

})();

SliderModule.init();*/























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



	//admin menu
	$('.admin-tabs__link').on('click', function (e){
		e.preventDefault();
	});
	$('.admin-current-block').eq(0).css('display', 'block');
	$('.admin-tabs__item').on('click', function () {
		var needBlockName = $(this).children('.admin-tabs__link'),
			needBlockId = needBlockName.attr('href').replace('#', '');
		$(this)
			.addClass('admin-tabs__item--active')
			.siblings('.admin-tabs__item')
			.removeClass('admin-tabs__item--active');
		$('#'+needBlockId)
			.css('display', 'block')
			.siblings('.admin-current-block')
			.css('display', 'none');
		
	});//admin menu -> END

	



	BlogMenuModule.init();

	mainMenuModule.init();

	// SliderModule.init();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmxvZ01lbnVNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NldFVwTGlzdGVuZXJzKCk7XHJcblxyXG5cdFx0JCgnLm15LWFydGljbGVzX19saW5rJykuZXEoMCkuYWRkQ2xhc3MoJ215LWFydGljbGVzX19saW5rLWFjdGl2ZScpO1xyXG5cdFx0JCh3aW5kb3cpLm9uKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRfYmxvZ01lbnVGaXhlZCgpO1xyXG5cdFx0XHRfYmxvZ0FydGljbGVzU2Nyb2xsKCk7XHJcblx0XHRcdGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPT0gMCkge1xyXG5cdFx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAhPSBcIlwiKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiXCI7XHJcblx0XHRcdFx0XHR2YXIgbmVlZFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xyXG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCBuZWVkVXJsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAhPSBcIlwiKSB7XHJcblx0XHRcdF9zaG93QmxvZ1NlY3Rpb24od2luZG93LmxvY2F0aW9uLmhhc2gsIGZhbHNlKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0Ly8g0L/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5XHJcblx0dmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5teS1hcnRpY2xlc19fbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRfc2hvd0Jsb2dTZWN0aW9uKCQodGhpcykuYXR0cignaHJlZicpLCB0cnVlKTtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdH0pO1xyXG5cdH0vLyDQv9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LkgLT4gRU5EXHJcblxyXG5cclxuXHQvLyDRhNC40LrRgdCw0YbQuNGPINCx0LvQvtCz0L7QstC+0LPQviDQvNC10L3RjiBcclxuXHR2YXIgX2Jsb2dNZW51Rml4ZWQgPSBmdW5jdGlvbiAoKSB7XHRcdFxyXG5cdCAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gJCgnLmhlYWRlcicpLmhlaWdodCgpKSB7XHJcblx0ICAgIFx0JCgnLm15LWFydGljbGVzX19saXN0JykuYWRkQ2xhc3MoJ21lbnUtZml4ZWQnKTtcclxuXHQgICAgfSBlbHNlIHtcclxuXHQgICAgXHQkKCcubXktYXJ0aWNsZXNfX2xpc3QnKS5yZW1vdmVDbGFzcygnbWVudS1maXhlZCcpO1xyXG5cdCAgICB9XHQgICAgXHJcblx0fS8vINGE0LjQutGB0LDRhtC40Y8g0LHQu9C+0LPQvtCy0L7Qs9C+INC80LXQvdGOIC0+IEVORFxyXG5cclxuXHJcblx0Ly8g0YHQutGA0L7Qu9C40L3QsyDRgdGC0LDRgtC10Lkg0LIg0LHQu9C+0LPQtSDQuCDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidC10LUg0LjQt9C80LXQvdC10L3QuNC1INCyINC80LXQvdGOINCx0LvQvtCz0LBcclxuXHR2YXIgX2Jsb2dBcnRpY2xlc1Njcm9sbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5teS1hcnRpY2xlcy1pdHNlbGYnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0XHR0b3BFZGdlID0gJHRoaXMub2Zmc2V0KCkudG9wIC0gNjAsXHJcblx0XHRcdFx0Ym90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkdGhpcy5oZWlnaHQoKSxcclxuXHRcdFx0XHR3U2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRpZih0b3BFZGdlIDwgd1Njcm9sbCAmJiBib3R0b21FZGdlID4gd1Njcm9sbCl7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRJZCA9ICR0aGlzLmRhdGEoJ3NlY3Rpb24nKTtcclxuXHRcdFx0XHQkKCcubXktYXJ0aWNsZXNfX2xpbmsnKS5lYWNoKGZ1bmN0aW9uICgpe1xyXG5cdFx0XHRcdFx0aWYgKCQodGhpcykuYXR0cignaHJlZicpID09ICcjJyArIGN1cnJlbnRJZCkge1xyXG5cdFx0XHRcdFx0XHQkKCcubXktYXJ0aWNsZXNfX2xpbmsnKS5yZW1vdmVDbGFzcygnbXktYXJ0aWNsZXNfX2xpbmstYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnbXktYXJ0aWNsZXNfX2xpbmstYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0vLyDRgdC60YDQvtC70LjQvdCzINGB0YLQsNGC0LXQuSDQsiDQsdC70L7Qs9C1IC0+IEVORFxyXG5cclxuXHJcblx0Ly8g0L/QtdGA0LXQvNC10YnQtdC90LjQtSDQv9C+INGB0YLQsNGC0YzRj9C8INC/0L4g0LrQu9C40LrRgyDQvNC10L3RjlxyXG5cdHZhciBfc2hvd0Jsb2dTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIGlzQW5pbWF0ZSkge1xyXG5cdFx0dmFyIGRpcmVjdGlvbiA9IHNlY3Rpb24ucmVwbGFjZSgnIycsICcnKSxcclxuXHRcdFx0cmVxU2VjdGlvbiA9ICQoJy5teS1hcnRpY2xlcy1pdHNlbGYnKS5maWx0ZXIoJ1tkYXRhLXNlY3Rpb249XCInK2RpcmVjdGlvbisnXCJdJyksXHJcblx0XHRcdHJlcVNlY3Rpb25Qb3MgPSByZXFTZWN0aW9uLm9mZnNldCgpLnRvcDtcclxuXHJcblx0XHRpZiAoaXNBbmltYXRlKSB7XHJcblx0XHRcdCQoJ2JvZHksIGh0bWwnKS5hbmltYXRlKHtzY3JvbGxUb3A6IHJlcVNlY3Rpb25Qb3N9LCA1MDApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCgnYm9keSwgaHRtbCcpLnNjcm9sbFRvcChyZXFTZWN0aW9uUG9zKTtcclxuXHRcdH1cclxuXHR9Ly8g0L/QtdGA0LXQvNC10YnQtdC90LjQtSDQv9C+INGB0YLQsNGC0YzRj9C8INC/0L4g0LrQu9C40LrRgyDQvNC10L3RjiAtPiBFTkRcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG52YXIgbWFpbk1lbnVNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHJcblx0XHQvLyDRgtC+LCDRh9GC0L4g0LTQvtC70LbQvdC+INGB0YDQsNC30YMg0L/RgNC+0LjQt9C+0LnRgtC4INC90LAg0YHRgtGA0LDQvdC40YbQtS5cclxuXHR9O1xyXG5cclxuXHJcblx0Ly8g0L/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5XHJcblx0dmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJyNtYWluLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5tYWluLW1lbnUnKS50b2dnbGVDbGFzcygnbWFpbi1tZW51LS1hY3RpdmUnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG52YXIgYXV0b3JpemF0ZUZvcm0gPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHQvLyDQv9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdCQoJyNlbnRlcicpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtKTtcclxuXHR9XHJcblxyXG5cdFxyXG5cdHZhciBfc3VibWl0Rm9ybSA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQoJy5sb2dpbi1mb3JtJyksXHJcblx0XHRcdHVybCA9ICdhdXRvcml6YXRlRm9ybS5waHAnLFxyXG5cdFx0XHRkZWZPYmogPSBfYWpheEZvcm0oZm9ybSwgdXJsKTtcclxuXHR9XHJcblxyXG5cdHZhciBfYWpheEZvcm0gPSBmdW5jdGlvbiAoZm9ybSwgdXJsKSB7XHJcblx0XHRpZiAoIXZhbGlkYXRpb24udmFsaWRhdGVGb3JtKGZvcm0sIDUsIDIwKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHZhciBwZW9wbGUgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJwZW9wbGVcIl0nKSxcclxuXHRcdFx0cm9ib3QgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJyb2JvdFwiXTpjaGVja2VkJykudmFsKCk7XHJcblxyXG5cdFx0aWYgKChwZW9wbGUucHJvcCgnY2hlY2tlZCcpID09IHRydWUpICYmIChyb2JvdCA9PSAneWVzJykpIHtcdFx0XHRcclxuXHRcdFx0dmFsaWRhdGlvbi5hamF4Rm9ybShmb3JtLCB1cmwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YWxlcnQoJ9CS0Ysg0L3QtSDQv9GA0L7RiNC70Lgg0L/RgNC+0LLQtdGA0LrRgyDQvdCwINGA0L7QsdC+0YLQsCA6KCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5hdXRvcml6YXRlRm9ybS5pbml0KCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciB2YWxpZGF0aW9uID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NldFVwTGlzdGVuZXJzKCk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJ2Zvcm0nKS5vbigna2V5ZG93bicsICcuaGFzLWVycm9yJywgX3JlbW92ZU5lZWRDbGFzcyk7XHJcblx0XHQkKCdmb3JtJykub24oJ2tleWRvd24nLCAnLm5vdC1lcnJvcicsIF9yZW1vdmVOZWVkQ2xhc3MpO1xyXG5cdH07XHJcblxyXG5cdHZhciBfcmVtb3ZlTmVlZENsYXNzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdub3QtZXJyb3InKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgY2xlYXJGb3JtID0gZnVuY3Rpb24gKGZvcm0pIHtcclxuXHRcdHZhciBmb3JtID0gZm9ybTtcclxuXHRcdGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhJykudmFsKFwiXCIpO1xyXG5cdFx0JCgnLmxvZ2luLWVycm9yLWJveCcpLmNzcygnZGlzcGxheScsJ25vbmUnKTtcclxuXHRcdCQoJy5oYXMtZXJyb3InKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHQkKCcubm90LWVycm9yJykucmVtb3ZlQ2xhc3MoJ25vdC1lcnJvcicpO1xyXG5cdH07XHJcblxyXG5cclxuXHR2YXIgdmFsaWRhdGVGb3JtID0gZnVuY3Rpb24gKGZvcm0sIG1pbkwsIG1heEwpIHtcclxuXHRcdHZhciBlbGVtZW50cyA9IGZvcm0uZmluZCgnaW5wdXQnKS5ub3QoJ2lucHV0W3R5cGU9XCJmaWxlXCJdLCBpbnB1dFt0eXBlPVwiaGlkZGVuXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0sIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLFxyXG5cdFx0XHR2YWxpZCA9IHRydWUsXHJcblx0XHRcdHRleHRhcmVhID0gZm9ybS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cclxuXHRcdCQoJy5sb2dpbi1lcnJvci1ib3gnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbiAoaW5kZXgsIHZhbCl7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGVsZW1lbnQudmFsKCk7XHJcblx0XHRcdGlmICh2YWwubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHRcdGVsZW1lbnQubmV4dCgnLmxvZ2luLWVycm9yLWJveCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLnRleHQoZWxlbWVudC5kYXRhKFwibG9naW5Db250ZW50XCIpKTtcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICgobWluTCA8PSB2YWwubGVuZ3RoKSAmJiAodmFsLmxlbmd0aCA8PSBtYXhMKSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbm90LWVycm9yJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5uZXh0KCcubG9naW4tZXJyb3ItYm94JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykudGV4dCgn0J/QvtC70LUg0LTQvtC70LbQvdC+INGB0L7QtNC10YDQttCw0YLRjCDQvtGCICcrbWluTCsnINC00L4gJyttYXhMKycg0YHQuNC80LLQvtC70L7QsicpO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmICghKGZvcm0uaXMoJ3RleHRhcmVhJykpKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHRleHRhcmVhLnZhbCgpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHR0ZXh0YXJlYS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdHRleHRhcmVhLm5leHQoJy5sb2dpbi1lcnJvci1ib3gnKVxyXG5cdFx0XHRcdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxyXG5cdFx0XHRcdC50ZXh0KHRleHRhcmVhLmRhdGEoXCJsb2dpbkNvbnRlbnRcIikpO1xyXG5cdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRleHRhcmVhLnZhbC5sZW5ndGggPiAwICYmIHRleHRhcmVhLnZhbC5sZW5ndGggPD0gMzAwMCkge1xyXG5cdFx0XHRcdHRleHRhcmVhLmFkZENsYXNzKCdub3QtZXJyb3InKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0YXJlYS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdFx0dGV4dGFyZWEubmV4dCgnLmxvZ2luLWVycm9yLWJveCcpXHJcblx0XHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcclxuXHRcdFx0XHRcdC50ZXh0KCfQn9C+0LvQtSDQtNC+0LvQttC90L4g0YHQvtC00LXRgNC20LDRgtGMINC+0YIgMSDQtNC+IDMwMDAg0YHQuNC80LLQvtC70L7QsicpO1xyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHZhbGlkO1xyXG5cdH07XHJcblxyXG5cdHZhciBhamF4Rm9ybSA9IGZ1bmN0aW9uIChmb3JtLCB1cmwpIHtcclxuXHRcdGRhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpO1xyXG5cclxuXHRcdHZhciByZXN1bHQgPSAkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0fSkuZmFpbChmdW5jdGlvbiAoYW5zKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCfQn9GA0L7QsdC70LXQvNGLINC90LAg0YHQtdGA0LLQtdGA0LUnKTtcclxuXHRcdFx0YWxlcnQoJ1xcbiDQn9GA0L7QuNC30L7RiNC70LAg0L7RiNC40LHQutCwINC90LAg0YHRgtC+0YDQvtC90LUg0YHQtdGA0LLQtdGA0LAsXFxuINC/0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgyDQv9C+0LfQttC1ISBcXG4nKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXQsXHJcblx0XHR2YWxpZGF0ZUZvcm06IHZhbGlkYXRlRm9ybSxcclxuXHRcdGFqYXhGb3JtOiBhamF4Rm9ybSxcclxuXHRcdGNsZWFyRm9ybTogY2xlYXJGb3JtXHJcblx0fTtcclxufSkoKTtcclxuXHJcbnZhbGlkYXRpb24uaW5pdCgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG52YXIgY29udGFjdE1lRm9ybSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZXRVcExpc3RlbmVycygpO1xyXG5cdH07XHJcblxyXG5cdC8vINC/0YDQvtGB0LvRg9GI0LrQsCDRgdC+0LHRi9GC0LjQuS5cclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnI3N1Ym1pdE1lRm9ybScpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtKTtcclxuXHRcdCQoJyNyZXNldEZvcm0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR2YWxpZGF0aW9uLmNsZWFyRm9ybSgkKCcuY29udGFjdC1tZS1mb3JtJykpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR2YXIgX3N1Ym1pdEZvcm0gPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKCcuY29udGFjdC1tZS1mb3JtJyk7XHJcblxyXG5cdFx0aWYoIXZhbGlkYXRpb24udmFsaWRhdGVGb3JtKGZvcm0sIDQsIDM1KSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGFsZXJ0KCfQntGB0YLQsNC70L7RgdGMINC+0YLQv9GA0LDQstC40YLRjCDRhNC+0YDQvNGDIScpO1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5jb250YWN0TWVGb3JtLmluaXQoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKXtcclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDA7XHJcblx0dmFyIHByZWxvYWRlciA9ICQoJy5wcmVsb2FkZXInKTtcclxuXHJcblx0dmFyIGltZ1BhdGggPSAkKCcqJykubWFwKGZ1bmN0aW9uIChuZHgsIGVsZW1lbnQpIHtcclxuXHRcdHZhciBiYWNrZ3JvdW5kID0gJChlbGVtZW50KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcclxuXHRcdHZhciBpc0ltZyA9ICQoZWxlbWVudCkuaXMoJ2ltZycpO1xyXG5cdFx0dmFyIHBhdGggPSAnJztcclxuXHJcblx0XHRpZiAoYmFja2dyb3VuZCAhPSAnbm9uZScpIHtcclxuXHRcdFx0cGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsICcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNJbWcpIHtcclxuXHRcdFx0cGF0aCA9ICQoZWxlbWVudCkuYXR0cignc3JjJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhdGgpIHJldHVybiBwYXRoO1xyXG5cdH0pO1xyXG5cclxuXHR2YXIgX3NldFBlcmNlbnRzID0gZnVuY3Rpb24odG90YWwsIGN1cnJlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50cyA9IE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xyXG5cclxuXHRcdCQoJy5wcmVsb2FkZXJfX3BlcmNlbnRzJykudGV4dChwZXJjZW50cyArICclJyk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0XHR9LDMwMDApO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIF9sb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XHJcblxyXG5cdFx0aWYgKCFpbWFnZXMubGVuZ3RoKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cclxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltZywgaSwgaW1hZ2VzKXtcclxuXHRcdFx0dmFyIGZha2VJbWFnZSA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmMgOiBpbWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZmFrZUltYWdlLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdFx0X3NldFBlcmNlbnRzKGltYWdlcy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBpbWdzID0gaW1nUGF0aC50b0FycmF5KCk7XHJcblxyXG5cdFx0XHRfbG9hZEltYWdlcyhpbWdzKTtcclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qdmFyIFNsaWRlck1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZXRVcExpc3RlbmVycygpO1xyXG5cdH07XHJcblxyXG5cdHZhciBuZXh0U2xpZGVzID0gJCgnLm15LXdvcmtzLXNsaWRlcl9fYnV0dG9ucy1uZXh0IC5teS13b3Jrcy1zbGlkZXJfX2VsZW1lbnQnKSxcclxuXHRcdFx0cHJldlNsaWRlcyA9ICQoJy5teS13b3Jrcy1zbGlkZXJfX2J1dHRvbnMtcHJldiAubXktd29ya3Mtc2xpZGVyX19lbGVtZW50JyksXHJcblx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlLFxyXG5cdFx0XHRhbGxTbGlkZXMgPSAkKCcubXktd29ya3Mtc2xpZGVyX19lbGVtZW50cycpLmNoaWxkcmVuKCcubXktd29ya3Mtc2xpZGVyX19lbGVtZW50JykubGVuZ3RoLzIsXHJcblx0XHRcdGFuaW1hdGVUaW1lID0gMzAwO1xyXG5cclxuXHRuZXh0U2xpZGVzLmVxKDApLmNzcygndG9wJywgJzAnKTtcclxuXHRwcmV2U2xpZGVzLmVxKGFsbFNsaWRlcyAtIDEpLmNzcygndG9wJywgJzAnKTtcclxuXHJcblx0dmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJy5zbGlkZXItbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Ly8gaWYgKCFpc0FuaW1hdGUpIHtcclxuXHRcdFx0XHQvLyBpc0FuaW1hdGUgPSB0cnVlO1xyXG5cdFx0XHRfc2xpZGVyKCk7XHJcblx0XHRcdC8vIH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdHZhciBfc2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBpID0gMCxcclxuXHRcdFx0bGFzdE51bWJlciA9IGFsbFNsaWRlcyAtIDE7XHJcblx0XHRcdFxyXG5cclxuXHRcdG5leHRTbGlkZXMuY3NzKCdvcGFjaXR5JywnMScpO1xyXG5cdFx0cHJldlNsaWRlcy5jc3MoJ29wYWNpdHknLCcxJyk7XHJcblxyXG5cdFx0aWYgKGkgPD0gbGFzdE51bWJlcikge1xyXG5cclxuXHRcdFx0JChuZXh0U2xpZGVzLmVxKGkpKS5hbmltYXRlKHtcclxuXHRcdFx0XHQndG9wJzogJzEwMCUnXHJcblx0XHRcdH0sIGFuaW1hdGVUaW1lLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5jc3MoJ29wYWNpdHknLCcwJyk7XHJcblx0XHRcdFx0JCh0aGlzKS5jc3MoJ3RvcCcsJy0xMDAlJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKG5leHRTbGlkZXMuZXEoaSsxKSkuYW5pbWF0ZSh7XHJcblx0XHRcdFx0J3RvcCc6ICcwJ1xyXG5cdFx0XHR9LCBhbmltYXRlVGltZSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlzQW5pbWF0ZSA9IGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQocHJldlNsaWRlcy5lcShsYXN0TnVtYmVyKSkuYW5pbWF0ZSh7XHJcblx0XHRcdFx0J3RvcCc6ICctMTAwJSdcclxuXHRcdFx0fSwgYW5pbWF0ZVRpbWUsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmNzcygnb3BhY2l0eScsJzAnKTtcclxuXHRcdFx0XHQkKHRoaXMpLmNzcygndG9wJywnMTAwJScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChwcmV2U2xpZGVzLmVxKGxhc3ROdW1iZXItMSkpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdCd0b3AnOiAnMCdcclxuXHRcdFx0fSwgYW5pbWF0ZVRpbWUsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpc0FuaW1hdGUgPSBmYWxzZTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpKys7XHJcblx0XHRcdGxhc3ROdW1iZXItLTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0aSA9IDA7XHJcblx0XHRcdGxhc3ROdW1iZXIgPSBhbGxTbGlkZXMgLSAxO1xyXG5cclxuXHJcblx0XHRcdCQobmV4dFNsaWRlcy5lcShsYXN0TnVtYmVyKSkuYW5pbWF0ZSh7XHJcblx0XHRcdFx0J3RvcCc6ICcxMDAlJ1xyXG5cdFx0XHR9LCBhbmltYXRlVGltZSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdCQodGhpcykuY3NzKCdvcGFjaXR5JywnMCcpO1xyXG5cdFx0XHRcdCQodGhpcykuY3NzKCd0b3AnLCctMTAwJScpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChuZXh0U2xpZGVzLmVxKGkpKS5hbmltYXRlKHtcclxuXHRcdFx0XHQndG9wJzogJzAnXHJcblx0XHRcdH0sIGFuaW1hdGVUaW1lLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5jc3MoJ3RvcCcsJzEwMCUnKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKHByZXZTbGlkZXMuZXEoaSkpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdCd0b3AnOiAnLTEwMCUnXHJcblx0XHRcdH0sIGFuaW1hdGVUaW1lKTtcclxuXHRcdFx0JChwcmV2U2xpZGVzLmVxKGxhc3ROdW1iZXIpKS5hbmltYXRlKHtcclxuXHRcdFx0XHQndG9wJzogJzAnXHJcblx0XHRcdH0sIGFuaW1hdGVUaW1lLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aXNBbmltYXRlID0gZmFsc2U7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGlzQW5pbWF0ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH07XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcblNsaWRlck1vZHVsZS5pbml0KCk7Ki9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8vIFJvdGF0ZSB3ZWxsY29tZSBibG9ja1xyXG5cdCQoJy5hdXRvcml6YXRlLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkKCcud2VsbGNvbWUtYm94LWZyb250JykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlWSgtMTgwZGVnKScpXHJcblx0XHQkKCcud2VsbGNvbWUtYm94LWxvZ2luJykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlWSgwZGVnKScpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5hdXRvcml6YXRlLWJ1dHRvbicpLmhpZGUoKTtcclxuXHRcdH0sIDEzMDApO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcjdG9NYWluJykub24oJ2NsaWNrJyxmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JCgnLndlbGxjb21lLWJveC1mcm9udCcpLmNzcygndHJhbnNmb3JtJywgJ3JvdGF0ZVkoMGRlZyknKTtcclxuXHRcdCQoJy53ZWxsY29tZS1ib3gtbG9naW4nKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGVZKDE4MGRlZyknKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcuYXV0b3JpemF0ZS1idXR0b24nKS5zaG93KCk7XHJcblx0XHR9LCAxMzAwKTtcclxuXHR9KTsvLyBSb3RhdGUgd2VsbGNvbWUgYmxvY2sgLT4gRU5EXHJcblxyXG5cclxuXHQkKCcuZ28tdG9wX19pY29uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sNTAwKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvL2FkbWluIG1lbnVcclxuXHQkKCcuYWRtaW4tdGFic19fbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9KTtcclxuXHQkKCcuYWRtaW4tY3VycmVudC1ibG9jaycpLmVxKDApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cdCQoJy5hZG1pbi10YWJzX19pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIG5lZWRCbG9ja05hbWUgPSAkKHRoaXMpLmNoaWxkcmVuKCcuYWRtaW4tdGFic19fbGluaycpLFxyXG5cdFx0XHRuZWVkQmxvY2tJZCA9IG5lZWRCbG9ja05hbWUuYXR0cignaHJlZicpLnJlcGxhY2UoJyMnLCAnJyk7XHJcblx0XHQkKHRoaXMpXHJcblx0XHRcdC5hZGRDbGFzcygnYWRtaW4tdGFic19faXRlbS0tYWN0aXZlJylcclxuXHRcdFx0LnNpYmxpbmdzKCcuYWRtaW4tdGFic19faXRlbScpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnYWRtaW4tdGFic19faXRlbS0tYWN0aXZlJyk7XHJcblx0XHQkKCcjJytuZWVkQmxvY2tJZClcclxuXHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpXHJcblx0XHRcdC5zaWJsaW5ncygnLmFkbWluLWN1cnJlbnQtYmxvY2snKVxyXG5cdFx0XHQuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHRcdFxyXG5cdH0pOy8vYWRtaW4gbWVudSAtPiBFTkRcclxuXHJcblx0XHJcblxyXG5cclxuXHJcblx0QmxvZ01lbnVNb2R1bGUuaW5pdCgpO1xyXG5cclxuXHRtYWluTWVudU1vZHVsZS5pbml0KCk7XHJcblxyXG5cdC8vIFNsaWRlck1vZHVsZS5pbml0KCk7XHJcbn0pOyJdfQ==
