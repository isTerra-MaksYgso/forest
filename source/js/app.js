$(document).ready(function () {
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
		$('.wellcome-box-front').css('transform', 'rotateY(0deg)')
		$('.wellcome-box-login').css('transform', 'rotateY(180deg)');
		setTimeout(function () {
			$('.autorizate-button').show();
		}, 1300);
	});
})