$("#rplink-upload-btn").click(function () {
    document.getElementById("file_uploader").click();
})

$("#file_uploader").bind('change', function () {

    var files = document.getElementById("file_uploader").files;

    if (files.length > 0) {

        var file = files[0];
        var file_size = file.size / (1024 * 1024);
        var max_size = 100; // Unit: MB

        if (file_size > max_size) {
            // Show file sizes
            showMessageBar("msg_bar",
                "Size limit exceeded [100MB] ! Your file is " + file_size.toFixed(1) + "MB.",
                "WARNING",
                3000);
            document.getElementById("file_uploader").value = "";
        } else {

            uploadProcess(files);

        }
    } else {
        showMessageBar("msg_bar",
            "You didn't select any file.",
            "GOOD",
            3000);
    }
});
$(window).resize(function () {
    setTimeout(setLinkInputWidth, 128);
});

$(id.cusLinkInput).keyup(() => {
    checkCusLinkAvailability();
})

var winInitialHeight = $(window).height();
$(window).resize(function () {
    var nowHeight = $(this).height();
    if (winInitialHeight - nowHeight > 100) state.setState("keyboard_pop", true)
    else state.setState("keyboard_pop", false)
});

// States Here

state.bindElementUpdateFunction("availabilityIndicator", () => {

    if (state.getState("cusLinkAvailable_file")) {

        $(id.cusLinkIndicator).css("animation", "");
        $(id.cusLinkIndicator).css("border", "3px solid white");

        $(id.cusLinkIndicatorSpan).text("链接可用");
        $(id.cusLinkIndicatorSpan).css("color", lessmgr.getVar("@primary-text-color"));
        $(id.cusLinkIndicatorIcon).css("color", lessmgr.getVar("@primary-text-color"));

        //$(id.cusLinkInputBox_File).css("border", "4px solid white");


    } else {

        $(id.cusLinkIndicator).css('animation', '0.9s shake infinite alternate');
        $(id.cusLinkIndicator).css("border", "3px solid rgb(255, 82, 103)");

        $(id.cusLinkIndicatorSpan).text("链接无效")
        $(id.cusLinkIndicatorSpan).css("color", "rgb(255, 82, 103)");
        $(id.cusLinkIndicatorIcon).css("color", "rgb(255, 82, 103)");

        //$(id.cusLinkInputBox_File).css("border", "4px solid rgb(255, 82, 103)");

    }

})