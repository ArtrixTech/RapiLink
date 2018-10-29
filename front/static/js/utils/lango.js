function Lango() { }


Lango.prototype.Languages = {
    lang_zh_cn: "ZH_CN", // Chinese
    lang_en_us: "EN_US", // English - United States
    lang_ja_jp: "JA_JP", // Japanese - Japan
    lang_ko_kr: "KO_KR", // Korean - Korea
    lang_es_us: "ES_US", // Spanish - United States
    lang_es_es: "ES_ES" // Spanish - Spanish
};

Lango.prototype.countryCode = undefined;
Lango.prototype.language = undefined;
Lango.prototype.langContents = undefined;
Lango.prototype.languageDetected = undefined;

Lango.prototype.translateItemList = {};
Lango.prototype.stateList = {};

// CountryCode -> Languages Object
Lango.prototype.RegionDefaultLanguages = {
    CN: "ZH_CN", // Chinese
    US: "EN_US", // English - United States
    JP: "JA_JP", // Japanese - Japan
    KR: "KO_KR", // Korean - Korea
    ES: "ES_ES", // Spanish - United States
    // TODO: Check if the return api contains a "Unknown" option
};

Lango.prototype.Settings = {
    autoDetectLanguageByCountryCode: true,
    translateAllContents: false,
    defualtLanguage: "ZH_CN",
    languagePackRoot: "/"
};

Lango.prototype.isLangExist = function (lang) {

    for (key in this.Languages)
        if (this.Languages[key] == lang) return true;
    return false;

}

Lango.prototype.isRegionExist = function (region) {

    for (key in this.RegionDefaultLanguages)
        if (region == key) return true;
    return false;

}

Lango.prototype.init = function () {

    this.countryCode = "CN";
    this.language = undefined;
    this.languageDetected = false;
    this.langPackLoaded = false;
    this.langPackLanguage = undefined;

    // Detect if the JQuery.cookie is exist
    // TODO: Add a script loading location property
    function loadScript(loc) {
        var newScript = document.createElement("script");
        newScript.setAttribute("type", "text/javascript");
        newScript.setAttribute("src", loc);
        document.body.appendChild(newScript);
    } !window.jQuery && loadScript("jquery-3.3.1.min.js");
    !window.jQuery.cookie && loadScript("jquery.cookie.js");

    this.getLanguage();

}

Lango.prototype.getLangByGeoInfo = function (callback) {

    var geoInfoURL = "http://ip-api.com/json/?fields=countryCode,query";

    $.ajax({
        url: geoInfoURL,
        context: this, // Use "context" to send the this object
        success: function (result) {

            this.countryCode = result.countryCode;
            console.log("Got CountryCode:" + this.countryCode);

            if (this.isRegionExist(this.countryCode)) this.language = this.RegionDefaultLanguages[this.countryCode];
            else this.language = this.Settings.defualtLanguage;

            this.languageDetected = true;

            console.log("Got Language:" + this.language);
            $.cookie('lango_site_language', this.language, {
                path: '/'
            });
            this.translate(this.language);

        }
    });

}

Lango.prototype.getLanguage = function () {

    // TODO: Judge if the ip has changed and change the language by it.
    var langFromCookie = $.cookie('lango_site_language');
    if (langFromCookie) {
        this.language = langFromCookie;
        this.languageDetected = true;
        console.log("Got Language[From Cookie]:" + this.language);
        this.translate(this.language);
    } else {
        if (this.Settings.autoDetectLanguageByCountryCode) this.getLangByGeoInfo();
        else {
            this.language = this.Settings.defualtLanguage;
            this.translate(this.language);
            console.log("Got Language[From Default Language]:" + this.language);
        }
    }

}

Lango.prototype.loadLanguagePack = function (lang, callback) {

    var baseLoc = this.Settings.languagePackRoot;
    baseLoc += lang + ".json";

    function isJsonObject(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return true;
        }
        return false;
    }

    // If the langPack was loaded, just active the callback function.
    if (this.langPackLoaded && this.langPackLanguage == lang) callback(this, this.langPackLoaded);
    else {

        this.langPackLoaded = false;

        $.ajax({
            url: baseLoc,
            context: this,
            success: function (result) {

                if (!isJsonObject(result)) this.langContents = JSON.parse(result);
                else this.langContents = result;

                if (this.langContents.language == lang) {
                    this.language = this.langContents.language;
                    this.langContents = this.langContents.contents;
                    this.langPackLoaded = true;
                    this.langPackLanguage = this.langContents.language;

                    callback(this, this.langPackLoaded);
                } else throw Error = "Language pack is not correct.[" + this.language + "]";

            },
            error: function (XHR, status, errorThrown) {
                if (XHR.status == "404") throw Error = "Language pack [" + lang + "] is not exist.";
                throw Error = "[Unknown Error] StatusCode:" + XHR.status + " | StatusText:" + status;
            }
        });

    }

}

Lango.prototype.updateTranslateItemList = function () {

    var that = this;

    function processItem() {

        // TODO: Add recursive children check

        //alert($(this).children().length)
        //if($(this).children().length>1)$(this).each(processItem)
        //;
        var langoID = $(this).attr("lango_id");
        if (langoID) {
            that.translateItemList[langoID] = $(this);
            if (!that.stateList[langoID]) that.stateList[langoID] = "default";
        }
    }

    $("span").each(processItem);
    $("div").each(processItem);
    $("p").each(processItem);
    $("a").each(processItem);
    $("i").each(processItem);

}

Lango.prototype.setState = function (langoID, state) {
    if (this.langPackLoaded) {
        var translateContent = this.langContents[langoID];
        if (translateContent) {
            var states = translateContent.states;
            if (states) {
                this.stateList[langoID] = state;
                return state
            } else throw ReferenceError = "This element" + "[" + langoID + "]  doesn't contain a \"state\" property.";
        } else throw ReferenceError = "This element " + "[" + langoID + "] doesn't exist.";
    } else throw ReferenceError = "Language pack is not loaded.";
}


// TODO: Add css parsing part to finish this module.
Lango.prototype.rerender = function () {

    this.updateTranslateItemList();

    for (key in this.translateItemList) {

        var item = this.translateItemList[key];

        var langoID = item.attr("lango_id");
        var translateContent = this.langContents[langoID];

        if (translateContent) {

            var states = translateContent.states;

            // TODO: Parse the css part.
            if (states) item.text(states[this.stateList[langoID]].text);
            else item.text(translateContent.text);

        }
    }

}


Lango.prototype.translate = function (lang) {

    function parseCSS(object, cssList) {
        // TODO: Finish this module.
    }

    if (this.isLangExist(lang)) {

        this.updateTranslateItemList();

        function doTranslate(that, loaded) {
            for (key in that.translateItemList) {

                var item = that.translateItemList[key];

                var langoID = item.attr("lango_id");
                var translateContent = that.langContents[langoID];

                if (translateContent) {

                    var states = translateContent.states;

                    // TODO: Parse the css part.
                    if (states) item.text(states[that.stateList[langoID]].text);
                    else item.text(translateContent.text);

                }
            }
        }

        this.loadLanguagePack(lang, doTranslate);

    } else throw TypeError = "Input language is not in support list.";

}