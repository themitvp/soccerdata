$(function(){
	$('.dropdown-toggle').click(function(event) {
		if ($(window).width() < 768) {
			event.preventDefault();
		}
	});
});