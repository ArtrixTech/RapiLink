function apiGet(apiLocation, params, recallFunction) {

    $.get("/get", {
            url: "http://api.rapi.link/" + apiLocation,
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