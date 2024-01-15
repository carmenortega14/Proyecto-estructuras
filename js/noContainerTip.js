
$(document).ready(function(){
    $(window).resize(function() {
        setLocation();
    });
});

function setLocation() {
    var l = document.getElementById("tipdiv");
    var height = window.innerHeight;
    var lHeight = l.clientHeight;
    var style = "padding-top: " + Math.floor((height - lHeight) / 2 - 100)  + "px;";
    l.setAttribute("style",style);

}


window.onload = function () {
    setLocation();
};
