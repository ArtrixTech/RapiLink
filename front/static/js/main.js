var obj = {
    file: document.getElementById("file"),
    link: document.getElementById("link"),
    text: document.getElementById("text"),

    file_icon: document.getElementById("file_btn"),
    link_icon: document.getElementById("link_btn"),
    text_icon: document.getElementById("text_btn"),

    file_label: document.getElementById("file_label"),
    link_label: document.getElementById("link_label"),
    text_label: document.getElementById("text_label")
};



function changeFile() {

    obj.file.className = "hidden";
    obj.link.className = "make_link";
    obj.text.className = "hidden";

    obj.link_icon.className = "icon";
    obj.file_icon.className = "icon_selected";
    obj.text_icon.className = "icon right1";

    obj.file_label.className = "label_for_btn";
    obj.link_label.className = "hidden";
    obj.text_label.className = "hidden";
    colorChange();
    eventColorChange();
    return false

};

function changeLink() {

    obj.file.className = "make_file";
    obj.link.className = "hidden";
    obj.text.className = "hidden";

    obj.file_icon.className = "icon right";
    obj.link_icon.className = "icon_selected";
    obj.text_icon.className = "icon right";

    obj.file_label.className = "hidden";
    obj.link_label.className = "label_for_btn";
    obj.text_label.className = "hidden";
    colorChange();
    eventColorChange();
    return false

};

function changeText() {

    obj.file.className = "hidden";
    obj.link.className = "hidden";
    obj.text.className = "make_text";

    obj.file_icon.className = "icon";
    obj.link_icon.className = "icon";
    obj.text_icon.className = "icon_selected";

    obj.file_label.className = "hidden";
    obj.link_label.className = "hidden";
    obj.text_label.className = "label_for_btn";
    colorChange();
    eventColorChange();
    return false

};
var color = "#00000014",
    colorAlpha = "#00000014",
    colorAlpha2 = "#00000014";

function fetchColor(refresh = false) {
    try {
        var colorThief = new ColorThief();
        var img = document.getElementById("bgimg");
        img.crossOrigin = "https://cn.bing.com";

        var sourceColor = colorThief.getColor(img);
        color = "rgb(" + sourceColor + ")";
        var deltaVal = -55,
            deltaVal2 = -10,
            deltaVal3 = -15;

        // Dim Color
        colorAlpha = "rgba(" + ((sourceColor[0] + deltaVal) >= 0 ? (sourceColor[0] + deltaVal) : 0) +
            "," + ((sourceColor[1] + deltaVal) >= 0 ? (sourceColor[1] + deltaVal) : 0) +
            "," + ((sourceColor[2] + deltaVal) >= 0 ? (sourceColor[2] + deltaVal) : 0) +
            ",0.12)";

        // Deep Color1
        colorAlpha2 = "rgba(" + ((sourceColor[0] + deltaVal2) >= 0 ? (sourceColor[0] + deltaVal2) : 0) +
            "," + ((sourceColor[1] + deltaVal2) >= 0 ? (sourceColor[1] + deltaVal2) : 0) +
            "," + ((sourceColor[2] + deltaVal2) >= 0 ? (sourceColor[2] + deltaVal2) : 0) +
            ",0.75)";

        // Deep Color2 - Deeper than color1
        colorAlpha3 = "rgba(" + ((sourceColor[0] + deltaVal3) >= 0 ? (sourceColor[0] + deltaVal3) : 0) +
            "," + ((sourceColor[1] + deltaVal3) >= 0 ? (sourceColor[1] + deltaVal3) : 0) +
            "," + ((sourceColor[2] + deltaVal3) >= 0 ? (sourceColor[2] + deltaVal3) : 0) +
            ",0.79)";
        console.log("Fetch Succeed")
        console.log(colorAlpha);

        if (refresh) colorChange();

    } catch (err) {
        console.log("Fetch Error.Retry")
        setTimeout(fetchColor, 250, refresh);
    }
}

var isHoldFileIconLength = false;

function eventColorChange() {
    $(".icon_selected").mouseover(function () {
        $(this).css("background", colorAlpha);
    });
    $(".icon_selected").mouseout(function () {
        $(this).css("background", colorAlpha);
    });

    $(".icon").mouseover(function () {
        $(this).css("background", colorAlpha);
    });
    $(".icon").mouseout(function () {
        $(this).css("background", "rgba(0,0,0,0)");
    });

}

function colorChange() {
    //alert(color);

    $(".float_window_label").css("color", color);
    $(".link_input").css("color", color);

    $("#link_whole_link_label").css("color", color);
    $("#link_whole_link").css("color", color);

    $("#file_whole_link_label").css("color", color);
    $("#file_whole_link").css("color", color);

    $("#file_input_div").css("background-color", "rgba(0,0,0,0)");

    // Var "isHoldFileIconLength" is in file_process.js
    if (!isHoldFileIconLength) $("#file_input_span").css("color", color);
    else $("#file_input_span").css("color", "white");

    //$(".customize_link_input").css("background-color", colorAlpha);
    $(".customize_link_input").css("color", color);
    $("#progress_text").css("color", "white");


    $(".icon_selected").css("background", colorAlpha);

    $(".icon").css("background", "rgba(0,0,0,0)");
    $("body").css("background-color", color);

    $("#file_icon").css("background", colorAlpha2);

}