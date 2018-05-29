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
            console.log('上传失败', result.status, result.statusText, result.response);
        } else if (result.readyState == 4) { //finished  
            console.log('上传成功', result);
            showMessageBar("msg_bar_succeed", "File upload succeed!", "GOOD", 2500);
        }
        $("#progress_text").text("Finished!");
    });
    showProgressBar = true;
    $("#progress_text").css("opacity", 1);

    //TODO: Change Color of the #progress_text!

    xhr.send(form); //开始上传  }
}


var inUploadProcess = false;
$("#file_input").bind('change', function () {
    var files = document.getElementById("file_input").files;
    var file = files[0];
    //alert(file);
    if (files.length > 0) {

        var file_size = file.size / (1024 * 1024);
        var max_size = 20; // Unit: MB

        if (file_size > max_size) {
            // Show file size
            showMessageBar("msg_bar",
                "File too big ! Maximium is 20MB, Your file is " + file_size.toFixed(1) + "MB.",
                "WARNING",
                3000);
            //linear-gradient(120deg, #4b9ae8 0%, #4b9ae8 70%, #c5cfdb 70%)
        } else {
            fWindow_link = document.getElementById("link_gen_window_file")

            fWindow_link.classList.remove("float_window_config_file")
            fWindow_link.classList.remove("float_window_config_file_expand_finished")
            fWindow_link.classList.add("float_window_config_file_expand")

            isHoldFileIconLength = true;
            $("#file_input_span").text(file.name + " | Click to upload");

            $("#file_icon").click(uploadFile);
            $("#file_input_span").click(uploadFile);

            // TODO: after finished, set this value to false;
            // Use for preventing double event-trigger
            inUploadProcess = true;
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

    clickTheUploadInput();

}

//Click event listening
$("#file_icon").click(selectBtnClick);
$("#file_input_span").click(selectBtnClick);

var p_right_fully_expand = 609,
    p_right_middle_expand = 116;

function updateProgressBar() {

    if (onHover) {
        $("#file_icon").css("background", "linear-gradient(120deg, rgb(61, 140, 218) 0%, rgb(61, 140, 218) " + percentInt + "%, " + color + " " + percentInt + "%)");
    }
    else {
        $("#file_icon").css("background", "linear-gradient(120deg, #4b9ae8 0%, #4b9ae8 " + percentInt + "%, " + color + " " + percentInt + "%)");
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