function apiGet(apiLocation, params, recallFunction) {

    $.get("/get", {
        url: "http://api.rapi.link/" + apiLocation,
        params: JSON.stringify(params)
    },
        recallFunction)

}