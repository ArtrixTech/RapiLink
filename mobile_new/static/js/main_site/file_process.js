var isCusLinkAvailable_File = false; // When updating the form, check if the input is blank.

function getUnixTimeStamp() {
    return Math.round(new Date().getTime() / 1000);
}

function checkCusLinkAvailability(isresult) {

    function getResponse(data) {
        state.setState("cusLinkAvailable_file", (data == "OK"));
    }

    apiGet("/alias_available", {
            alias: $(id.cusLinkInput).val()
        },
        function (data) {
            getResponse(data);
        });

};

function CusLinkWatcher() {

    this.cusLinkTimer = NaN;
    this.lastCusLink = "";
    this.onCusLinkChange = () => {
        if ($(id.cusLinkInput).val() != lastCusLink) {
            lastCusLink = $(id.cusLinkInput).val();
            checkCusLinkAvailability();
        }
    };
    this.start = () => {
        var that = this;
        this.cusLinkTimer = self.setInterval(() => {
            that.onCusLinkChange();
        }, 1000, this);
    };
    this.stop = () => {
        window.clearInterval(cusLinkTimer);
    };

}
/*
CusLinkWatcher.prototype.cusLinkTimer = NaN;
CusLinkWatcher.prototype.lastCusLink = "";
CusLinkWatcher.prototype.onCusLinkChange = () => {
    alert(1)
    if ($(id.cusLinkInput).val() != lastCusLink) {
        lastCusLink = $(id.cusLinkInput).val();
        //aliasAvailable(false);
    }
}
CusLinkWatcher.prototype.start = () => {
    alert(this)
    var that = this;
    this.cusLinkTimer = self.setInterval(() => {
        //alert(that)
        that.onCusLinkChange();
    }, 1000, this);
}
CusLinkWatcher.prototype.stop = () => {
    window.clearInterval(cusLinkTimer);
}*/
var cusLinkWatcher = new CusLinkWatcher();



function uploadProcess(files) {
    var file = files[0];
    //alert(file.name.gblen())
    $("#chosen_filename").text("" + file.name + "");
    $('#rplink_upload_step2').removeClass('hidden');

    setLinkInputWidth(); // This function is for UI setups.
    HorizontalSwiper_Main.update();
    setTimeout("HorizontalSwiper_Main.slideNext();", 128);
    setTimeout("$('#rplink_link_input').focus();", 1000);
}

function uploadFile(files) {

    function error(input) {
        if (input == "EMPTY_TARGET_URL") {
            alert("The target link is blank!");
            $("#progress_text").text("");
            return 0;
        }

        if (input == "ALIAS_EXIST") {
            showMessageBar("msg_bar_error2", "The customized link is already in use!", "WARNING", 3000);
            isAliasAvailable_File = false;
            updateFloatWindow_File();
            $("#progress_text").text(" Failed!");
            return 0;
        }

        showMessageBar("msg_bar_error", "Upload Failed. Please retry.", "WARNING", 3000);
    }

    if (true) {
        onError_File = false;

        file_batch_id = getUnixTimeStamp() + Math.random().toString(36).substr(2).slice(0, 12).toUpperCase();

        if (files.length == 0) return;

        var url;
        if (window.location.protocol == "http:") url = 'http://api.rapi.link/upload';
        if (window.location.protocol == "https:") url = 'https://api.rapi.link/upload';

        var form = new FormData(),
            url = url,
            file = files[0];
        form.append('file', file);
        form.append('batch_id', file_batch_id);
        form.append('alias', $("#customize_link_input_file").val());

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");

        //上传进度事件  
        xhr.upload.addEventListener("progress", function (result) {
            if (result.lengthComputable) {
                //上传进度  

                //alert(percent);
                onProgress(result);
            }
        }, false);

        xhr.addEventListener("readystatechange", function () {
            var result = xhr;
            if (result.status != 200) { //error  
                console.log('Upload Failed!', result.status, result.statusText, result.response);
            } else if (result.readyState == 4) { //finished  

                var json = JSON.parse(result.responseText);

                if (json["ok"] == "true") {
                    console.log('Upload Succeed', result);
                    onError_File = false;
                    isOnFinish_File = true;
                    updateProgressBar();
                    updateFloatWindow_File();
                    showMessageBar("msg_bar_succeed", "File upload succeed!", "GOOD", 2500);

                    $("#file_whole_link").val("https://rapi.link/" + $("#customize_link_input_file").val());
                    $("#progress_text").text("Finished!");

                    $("#rplnk-qrcode-img").attr("src", "http://api.rapi.link/qr_code?url=" +
                        "https://rapi.link/" + $("#customize_link_input_file").val() +
                        "&color={%22R%22:" + sourceColor[0] + ",%22G%22:" + sourceColor[1] + ",%22B%22:" + sourceColor[2] + ",\"A\":255}")

                } else {
                    error(result.responseText);
                    onError_File = true;
                    updateProgressBar();
                }
            }

        });
        showProgressBar = true;
        $("#progress_text").css("opacity", 1);

        //TODO: Change Color of the #progress_text!

        xhr.send(form); //开始上传  }
    } else {
        error("ALIAS_EXIST");
    }
}


var queueLength = 50;
var queue = [];

function smoother(now) {

    if (now == Infinity) now = 0;

    if (queue.length >= queueLength) {
        queue.reverse();
        queue.pop();
        queue.reverse();
        queue.push(now);
    } else {
        queue.push(now);
    }

    var count = 0;
    queue.forEach(element => {
        count += element;
    });
    return count / queue.length;
}