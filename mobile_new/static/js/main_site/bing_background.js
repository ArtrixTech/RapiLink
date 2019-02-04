function changeBackground() {

    function setBackground(url) {

        var model = "url(%rep%) 50% 50% /cover";
        model = model.replace("%rep%", "\"" + url + "\"");

        $("body").css("background", model);
        $("#rplink_background").css("background", model);

        
        $("#bingbg_temp").attr("src", "/bing_img?u=" + url);
        
        fetchColor(true);

    }

    apiGet("/bing_url", "", setBackground);

}
