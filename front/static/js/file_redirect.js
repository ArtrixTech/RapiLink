function oval_box_resize() {

    $("#rplnk_foreground_box").width(2 * $(window).width());
    $("#rplnk_foreground_box").css("top", (0.55 * $(window).height()));


}

function themeColorChange() {

    $("#copyright").css("color", themeColor);

}

var batch_id, info_loaded, file_name, file_size, time_remain, last_refreshed_time;

function analyze_file() {

    function render_file_info(data) {

        var data_json = JSON.parse(data)
        file_name = data_json["file_name"]
        file_size = data_json["file_size"]
        time_remain = data_json["time_remain"]
        info_loaded = true;
        last_refreshed_time = new Date().getTime();

        setInterval(update_time_remain, 250)

    }

    function update_time_remain() {

        var new_time = new Date().getTime();
        time_remain -= (new_time - last_refreshed_time) / 1000;
        //time_remain = parseInt(time_remain);
        last_refreshed_time = new_time;

    }

    batch_id = $('meta[name="batch_id"]').attr("content")
    apiGet("file_info", {
        "batch_id": batch_id
    }, render_file_info)

}

$(window).resize(oval_box_resize);