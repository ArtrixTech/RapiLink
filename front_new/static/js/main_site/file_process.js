/*
$('.media')[0].ondragover = function(ev) {
    var oEvent = ev || window.event;
    $('h3')[0].innerHTML = '松开鼠标后开始上传';
    // 注意禁止浏览器默认事件      
    oEvent.preventDefault();
}
// 离开目标区域
$('.media')[0].ondragleave = function(ev) {
    var oEvent = ev || window.event;
    $('h3')[0].innerHTML = '拖拉文件到虚线框内上传';
    // 注意禁止浏览器默认事件
    oEvent.preventDefault();
}
// 目标文件落在目标区域
$('.media')[0].ondrop = function(ev) {
    var oEvent = ev || window.event;
    // 获取预览区域 生成预览
    var oPreview = document.createElement('div');
    var oProgress = document.createElement('progress');
    oProgress.setAttribute('max',100);
    oProgress.setAttribute('value',0);
    // 生成不同的id 方便上传进度实时预览
    var rstr = randomStr();
    oPreview.setAttribute('class' , 'madia_upload_preview');
    oPreview.setAttribute('id' , 'madia_upload_preview_' + rstr);
    oPreview.appendChild(oProgress);
    $('.media_upload').appendChild(oPreview);
    // 获取form对象
    var oForm = $('form')[0];
    // 获取文件对象
    var oFile = oEvent.dataTransfer;
    
    
    oEvent.preventDefault();
}*/
var lastLoaded = 0;
var lastTime = 0;

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
var percentInt = 0;

function onProgress(result) {

    if (lastTime == 0) {
        lastTime = result.timeStamp;
    }


    var percent = (result.loaded / result.total * 100).toFixed(2);
    var prog = percent;

    var speed = 0;

    if (result.loaded != lastLoaded) {
        speed = smoother((result.loaded - lastLoaded) / (result.timeStamp - lastTime));
        lastLoaded = result.loaded;
        lastTime = result.timeStamp;
    }

    // Finished
    if (result.loaded == result.total) {
        lastLoaded = 0;
        lastTime = 0;
    }

    percentInt = parseInt(percent);
    updateProgressBar();

    progress_text = $("#progress_text");
    //progress_bar = $("#progress_bar");

    progress_text.text((speed / 1000).toFixed(1) + "MB/s");
    //progress_bar.val(prog);
    //alert(progress_text);
}
var file_batch_id = "";

function getUnixTimeStamp() {
    return Math.round(new Date().getTime() / 1000);
}

var showProgressBar = false;

