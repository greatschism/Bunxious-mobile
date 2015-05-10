// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.Facebook = require('facebook');

Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

if (OS_ANDROID) {
	Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
	Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}

Alloy.Globals.API = require('api');
Alloy.Globals.Utils = require('utils');

// Storing the currentUser here for global access
Alloy.Globals.currentUser = null;

// Storing pageflow here for global access
Alloy.Globals.pageflow = null;

var currentPage = null;

Alloy.Globals.openWindow = function(controller, arguments, newOne) {
	
	if (Alloy.Globals.pageflow.getCurrentPage() == null || newOne === true) { 
		
		Alloy.Globals.pageflow.addChild({
			arguments : arguments,
			controller : controller,
			backButton : {
				title : 'Back',
				width : '50dp',
				borderRadius : '3dp',
				height : '35dp',
				backgroundColor : '#55888f',
				left: 10,
				hidden : newOne === true ? false : true
			},
			navBar : {
				backgroundColor : '#62949b',
				left : 'misc/openMenu'
			},
			direction : {
				top : 0,
				left : 1
			}
		});
		
		if (!newOne) {
			
			currentPage = controller;
		}
	}
	else if (currentPage != controller){
		
		Alloy.Globals.pageflow.replacePage(0, {
			arguments : arguments,
			controller : controller,
			backButton : {
				hidden : true
			},
			navBar : {
				backgroundColor : '#62949b',
				left : 'misc/openMenu'
			},
			direction : {
				top : 0,
				left : 1
			}
		});
		
		currentPage = controller;
	}
};
