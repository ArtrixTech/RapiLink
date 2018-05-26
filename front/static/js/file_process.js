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

    progress_text = $("#progress_text");
    //progress_bar = $("#progress_bar");

    progress_text.text(prog + "% | " + (speed / 1000).toFixed(1) + "mb/s | " + result.timeStamp);
    //progress_bar.val(prog);
    //alert(progress_text);
}
var file_batch_id = "";

function getUnixTimeStamp() {
    return Math.round(new Date().getTime() / 1000);
}

function uploadFile() {

    var files = document.getElementById("file_input").files; //files是文件选择框选择的文件对象数组  
    file_batch_id = Math.round(new Date().getTime() / 1000) + Math.random().toString(36).substr(2).slice(0, 12).toUpperCase();

    if (files.length == 0) return;

    var form = new FormData(),
        url = 'http://api.rapi.link/upload',
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
        }
    });
    xhr.send(form); //开始上传  }
}


var onUpload = false;
$("#file_input").bind('change', function () {
    var files = document.getElementById("file_input").files;
    var file = files[0];
    //alert(file);
    if (files.length > 0) {

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
        onUpload = true;
    } else {
        isHoldFileIconLength = false;

        $("#file_icon").click(selectBtnClick);
        $("#file_input_span").click(selectBtnClick);

    }
});

function clickTheUploadInput() {
    if (!onUpload) document.getElementById("file_input").click();
}

function selectBtnClick() {

    clickTheUploadInput();
   

}

$("#file_icon").click(selectBtnClick);
$("#file_input_span").click(selectBtnClick);