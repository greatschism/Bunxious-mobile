var toggle_shown = false;

function toggle_sidebar(show)
{
    var sidebar = document.getElementById("sidebar");
    var toggle = document.getElementById("toggle");
    var mainview = document.getElementById("mainview");
           
//            console.log(sidebar.style.left);

    // the 'main logo' image in the header of the application has been tied to a jQuery fade fuction
    // in the toggle actions.  This is because at 320px width, the hamburger will be positioned over
    // the logo when the menu is showing, and it looks bad.  At higher width resolutions, this issue
    // is mitigated (the hamburger should not overlap the logo)
    
    if(show)
    {
        $( "#mainlogo" ).fadeOut( "slow", function() {
            // Animation complete
        });
        sidebar.style.left = "0px";
        mainview.style.left="100px";
        toggle.style.left="210px";
        toggle_shown=true;
    }
    else
    {
        sidebar.style.left = "-200px";
        mainview.style.left="0px";
        toggle.style.left="10px";
        toggle_shown=false;
        $( "#mainlogo" ).fadeIn( "slow", function() {
            // Animation complete
        });
    }
}

function onclick_togglebutton(){
	if(toggle_shown)
		toggle_sidebar(false);
	else
		toggle_sidebar(true);
}
