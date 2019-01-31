var down = false;

function file_main_btn_click() {

    if (!down) $("#rplink-index-header").css("height", 800);
    else $("#rplink-index-header").css("height", 520);

    down = !down;

}

$("#rplink-file-main-btn").click(file_main_btn_click);