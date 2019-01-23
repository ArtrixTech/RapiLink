var backgroundLoaded = false;


function changeBackground() {

    function set(url) {

        backgroundLoaded = true;
        var model = "url(%rep%) 50% 50% /cover";
        model = model.replace("%rep%", "\"" + url + "\"");

        $("body").css("background", model);
        $("#background-cover").css("background", model);
        $("#bgimg").attr("src", "/bing_img?u=" + url);

    }

    apiGet("bing_url", "", set);

}

var themeColor = "#00000014",
    themeColorAlpha = "#00000014",
    themeColorAlpha2 = "#00000014",
    themeColorAlpha3 = "#00000014";

function fetchColor(targetFunction) {

    var colorThief = new ColorThief();

    try {

        var img = document.getElementById("bgimg");
        img.crossOrigin = "https://cn.bing.com";

        var sourceColor = colorThief.getColor(img);
        themeColor = "rgb(" + sourceColor + ")";
        var deltaVal = -55,
            deltaVal2 = -10,
            deltaVal3 = -15;

        // Dim Color
        themeColorAlpha = "rgba(" + ((sourceColor[0] + deltaVal) >= 0 ? (sourceColor[0] + deltaVal) : 0) +
            "," + ((sourceColor[1] + deltaVal) >= 0 ? (sourceColor[1] + deltaVal) : 0) +
            "," + ((sourceColor[2] + deltaVal) >= 0 ? (sourceColor[2] + deltaVal) : 0) +
            ",0.12)";

        // Deep Color1
        themeColorAlpha2 = "rgba(" + ((sourceColor[0] + deltaVal2) >= 0 ? (sourceColor[0] + deltaVal2) : 0) +
            "," + ((sourceColor[1] + deltaVal2) >= 0 ? (sourceColor[1] + deltaVal2) : 0) +
            "," + ((sourceColor[2] + deltaVal2) >= 0 ? (sourceColor[2] + deltaVal2) : 0) +
            ",0.75)";

        // Deep Color2 - Deeper than color1
        themeColorAlpha3 = "rgba(" + ((sourceColor[0] + deltaVal3) >= 0 ? (sourceColor[0] + deltaVal3) : 0) +
            "," + ((sourceColor[1] + deltaVal3) >= 0 ? (sourceColor[1] + deltaVal3) : 0) +
            "," + ((sourceColor[2] + deltaVal3) >= 0 ? (sourceColor[2] + deltaVal3) : 0) +
            ",0.79)";
        console.log("Fetch Succeed")
        console.log(themeColor);

        //if (refresh) colorChange();
        targetFunction();

    } catch (err) {
        // colorThief.image.removeCanvas();
        console.log("Pics are still loading ...")
        console.log(err)

        setTimeout(fetchColor, 200, targetFunction);
    }
}