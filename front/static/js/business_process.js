var business_obj = {

    link_input: document.getElementById("link_input"),
    link_gen_window: document.getElementById("link_gen_window"),
    indicator1: document.getElementById("indicator1"),
    customize_link_input: document.getElementById("customize_link_input"),
    link_hover_btn: document.getElementById("link_hover_btn")

};

var timer1;
var ok = true;
var lastText = "";
var isLinkFloatWindowFold = true;

function startTimer1() {

    timer1 = self.setInterval("onTimer1()", 100);

}

function stopTimer1() {

    timer1 = window.clearInterval(timer1);

}

function updAllState() {

    linkHoverBtnState();
    indicator1State();
    updLinkFloatWindow();

}

function onTimer1() {

    if (business_obj.customize_link_input.value != lastText) {
        lastText = business_obj.customize_link_input.value
        isLinkAvailable(false);

        setTimeout("updAllState()", 50);

    }

}

function updLinkFloatWindow() {

    business_obj.link_gen_window.className = "float_window";

    if (isLinkFloatWindowFold) {
        business_obj.link_gen_window.className += " float_window_config_link";
    } else {
        business_obj.link_gen_window.className += " float_window_config_link_expand";
    }

    if (ok) {
        business_obj.link_gen_window.className += " f_good";
    } else {
        business_obj.link_gen_window.className += " f_bad";
    }

}

function linkFloatWindowFold() {

    isLinkFloatWindowFold = true;
    updLinkFloatWindow();

}

function linkFloatWindowExpand() {

    isLinkFloatWindowFold = false;
    updLinkFloatWindow();

}

function isInTargetList(inputTarget, inputTargetList) {

    for (var t in inputTargetList) {

        if ($(inputTarget).is(inputTargetList[t])) return true;

    }
    return false;

}

var targetList1 = ['#link_input', '#link_gen_window', '#f_window_bar1',
    '#customize_link_label', '#customize_link_input', '#indicator1'];

// Handle click event of #body
$('#b').click(function (e) {
    if (isInTargetList(e.target, targetList1)) {
        linkFloatWindowExpand();
    } else {
        linkFloatWindowFold();
    }
})

function linkHoverBtnState() {
    if (ok) business_obj.link_hover_btn.className = "link_hover_btn";
    else business_obj.link_hover_btn.className = "link_hover_btn deactivated";
}


function indicator1State() {

    if (ok) business_obj.indicator1.className = "indicator good";
    else business_obj.indicator1.className = "indicator bad";
}


function genLink() {

    if (ok) {

        $.get("/get", { url: "http://api.rapi.link/add_url", params: "{\"url_name\":\"" + business_obj.customize_link_input.value + "\",\"target_url\":\"" + business_obj.link_input.value + "\"}" }, function (data) {

        });
    }

    return false

};



function isLinkAvailable(result) {

    if (result) {
        //alert(result);
        if (result == "OK") { ok = true; }
        else { ok = false; }
    } else {
        $.get("/get", { url: "http://api.rapi.link/name_available", params: "{\"name\":\"" + business_obj.customize_link_input.value + "\"}" }, function (data) {
            isLinkAvailable(data);
        });
    }


};