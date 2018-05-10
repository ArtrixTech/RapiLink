var business_obj = {

    link_input: document.getElementById("link_input"),
    link_gen_window: document.getElementById("link_gen_window"),
    indicator1: document.getElementById("indicator1"),
    customize_link_input: document.getElementById("customize_link_input")

};

var timer1;
var ok = false;

function startTimer1() {

    timer1 = self.setInterval("onTimer1()", 250);

}

function stopTimer1() {

    timer1 = window.clearInterval(timer1);

}

function onTimer1() {

    isLinkAvailable(false);
    if (ok) {
        indicator1Good();
    } else {
        indicator1Bad();
    }

}

function linkFloatWindowExpand() {

    business_obj.link_gen_window.className = "float_window float_window_config_link_expand";

}

function linkFloatWindowFold() {

    business_obj.link_gen_window.className = "float_window float_window_config_link";

}

function indicator1Good() {
    business_obj.indicator1.className = "indicator good";
}

function indicator1Bad() {
    business_obj.indicator1.className = "indicator bad";
}


function genLink() {

    if (business_obj.link_gen_window.className == "float_window float_window_config_link") {

        business_obj.link_gen_window.className = "float_window float_window_config_link_expand";

    } else {

        business_obj.link_gen_window.className = "float_window float_window_config_link";

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