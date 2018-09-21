function changeBG() {

    function setBG(url) {

        var model = "url(%rep%)";
        model = model.replace("%rep%", "\"" + url + "\"");

        $("#b").css("background", model);
        $("#bgimg").attr("src", "/bing_img?u=" + url);
        
        fetchColor(true);

    }

    apiGet("bing_url", "", setBG);

}

function changeBackgound_fileRedirect() {

    function setBG(url) {

        var model = "url(%rep%)";
        model = model.replace("%rep%", "\"" + url + "\"");

        $("#b").css("background", model);
        $("#bgimg").attr("src", "/bing_img?u=" + url);
        
        fetchColor(true);

    }

    apiGet("bing_url", "", setBG);

}


