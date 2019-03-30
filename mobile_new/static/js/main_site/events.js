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

$(id.cusLinkInput_File).keyup(() => {
    checkCusLinkAvailability();
    if ($(id.cusLinkInput_File).val().length == 0) state.setState("cusLinkInputEmpty_file", true);
    else state.setState("cusLinkInputEmpty_file", false);
})

$(id.cusLinkInput_File).focus(() => {
    checkCusLinkAvailability();
    if ($(id.cusLinkInput_File).val().length == 0) state.setState("cusLinkInputEmpty_file", true);
    else state.setState("cusLinkInputEmpty_file", false);
})

var winInitialHeight = $(window).height();
$(window).resize(function () {
    var nowHeight = $(this).height();
    if (winInitialHeight - nowHeight > 100) state.setState("keyboard_pop", true)
    else state.setState("keyboard_pop", false)
});

// States Here

state.bindElementUpdateFunction("availabilityIndicator_file", () => {

    var linkAvailable=state.getState("cusLinkAvailable_file");
    var linkEmpty=state.getState("cusLinkInputEmpty_file");

    if (linkAvailable) {

        $(id.cusLinkIndicator_File).css("animation", "");
        //$(id.cusLinkIndicator_File).css("border", "3px solid white");

        // Indicators update
        $(id.cusLinkIndicatorSpan_File).text("链接可用");
        $(id.cusLinkIndicatorSpan_File).css("color", lessmgr.getVar("@primary-text-color"));
        $(id.cusLinkIndicatorIcon_File).css("color", lessmgr.getVar("@primary-text-color"));
        $(id.cusLinkIndicatorIcon_File).removeClass("layui-icon-close");
        $(id.cusLinkIndicatorIcon_File).addClass("layui-icon-ok");

        // Slider page update
        if (!linkEmpty) $(id.sliderUploadPage).removeClass("hidden");
        HorizontalSwiper_Main.update();

        //$(id.cusLinkInputBox_File).css("border", "4px solid white");


    } else {

        $(id.cusLinkIndicator_File).css('animation', '0.9s shake infinite alternate');
        //$(id.cusLinkIndicator_File).css("border", "3px solid rgb(255, 82, 103)");

        // Indicators update
        $(id.cusLinkIndicatorSpan_File).text("链接无效")
        $(id.cusLinkIndicatorSpan_File).css("color", "rgb(255, 82, 103)");
        $(id.cusLinkIndicatorIcon_File).css("color", "rgb(255, 82, 103)");
        $(id.cusLinkIndicatorIcon_File).addClass("layui-icon-close");
        $(id.cusLinkIndicatorIcon_File).removeClass("layui-icon-ok");

        // Slider page update
        $(id.sliderUploadPage).addClass("hidden");
        HorizontalSwiper_Main.update();

        //$(id.cusLinkInputBox_File).css("border", "4px solid rgb(255, 82, 103)");

    }

    if (linkEmpty) {
        $(id.cusLinkIndicator_File).addClass("anime-hidden");
        $(id.sliderUploadPage).addClass("hidden");
        HorizontalSwiper_Main.update();
    }
    else {
        $(id.cusLinkIndicator_File).removeClass("anime-hidden");
    }

})

