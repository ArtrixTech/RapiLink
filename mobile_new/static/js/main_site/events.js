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

    if (state.getState("cusLinkAvailable_file")) $(id.cusLinkIndicatorSpan).text("链接可用")
    else {
        $(id.cusLinkIndicatorSpan).text("链接无效")
        $(id.cusLinkIndicator).css('animation', '.8s shake');
        $(id.cusLinkIndicator)[0].addEventListener("animationend", function () {
            $(this).css("animation", "");
        });
    }

})