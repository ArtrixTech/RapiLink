function rplink_box_click() {

    $("#rplink-box").css("height", 500);

}


$("#rplink-box").click(rplink_box_click);


var startX = 0;
var index = 0;
var deltaIndex = 0;

function headerTouchstart(e) {
    var _touch = e.originalEvent.targetTouches[0];
    startX = _touch.pageX;
}

function headerTouchmove(e) {
    var _touch = e.originalEvent.targetTouches[0];
    var deltaX = _touch.pageX - startX;
    var width = $("#rplink-index-header").width();
    var proportion = deltaX / width;
    deltaIndex = parseInt(proportion * 200);
    // alert(colorIndex);
    console.log(index + deltaIndex);
    change(index + deltaIndex);
}

function headerTouchend(e) {
    index += deltaIndex;

}
$("#rplink-index-header").on("touchstart", headerTouchstart);
$("#rplink-index-header").on("touchmove", headerTouchmove);
$("#rplink-index-header").on("touchend", headerTouchend);