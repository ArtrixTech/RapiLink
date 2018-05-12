var business_obj = {

    link_input: document.getElementById("link_input"),
    link_gen_window: document.getElementById("link_gen_window"),
    indicator1: document.getElementById("indicator1"),
    customize_link_input: document.getElementById("customize_link_input"),
    link_hover_btn: document.getElementById("link_hover_btn"),
    f_window_bar1: document.getElementById("f_window_bar1"),
    f_window_bar2: document.getElementById("f_window_bar2"),
    link_whole_link_label: document.getElementById("link_whole_link_label"),
    link_whole_link: document.getElementById("link_whole_link")

};

var timer1;
var ok = true;
var lastText = "";
var isLinkFloatWindowFold = true;
var link_showBar = 1;

var isOnFinish = false;

function startTimer1() {

    timer1 = self.setInterval("onTimer1()", 100);

}

function stopTimer1() {

    timer1 = window.clearInterval(timer1);

}

function updAllState() {

    linkHoverBtnState();
    //alert("1");
    indicator1State();
    //alert("2");
    updLinkFloatWindow();
    //alert("3");
}

function onTimer1() {

    if (business_obj.customize_link_input.value != lastText) {
        lastText = business_obj.customize_link_input.value
        isLinkAvailable(false);

        //while (!availableLoadFinished){}
        //updAllState();
        //setTimeout("updAllState()", 50);
        //setTimeout("updAllState()", 200);

    }

}

function updLinkFloatWindow() {

    business_obj.link_gen_window.className = "float_window";


    if (isOnFinish) {
        business_obj.link_gen_window.className += " f_finished";
        business_obj.link_gen_window.className += " float_window_config_link_expand_finished";
    }
    else {

        if (isLinkFloatWindowFold) {

            business_obj.link_gen_window.className += " float_window_config_link";

            if (link_showBar == 1) business_obj.f_window_bar1.className = "hidden";
            if (link_showBar == 2) business_obj.f_window_bar2.className = "hidden";

        } else {

            business_obj.link_gen_window.className += " float_window_config_link_expand";

            if (link_showBar == 1) business_obj.f_window_bar1.className = "";
            if (link_showBar == 2) business_obj.f_window_bar2.className = "";
        }

        if (ok) {
            business_obj.link_gen_window.className += " f_good";
        } else {
            business_obj.link_gen_window.className += " f_bad";
        }
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
    '#customize_link_label', '#customize_link_input', '#indicator1', '#link_hover_btn',
    '#link_whole_link_label', '#link_whole_link', '#indicator2', '#f_window_bar2'];

// Handle click event of #body
$('#b').click(function (e) {
    if (isInTargetList(e.target, targetList1)) {
        linkFloatWindowExpand();
    } else {
        linkFloatWindowFold();
    }

    // Click#link_whole_link
    if ($(e.target).is('#link_whole_link')) {
        //business_obj.link_whole_link.select();
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

    function finished() {
        business_obj.f_window_bar1.className = "hidden";
        business_obj.f_window_bar2.className = "";

        link_showBar = 2;
        isOnFinish = true;

        business_obj.link_whole_link.value = "http://rapi.link/" + business_obj.customize_link_input.value;

        updLinkFloatWindow();

    }

    function restore() {

        business_obj.f_window_bar1.className = "";
        business_obj.f_window_bar2.className = "hidden";
        link_showBar = 1;
        isOnFinish = false;
        updLinkFloatWindow();

    }

    function error(input) {
        alert(input);

    }

    if (ok) {

        $.get("/get", {
            url: "http://api.rapi.link/add_url",
            params: "{\"alias\":\"" + business_obj.customize_link_input.value + "\",\"target\":\"" + business_obj.link_input.value + "\"}"
        },
            function (data) {
                if (data == "OK") {
                    finished();
                } else {
                    error(data);
                }
            });
    }

    return false

};


var availableLoadFinished=false;
function isLinkAvailable(result) {

    if (result) {
        //alert(result);
        if (result == "OK") { ok = true; }
        else { ok = false; }
        //alert("ok");
        updAllState();
    } else {
        $.get("/get", { url: "http://api.rapi.link/alias_available", params: "{\"alias\":\"" + business_obj.customize_link_input.value + "\"}" }, function (data) {
            isLinkAvailable(data);
        });
    }


};