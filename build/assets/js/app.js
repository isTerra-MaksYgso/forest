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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCbG9nTWVudU1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHJcblx0XHQkKCcubXktYXJ0aWNsZXNfX2xpbmsnKS5lcSgwKS5hZGRDbGFzcygnbXktYXJ0aWNsZXNfX2xpbmstYWN0aXZlJyk7XHJcblx0XHQkKHdpbmRvdykub24oXCJzY3JvbGxcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdF9ibG9nTWVudUZpeGVkKCk7XHJcblx0XHRcdF9ibG9nQXJ0aWNsZXNTY3JvbGwoKTtcclxuXHRcdFx0aWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiXCIpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuXHRcdFx0XHRcdHZhciBuZWVkVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIG5lZWRVcmwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiXCIpIHtcclxuXHRcdFx0X3Nob3dCbG9nU2VjdGlvbih3aW5kb3cubG9jYXRpb24uaGFzaCwgZmFsc2UpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHQvLyDQv9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLm15LWFydGljbGVzX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdF9zaG93QmxvZ1NlY3Rpb24oJCh0aGlzKS5hdHRyKCdocmVmJyksIHRydWUpO1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cdFx0fSk7XHJcblx0fS8vINC/0YDQvtGB0LvRg9GI0LrQsCDRgdC+0LHRi9GC0LjQuSAtPiBFTkRcclxuXHJcblxyXG5cdC8vINGE0LjQutGB0LDRhtC40Y8g0LHQu9C+0LPQvtCy0L7Qs9C+INC80LXQvdGOIFxyXG5cdHZhciBfYmxvZ01lbnVGaXhlZCA9IGZ1bmN0aW9uICgpIHtcdFx0XHJcblx0ICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPiAkKCcuaGVhZGVyJykuaGVpZ2h0KCkpIHtcclxuXHQgICAgXHQkKCcubXktYXJ0aWNsZXNfX2xpc3QnKS5hZGRDbGFzcygnbWVudS1maXhlZCcpO1xyXG5cdCAgICB9IGVsc2Uge1xyXG5cdCAgICBcdCQoJy5teS1hcnRpY2xlc19fbGlzdCcpLnJlbW92ZUNsYXNzKCdtZW51LWZpeGVkJyk7XHJcblx0ICAgIH1cdCAgICBcclxuXHR9Ly8g0YTQuNC60YHQsNGG0LjRjyDQsdC70L7Qs9C+0LLQvtCz0L4g0LzQtdC90Y4gLT4gRU5EXHJcblxyXG5cclxuXHQvLyDRgdC60YDQvtC70LjQvdCzINGB0YLQsNGC0LXQuSDQsiDQsdC70L7Qs9C1INC4INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQuNC30LzQtdC90LXQvdC40LUg0LIg0LzQtdC90Y4g0LHQu9C+0LPQsFxyXG5cdHZhciBfYmxvZ0FydGljbGVzU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnLm15LWFydGljbGVzLWl0c2VsZicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRvcEVkZ2UgPSAkdGhpcy5vZmZzZXQoKS50b3AgLSA2MCxcclxuXHRcdFx0XHRib3R0b21FZGdlID0gdG9wRWRnZSArICR0aGlzLmhlaWdodCgpLFxyXG5cdFx0XHRcdHdTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblx0XHRcdGlmKHRvcEVkZ2UgPCB3U2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB3U2Nyb2xsKXtcclxuXHRcdFx0XHR2YXIgY3VycmVudElkID0gJHRoaXMuZGF0YSgnc2VjdGlvbicpO1xyXG5cdFx0XHRcdCQoJy5teS1hcnRpY2xlc19fbGluaycpLmVhY2goZnVuY3Rpb24gKCl7XHJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5hdHRyKCdocmVmJykgPT0gJyMnICsgY3VycmVudElkKSB7XHJcblx0XHRcdFx0XHRcdCQoJy5teS1hcnRpY2xlc19fbGluaycpLnJlbW92ZUNsYXNzKCdteS1hcnRpY2xlc19fbGluay1hY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdteS1hcnRpY2xlc19fbGluay1hY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fS8vINGB0LrRgNC+0LvQuNC90LMg0YHRgtCw0YLQtdC5INCyINCx0LvQvtCz0LUgLT4gRU5EXHJcblxyXG5cclxuXHQvLyDQv9C10YDQtdC80LXRidC10L3QuNC1INC/0L4g0YHRgtCw0YLRjNGP0Lwg0L/QviDQutC70LjQutGDINC80LXQvdGOXHJcblx0dmFyIF9zaG93QmxvZ1NlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbiwgaXNBbmltYXRlKSB7XHJcblx0XHR2YXIgZGlyZWN0aW9uID0gc2VjdGlvbi5yZXBsYWNlKCcjJywgJycpLFxyXG5cdFx0XHRyZXFTZWN0aW9uID0gJCgnLm15LWFydGljbGVzLWl0c2VsZicpLmZpbHRlcignW2RhdGEtc2VjdGlvbj1cIicrZGlyZWN0aW9uKydcIl0nKSxcclxuXHRcdFx0cmVxU2VjdGlvblBvcyA9IHJlcVNlY3Rpb24ub2Zmc2V0KCkudG9wO1xyXG5cclxuXHRcdGlmIChpc0FuaW1hdGUpIHtcclxuXHRcdFx0JCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogcmVxU2VjdGlvblBvc30sIDUwMCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCdib2R5LCBodG1sJykuc2Nyb2xsVG9wKHJlcVNlY3Rpb25Qb3MpO1xyXG5cdFx0fVxyXG5cdH0vLyDQv9C10YDQtdC80LXRidC10L3QuNC1INC/0L4g0YHRgtCw0YLRjNGP0Lwg0L/QviDQutC70LjQutGDINC80LXQvdGOIC0+IEVORFxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBtYWluTWVudU1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZXRVcExpc3RlbmVycygpO1xyXG5cclxuXHRcdC8vINGC0L4sINGH0YLQviDQtNC+0LvQttC90L4g0YHRgNCw0LfRgyDQv9GA0L7QuNC30L7QudGC0Lgg0L3QsCDRgdGC0YDQsNC90LjRhtC1LlxyXG5cdH07XHJcblxyXG5cclxuXHQvLyDQv9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnI21haW4tbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLm1haW4tbWVudScpLnRvZ2dsZUNsYXNzKCdtYWluLW1lbnUtLWFjdGl2ZScpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBhdXRvcml6YXRlRm9ybSA9IChmdW5jdGlvbigpIHtcclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZXRVcExpc3RlbmVycygpO1xyXG5cdH07XHJcblxyXG5cdC8vINC/0YDQvtGB0LvRg9GI0LrQsCDRgdC+0LHRi9GC0LjQuVxyXG5cdHZhciBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0JCgnI2VudGVyJykub24oJ2NsaWNrJywgX3N1Ym1pdEZvcm0pO1xyXG5cdH1cclxuXHJcblx0XHJcblx0dmFyIF9zdWJtaXRGb3JtID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBmb3JtID0gJCgnLmxvZ2luLWZvcm0nKSxcclxuXHRcdFx0dXJsID0gJ2F1dG9yaXphdGVGb3JtLnBocCcsXHJcblx0XHRcdGRlZk9iaiA9IF9hamF4Rm9ybShmb3JtLCB1cmwpLFxyXG5cdFx0XHRwZW9wbGUgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJwZW9wbGVcIl0nKSxcclxuXHRcdFx0Y2hla1llcyA9IGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cInllc1wiXScpLFxyXG5cdFx0XHRjaGVrTWF5YmUgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJtYXliZVwiXScpO1xyXG5cdH1cclxuXHJcblx0dmFyIF9hamF4Rm9ybSA9IGZ1bmN0aW9uIChmb3JtLCB1cmwpIHtcclxuXHRcdGlmICghdmFsaWRhdGlvbi52YWxpZGF0ZUZvcm0oZm9ybSwgNSwgMjApKSByZXR1cm4gZmFsc2U7XHJcblx0XHRpZiAocGVvcGxlLmNoZWNrZWQgPT0gdHJ1ZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygndHJ5Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFsaWRhdGlvbi5hamF4Rm9ybShmb3JtLCB1cmwpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbmF1dG9yaXphdGVGb3JtLmluaXQoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxudmFyIHZhbGlkYXRpb24gPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnZm9ybScpLm9uKCdrZXlkb3duJywgJy5oYXMtZXJyb3InLCBfcmVtb3ZlTmVlZENsYXNzKTtcclxuXHRcdCQoJ2Zvcm0nKS5vbigna2V5ZG93bicsICcubm90LWVycm9yJywgX3JlbW92ZU5lZWRDbGFzcyk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9yZW1vdmVOZWVkQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ25vdC1lcnJvcicpO1xyXG5cdH07XHJcblxyXG5cdHZhciBjbGVhckZvcm0gPSBmdW5jdGlvbiAoZm9ybSkge1xyXG5cdFx0dmFyIGZvcm0gPSBmb3JtO1xyXG5cdFx0Zm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKS52YWwoXCJcIik7XHJcblx0XHQkKCcubG9naW4tZXJyb3ItYm94JykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xyXG5cdFx0JCgnLmhhcy1lcnJvcicpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdCQoJy5ub3QtZXJyb3InKS5yZW1vdmVDbGFzcygnbm90LWVycm9yJyk7XHJcblx0fTtcclxuXHJcblxyXG5cdHZhciB2YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbiAoZm9ybSwgbWluTCwgbWF4TCkge1xyXG5cdFx0dmFyIGVsZW1lbnRzID0gZm9ybS5maW5kKCdpbnB1dCcpLm5vdCgnaW5wdXRbdHlwZT1cImZpbGVcIl0sIGlucHV0W3R5cGU9XCJoaWRkZW5cIl0sIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLFxyXG5cdFx0XHR2YWxpZCA9IHRydWUsXHJcblx0XHRcdHRleHRhcmVhID0gZm9ybS5maW5kKCd0ZXh0YXJlYScpO1xyXG5cdFx0JCgnLmxvZ2luLWVycm9yLWJveCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcblxyXG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbiAoaW5kZXgsIHZhbCl7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGVsZW1lbnQudmFsKCk7XHJcblx0XHRcdGlmICh2YWwubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHRcdGVsZW1lbnQubmV4dCgnLmxvZ2luLWVycm9yLWJveCcpXHJcblx0XHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcclxuXHRcdFx0XHRcdC50ZXh0KGVsZW1lbnQuZGF0YShcImxvZ2luQ29udGVudFwiKSk7XHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAobWluTCA8PSB2YWwubGVuZ3RoICYmIHZhbC5sZW5ndGggPD0gbWF4TCkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbm90LWVycm9yJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5uZXh0KCcubG9naW4tZXJyb3ItYm94JylcclxuXHRcdFx0XHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpXHJcblx0XHRcdFx0XHRcdC50ZXh0KCfQn9C+0LvQtSDQtNC+0LvQttC90L4g0YHQvtC00LXRgNC20LDRgtGMINC+0YIgJyttaW5MKycg0LTQviAnK21heEwrJyDRgdC40LzQstC+0LvQvtCyJyk7XHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRleHRhcmVhLnZhbCgpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHR0ZXh0YXJlYS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdFx0dGV4dGFyZWEubmV4dCgnLmxvZ2luLWVycm9yLWJveCcpXHJcblx0XHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcclxuXHRcdFx0XHRcdC50ZXh0KHRleHRhcmVhLmRhdGEoXCJsb2dpbkNvbnRlbnRcIikpO1xyXG5cdFx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRleHRhcmVhLnZhbC5sZW5ndGggPiAwICYmIHRleHRhcmVhLnZhbC5sZW5ndGggPD0gMzAwMCkge1xyXG5cdFx0XHRcdHRleHRhcmVhLmFkZENsYXNzKCdub3QtZXJyb3InKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0YXJlYS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdFx0XHR0ZXh0YXJlYS5uZXh0KCcubG9naW4tZXJyb3ItYm94JylcclxuXHRcdFx0XHRcdFx0LmNzcygnZGlzcGxheScsICdibG9jaycpXHJcblx0XHRcdFx0XHRcdC50ZXh0KCfQn9C+0LvQtSDQtNC+0LvQttC90L4g0YHQvtC00LXRgNC20LDRgtGMINC+0YIgMSDQtNC+IDMwMDAg0YHQuNC80LLQvtC70L7QsicpO1xyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cmV0dXJuIHZhbGlkO1xyXG5cdH07XHJcblxyXG5cdHZhciBhamF4Rm9ybSA9IGZ1bmN0aW9uIChmb3JtLCB1cmwpIHtcclxuXHRcdGNvbnNvbGUubG9nKCd2YXIgYWpheEZvcm0gPSBmdW5jdGlvbiAoZm9ybSwgdXJsKScpO1xyXG5cdFx0ZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XHJcblxyXG5cdFx0dmFyIHJlc3VsdCA9ICQuYWpheCh7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHR0eXBlOiAnUE9TVCcsXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHR9KS5mYWlsKGZ1bmN0aW9uIChhbnMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ9Cf0YDQvtCx0LvQtdC80Ysg0L3QsCDRgdC10YDQstC10YDQtScpO1xyXG5cdFx0XHRhbGVydCgnXFxuINCf0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LAg0L3QsCDRgdGC0L7RgNC+0L3QtSDRgdC10YDQstC10YDQsCxcXG4g0L/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDINC/0L7Qt9C20LUhIFxcbicpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdCxcclxuXHRcdHZhbGlkYXRlRm9ybTogdmFsaWRhdGVGb3JtLFxyXG5cdFx0YWpheEZvcm06IGFqYXhGb3JtLFxyXG5cdFx0Y2xlYXJGb3JtOiBjbGVhckZvcm1cclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbnZhbGlkYXRpb24uaW5pdCgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBjb250YWN0TWVGb3JtID0gKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NldFVwTGlzdGVuZXJzKCk7XHJcblx0fTtcclxuXHJcblx0Ly8g0L/RgNC+0YHQu9GD0YjQutCwINGB0L7QsdGL0YLQuNC5LlxyXG5cdHZhciBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHQkKCcjc3VibWl0TWVGb3JtJykub24oJ2NsaWNrJywgX3N1Ym1pdEZvcm0pO1xyXG5cdFx0JCgnI3Jlc2V0Rm9ybScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHZhbGlkYXRpb24uY2xlYXJGb3JtKCQoJy5jb250YWN0LW1lLWZvcm0nKSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHZhciBfc3VibWl0Rm9ybSA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQoJy5jb250YWN0LW1lLWZvcm0nKTtcclxuXHJcblx0XHRpZighdmFsaWRhdGlvbi52YWxpZGF0ZUZvcm0oZm9ybSwgNCwgMzUpKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0YWxlcnQoJ9Ce0YHRgtCw0LvQvtGB0Ywg0L7RgtC/0YDQsNCy0LjRgtGMINGE0L7RgNC80YMhJyk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbmNvbnRhY3RNZUZvcm0uaW5pdCgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxudmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpe1xyXG5cdHZhciBwZXJjZW50c1RvdGFsID0gMDtcclxuXHR2YXIgcHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpO1xyXG5cclxuXHR2YXIgaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24gKG5keCwgZWxlbWVudCkge1xyXG5cdFx0dmFyIGJhY2tncm91bmQgPSAkKGVsZW1lbnQpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xyXG5cdFx0dmFyIGlzSW1nID0gJChlbGVtZW50KS5pcygnaW1nJyk7XHJcblx0XHR2YXIgcGF0aCA9ICcnO1xyXG5cclxuXHRcdGlmIChiYWNrZ3JvdW5kICE9ICdub25lJykge1xyXG5cdFx0XHRwYXRoID0gYmFja2dyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpc0ltZykge1xyXG5cdFx0XHRwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGF0aCkgcmV0dXJuIHBhdGg7XHJcblx0fSk7XHJcblxyXG5cdHZhciBfc2V0UGVyY2VudHMgPSBmdW5jdGlvbih0b3RhbCwgY3VycmVudCkge1xyXG5cdFx0dmFyIHBlcmNlbnRzID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnRzICsgJyUnKTtcclxuXHJcblx0XHQvKmlmIChwZXJjZW50cyA+PSAxMDApIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0cHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuXHRcdFx0fSwzMDAwKTtcclxuXHRcdH0qL1xyXG5cdFx0aWYgKHBlcmNlbnRzID49IDEwMCkge1xyXG5cdFx0XHRwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIF9sb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XHJcblxyXG5cdFx0aWYgKCFpbWFnZXMubGVuZ3RoKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xyXG5cclxuXHRcdGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGltZywgaSwgaW1hZ2VzKXtcclxuXHRcdFx0dmFyIGZha2VJbWFnZSA9ICQoJzxpbWc+Jywge1xyXG5cdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRzcmMgOiBpbWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0ZmFrZUltYWdlLm9uKCdsb2FkIGVycm9yJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdFx0X3NldFBlcmNlbnRzKGltYWdlcy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBpbWdzID0gaW1nUGF0aC50b0FycmF5KCk7XHJcblxyXG5cdFx0XHRfbG9hZEltYWdlcyhpbWdzKTtcclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBTbGlkZXJNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0JCgnc2xpZGVyLW5leHQnKS5vbignY2xpY2snLCBfbmV4dCk7XHJcblx0XHQkKCdzbGlkZXItcHJldicpLm9uKCdjbGljaycsIF9wcmV2KTtcclxuXHR9XHJcblxyXG5cdHZhciBpID0gMDtcclxuXHJcblx0JCgnLnNsaWRlci1jb3VudGVyLS1maXJzdCwgLnNsaWRlci1jb3VudGVyLS1tYWluJykudGV4dChpKzEpO1xyXG5cdCQoJy5zbGlkZXItY291bnRlci0tbGFzdCcpLnRleHQoJ2xhc3QnKTtcclxuXHJcblx0dmFyIF9uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgX3ByZXYgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5TbGlkZXJNb2R1bGUuaW5pdCgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Ly8gUm90YXRlIHdlbGxjb21lIGJsb2NrXHJcblx0JCgnLmF1dG9yaXphdGUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoJy53ZWxsY29tZS1ib3gtZnJvbnQnKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGVZKC0xODBkZWcpJylcclxuXHRcdCQoJy53ZWxsY29tZS1ib3gtbG9naW4nKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGVZKDBkZWcpJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLmF1dG9yaXphdGUtYnV0dG9uJykuaGlkZSgpO1xyXG5cdFx0fSwgMTMwMCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJyN0b01haW4nKS5vbignY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkKCcud2VsbGNvbWUtYm94LWZyb250JykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlWSgwZGVnKScpO1xyXG5cdFx0JCgnLndlbGxjb21lLWJveC1sb2dpbicpLmNzcygndHJhbnNmb3JtJywgJ3JvdGF0ZVkoMTgwZGVnKScpO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJy5hdXRvcml6YXRlLWJ1dHRvbicpLnNob3coKTtcclxuXHRcdH0sIDEzMDApO1xyXG5cdH0pOy8vIFJvdGF0ZSB3ZWxsY29tZSBibG9jayAtPiBFTkRcclxuXHJcblxyXG5cdCQoJy5nby10b3BfX2ljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSw1MDApO1xyXG5cdH0pO1xyXG5cclxuXHRcclxuXHJcblxyXG5cclxuXHRCbG9nTWVudU1vZHVsZS5pbml0KCk7XHJcblxyXG5cdG1haW5NZW51TW9kdWxlLmluaXQoKTtcclxuXHJcblx0U2xpZGVyTW9kdWxlLmluaXQoKTtcclxufSk7Il19
