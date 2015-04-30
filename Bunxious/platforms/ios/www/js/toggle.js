var toggle_shown = false;

function toggle_sidebar(show)
{
    var sidebar = document.getElementById("sidebar");
    var toggle = document.getElementById("toggle");
    var mainview = document.getElementById("mainview");
           
//            console.log(sidebar.style.left);
           
    if(show)
    {
        sidebar.style.left = "0px";
        mainview.style.left="100px";
        toggle.style.left="210px";
        toggle_shown=true;
        $('#mainlogo').css('display','none');
    }
    else
    {
        sidebar.style.left = "-200px";
        mainview.style.left="0px";
        toggle.style.left="10px";
        toggle_shown=false;
        $('#mainlogo').css('display','inline-block');
    }
}

function onclick_togglebutton(){
	if(toggle_shown)
		toggle_sidebar(false);
	else
		toggle_sidebar(true);
}
