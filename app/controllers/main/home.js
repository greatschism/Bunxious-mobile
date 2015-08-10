var args = arguments[0] || {};

var menuView = Alloy.createController('main/menu');
var mainView = Alloy.createController('main/home_wrapper');

$.drawermenu.init({
	menuview : menuView.getView(),
	mainview : mainView.getView(),
	duration : 150,
	parent : $.mainWindow
});

Ti.App.addEventListener('toggleMenu', function() {
	
	$.drawermenu.showhidemenu();
	$.drawermenu.menuOpen = !$.drawermenu.menuOpen;
});

if (OS_ANDROID) {
	
	$.mainWindow.addEventListener('androidback', function() {

		if (Alloy.Globals.pageflow.countPages() > 1) {
			
			Alloy.Globals.pageflow.back();
			return false;
		}
		else {
			
			$.mainWindow.close();
		}
	});
}
