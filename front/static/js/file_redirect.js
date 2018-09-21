function oval_box_resize() {

    $("#rplnk_foreground_box").width(2 * $(window).width());

}

function themeColorChange() {

    $("#copyright").css("color", themeColor);

}

$(window).resize(oval_box_resize);