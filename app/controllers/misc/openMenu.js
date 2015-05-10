var args = arguments[0] || {};

$.openMenu.addEventListener('click', function(){
	
	Ti.App.fireEvent('toggleMenu');
});