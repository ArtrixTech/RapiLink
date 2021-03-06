var color = "#00000014",
    colorAlpha = "#00000014",
    colorAlpha2 = "#00000014";
var sourceColor;

function fetchColor(refresh = false) {
    try {
        var colorThief = new ColorThief();
        var img = document.getElementById("bgimg");
        img.crossOrigin = "https://cn.bing.com";

        sourceColor = colorThief.getColor(img);
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