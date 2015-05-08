var args = arguments[0] || {};

var menuView = Alloy.createController('main/menu');
var mainView = Alloy.createController('main/home_wrapper');

$.drawermenu.init({
    menuview:menuView.getView(),
    mainview:mainView.getView(),
    duration:150,
    parent: $.mainWindow
});

Ti.App.addEventListener('openMenu', function() {
	$.drawermenu.showhidemenu();
	$.drawermenu.menuOpen=!$.drawermenu.menuOpen;
});
