function apiGet(apiLocation, params, recallFunction) {

    $.get("/get", {
            url: apiLocation,
            params: JSON.stringify(params)
        },
        recallFunction)

}

function apiGet_multiArgu(apiLocation, params, recallFunction) {

    function activate(data, status, xhr) {

        recallFunction(data, arguments.slice(1))

    }

    $.get("/get", {
            url: "http://api.rapi.link/" + apiLocation,
            params: JSON.stringify(params)
        },
        recallFunction)

}

function apiReturn(apiLocation, params) {

    $.get("/get", {
            url: "http://api.rapi.link/" + apiLocation,
            params: JSON.stringify(params)
        },
        recallFunction)

}

String.prototype.gblen = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}

function setLinkInputWidth() {
    var left_x = parseInt($('#rplink_link_prefix_span').innerWidth());
    var right_x = parseInt($('#rplink_link_input_box').innerWidth());
    lessmgr.modifyVars({
        '@link-input-width': right_x - left_x - 64
    });
}