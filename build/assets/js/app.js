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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0JCgnLmF1dG9yaXphdGUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoJy53ZWxsY29tZS1ib3gtZnJvbnQnKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGVZKC0xODBkZWcpJylcclxuXHRcdCQoJy53ZWxsY29tZS1ib3gtbG9naW4nKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGVZKDBkZWcpJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLmF1dG9yaXphdGUtYnV0dG9uJykuaGlkZSgpO1xyXG5cdFx0fSwgMTMwMCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJyN0b01haW4nKS5vbignY2xpY2snLGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHQkKCcud2VsbGNvbWUtYm94LWZyb250JykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlWSgwZGVnKScpXHJcblx0XHQkKCcud2VsbGNvbWUtYm94LWxvZ2luJykuY3NzKCd0cmFuc2Zvcm0nLCAncm90YXRlWSgxODBkZWcpJyk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JCgnLmF1dG9yaXphdGUtYnV0dG9uJykuc2hvdygpO1xyXG5cdFx0fSwgMTMwMCk7XHJcblx0fSk7XHJcbn0pIl19