function uploadFile() {

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

    if (isAliasAvailable_File) {
        onError_File = false;

        var files = document.getElementById("file_input").files; //files是文件选择框选择的文件对象数组  
        file_batch_id = Math.round(new Date().getTime() / 1000) + Math.random().toString(36).substr(2).slice(0, 12).toUpperCase();

        if (files.length == 0) return;

        var url;
        if (window.location.protocol == "http:") url = 'http://api.rapi.link/upload';
        if (window.location.protocol == "https:") url = 'https://api.rapi.link/upload';

        var form = new FormData(),
            url = url,
            //url = 'http://localhost:5000/upload',
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

                    $("#rplnk-qrcode-img").attr("src", "http://api.rapi.link/qr_code?url=" 
                    + "https://rapi.link/" + $("#customize_link_input_file").val() 
                    + "&color={%22R%22:"+sourceColor[0]+",%22G%22:"+sourceColor[1]+",%22B%22:"+sourceColor[2]+",\"A\":255}")

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


var inUploadProcess = false;
var isFileFloatWindowFold = true;
$("#file_input").bind('change', function () {


    var files = document.getElementById("file_input").files;
    var file = files[0];
    //alert(file);
    if (files.length > 0) {

        var file_size = file.size / (1024 * 1024);
        var max_size = 100; // Unit: MB

        if (file_size > max_size) {
            // Show file sizes
            showMessageBar("msg_bar",
                "File too big ! Maximium is 100MB, Your file is " + file_size.toFixed(1) + "MB.",
                "WARNING",
                3000);
            document.getElementById("file_input").value = "";
            //linear-gradient(120deg, #4b9ae8 0%, #4b9ae8 70%, #c5cfdb 70%)
        } else {
            isFileFloatWindowFold = false;
            isHoldFileIconLength = true;

            // TODO: after finished, set this value to false;
            // Use for preventing double event-trigger
            inUploadProcess = true;

            updateFloatWindow_File();
            updateProgressBar();
            fileIconUnhover();

            $("#file_input_span").text(file.name + " | Click to upload");

        }
    } else {
        isHoldFileIconLength = false;

        $("#file_icon").click(selectBtnClick);
        $("#file_input_span").click(selectBtnClick);

    }
});

function clickTheUploadInput() {
    if (!inUploadProcess) document.getElementById("file_input").click();
}

function selectBtnClick() {

    var cus_link = $("#customize_link_input_file").val();

    if (inUploadProcess) {
        if (cus_link) uploadFile();
        else showMessageBar("msg_bar",
            "Please input the customized link first!",
            "WARNING",
            3000);
    } else clickTheUploadInput();


}

//Click event listening
$("#file_icon").click(selectBtnClick);
$("#file_input_span").click(selectBtnClick);

var p_right_fully_expand = 609,
    p_right_middle_expand = 116;

var onError_File = false;

function updateProgressBar() {

    if (onHover) {
        if (onError_File) $("#file_icon").css("background", "linear-gradient(120deg, rgb(205, 81, 81) 0%, rgb(232, 99, 75) " + percentInt + "%, " + color + " " + percentInt + "%)");
        else $("#file_icon").css("background", "linear-gradient(120deg, rgb(61, 140, 218) 0%, rgb(60, 114, 202) " + percentInt + "%, " + color + " " + percentInt + "%)");
    } else {
        if (onError_File) $("#file_icon").css("background", "linear-gradient(120deg, rgb(205, 81, 81) 0%, rgb(232, 99, 75) " + percentInt + "%, " + color + " " + percentInt + "%)");
        else $("#file_icon").css("background", "linear-gradient(120deg, #4b9ae8 0%, rgb(69, 124, 212) " + percentInt + "%, " + color + " " + percentInt + "%)");
    }

}

var onHover = false;

function fileIconHover() {

    onHover = true;
    if (!showProgressBar) $("#file_icon").css("background", colorAlpha3);
    else updateProgressBar();

    $("#file_input_span").css("opacity", 1);

    if (isHoldFileIconLength) {
        $("#file_icon").css("padding-right", p_right_fully_expand);
        $("#file_input_span").css("color", "white");
    } else {
        $("#file_icon").css("padding-right", p_right_middle_expand);
    }

    $("#file_input_span").css("color", "white");
    $("#file_input_span").css("left", "41");

}

function fileIconUnhover() {

    onHover = false;
    if (!showProgressBar) $("#file_icon").css("background", colorAlpha2);
    else updateProgressBar();
    // Var "isHoldFileIconLength" is in file_process.js
    if (isHoldFileIconLength) {
        $("#file_icon").css("padding-right", p_right_fully_expand);
        $("#file_input_span").css("color", "white");
        $("#file_input_span").css("left", "41");
    } else {
        $("#file_icon").css("padding-right", 16);
        $("#file_input_span").css("color", color);
        $("#file_input_span").css("left", "57");
    }
}

$("#file_icon").mouseover(function () {
    fileIconHover();
});
$("#file_icon").mouseout(function () {
    fileIconUnhover();
});

$("#file_input_span").mouseover(function () {
    fileIconHover();
});
$("#file_input_span").mouseout(function () {
    fileIconUnhover();
});

function startTimer2() {

    timer2 = self.setInterval("onTimer2()", 100);

}

function stopTimer2() {

    timer2 = window.clearInterval(timer2);

}

var lastText2 = "";

function onTimer2() {

    if ($("#customize_link_input_file").val() != lastText2) {
        lastText2 = $("#customize_link_input_file").val();
        aliasAvailable(false);
    }

}

var isOnFinish_File = false;
var isAliasAvailable_File = true;

function updateFloatWindow_File() {

    function removeAllWindowState() {
        $("#link_gen_window_file").removeClass("float_window_config_file_expand_finished");
        $("#link_gen_window_file").removeClass("float_window_config_file");
        $("#link_gen_window_file").removeClass("f_finished");
        $("#link_gen_window_file").removeClass("float_window_config_file_expand");
        $("#link_gen_window_file").removeClass("f_good");
        $("#link_gen_window_file").removeClass("f_bad");
    }

    removeAllWindowState();


    if (isOnFinish_File) {
        $("#link_gen_window_file").addClass("f_finished");
        $("#link_gen_window_file").addClass("float_window_config_file_expand_finished");

        $("#file_message_bar_stage1").addClass("hidden");
        $("#file_message_bar_stage2").removeClass("hidden");

    } else {

        $("#file_message_bar_stage2").addClass("hidden");
        $("#file_message_bar_stage1").removeClass("hidden");

        if (isFileFloatWindowFold) {

            $("#link_gen_window_file").addClass("float_window_config_file");

        } else {

            $("#link_gen_window_file").addClass("float_window_config_file_expand");

        }

        if (isAliasAvailable_File) {
            $("#link_gen_window_file").addClass("f_good");
            $("#indicator_file").attr("class", "indicator good");
        } else {
            $("#link_gen_window_file").addClass("f_bad");
            $("#indicator_file").attr("class", "indicator bad");
        }

        if (isHoldFileIconLength) {
            $("#file_icon").css("padding-right", p_right_fully_expand);
        }

    }
}


function aliasAvailable(result) {

    if (result) {
        if (result == "OK") {
            isAliasAvailable_File = true;
        } else {
            isAliasAvailable_File = false;
        }
        updateFloatWindow_File();
    } else {
        apiGet("/alias_available", {
            alias: $("#customize_link_input_file").val()
        },
            function (data) {
                aliasAvailable(data);
            });
    }


};

function qrcode_show(){
    $("#rplnk-qrcode-img").removeClass("hidden");
    $("#rplnk-qrcode-icon").addClass("hidden");
}

function qrcode_hide(){
    $("#rplnk-qrcode-img").addClass("hidden");
    $("#rplnk-qrcode-icon").removeClass("hidden");
}

$("#rplnk-qrcode-img").click(qrcode_hide)
$("#rplnk-qrcode-icon").click(qrcode_show)
