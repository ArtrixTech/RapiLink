function box_resize() {

    $("#rplnk-foreground-box").width(4 * $(window).width());
    $("#rplnk-foreground-box").css("top", (0.78 * $(window).height()));
    $("#rplnk-download-btn").css("top", (0.06 * $(window).height()));
    $(".rplnk-file-info-box").css("top", (0.275 * $(window).height()));

}


function themeColorChange() {

    $("#footer_copyright").css("color", themeColor);
    $("#rplnk-download-btn").css("background", themeColor);

    $("#rplnk-download-btn").css("box-shadow", "0px 23px 58px " + themeColorAlpha3.replace("0.79", "0.4").toString());
    $("#rplnk-file-type-icon").css("text-shadow", "0px 23px 58px " + themeColorAlpha3.replace("0.79", "0.4").toString());
    $("#rplnk-file-name").css("text-shadow", "0px 14px 36px " + themeColorAlpha3.replace("0.79", "1").toString());

}

function fileInfoUpdate() {

    detectFileType();
    $("#rplnk-file-name").text(file_name);
    $("#rplnk-file-info-size-badge").text(((file_size / 1024).toFixed(2)).toString() + "MB");
    $("#rplnk-download-btn").click(function to_download() {
        window.location.href = "http://rapi.link/download?batch_id=" + batch_id;
    })

}

function detectFileType() {

    var deco = file_name.split(".").pop();

    var icon_type = "icon-file";

    switch (deco) {

        case "jpg":
            icon_type = "icon-image";
            break;
        case "png":
            icon_type = "icon-image";
            break;
        case "psd":
            icon_type = "icon-image";
            break;
        case "jpeg":
            icon_type = "icon-image";
            break;
        case "gif":
            icon_type = "icon-image";
            break;
        case "bmp":
            icon_type = "icon-image";
            break;

        case "mp4":
            icon_type = "icon-video";
            break;
        case "avi":
            icon_type = "icon-video";
            break;
        case "rmvb":
            icon_type = "icon-video";
            break;
        case "mov":
            icon_type = "icon-video";
            break;

        case "mp3":
            icon_type = "icon-music";
            break;
        case "flac":
            icon_type = "icon-music";
            break;
        case "aac":
            icon_type = "icon-music";
            break;
        case "wav":
            icon_type = "icon-music";
            break;

        case "doc":
            icon_type = "icon-office";
            break;
        case "docx":
            icon_type = "icon-office";
            break;
        case "xls":
            icon_type = "icon-office";
            break;
        case "xlsx":
            icon_type = "icon-office";
            break;
        case "ppt":
            icon_type = "icon-office";
            break;
        case "pptx":
            icon_type = "icon-office";
            break;
        case "wps":
            icon_type = "icon-office";
            break;

        case "exe":
            icon_type = "icon-exe";
            break;
        case "rar":
            icon_type = "icon-exe";
            break;
        case "zip":
            icon_type = "icon-exe";
            break;

    }

    $("#rplnk-file-type-icon").addClass(icon_type);

    //alert(icon_type)

}

var batch_id, info_loaded, file_name, file_size, time_remain, last_refreshed_time;

function analyze_file(target_function) {

    function render_file_info(data) {

        var data_json = JSON.parse(data)
        file_name = data_json["file_name"]
        file_size = data_json["file_size"]
        time_remain = data_json["time_remain"]
        info_loaded = true;
        last_refreshed_time = new Date().getTime();

        target_function();

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

function registerEvents() {
    $(window).resize(box_resize);
    $("#background-cover").hover(function blur() {
        $("#background-cover").css("filter", "blur(6px) brightness(60%)");
    })
    $("#rplnk-file-info-box").hover(function blur() {
        $("#background-cover").css("filter", "blur(6px) brightness(60%)");
    })
    $("#background-cover").mouseleave(function unBlur() {
        $("#background-cover").css("filter", "blur(0) brightness(90%)")
    })
    $("#rplnk-file-info-box").mouseleave(function unBlur() {
        $("#background-cover").css("filter", "blur(0) brightness(90%)")
    })

}