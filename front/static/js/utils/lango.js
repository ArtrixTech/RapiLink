function Lango() { }


Lango.prototype.Languages = {
    lang_zh_cn: "ZH_CN",    // Chinese
    lang_en_us: "EN_US",    // English - United States
    lang_ja_jp: "JA_JP",     // Japanese - Japan
    lang_ko_kr: "KO_KR",     // Korean - Korea
    lang_es_us: "ES_US",     // Spanish - United States
    lang_es_es: "ES_ES"      // Spanish - Spanish
};

Lango.prototype.countryCode = undefined;
Lango.prototype.language = undefined;
Lango.prototype.languageDetected = undefined;

// CountryCode -> Languages Object
Lango.prototype.RegionDefaultLanguages = {
    CN: "ZH_CN",    // Chinese
    US: "EN_US",    // English - United States
    JP: "JA_JP",     // Japanese - Japan
    KR: "KO_KR",     // Korean - Korea
    ES: "ES_ES",     // Spanish - United States
    // TODO: Check if the return api contains a "Unknown" option
};

Lango.prototype.Settings = {
    autoDetectLanguageByCountryCode: true,
    translateAllContents: false,
    defualtLanguage: "ZH_CN"
};

Lango.prototype.isLangExist = function (lang) {

    for (key in this.Languages) if (this.Languages[key] == lang) return true;
    return false;

}

Lango.prototype.isRegionExist = function (region) {

    for (key in this.RegionDefaultLanguages) if (region == key) return true;
    return false;

}

Lango.prototype.init = function () {

    this.countryCode = "CN";
    this.language = undefined;
    this.languageDetected = false;

    // Detect if the JQuery.cookie is exist
    function loadScript(loc) {
        var newScript = document.createElement("script");
        newScript.setAttribute("type", "text/javascript");
        newScript.setAttribute("src", loc);
        document.body.appendChild(newScript);
    }
    !window.jQuery && loadScript("jquery-3.3.1.min.js");
    !window.jQuery.cookie && loadScript("jquery.cookie.js");

    this.getLanguage();

}

Lango.prototype.getLangByGeoInfo = function (callback) {

    var geoInfoURL = "http://ip-api.com/json/?fields=countryCode,query";

    // Use "context" to send the this object
    $.ajax({
        url: geoInfoURL, context: this, success: function (result) {

            this.countryCode = result.countryCode;
            console.log("Got CountryCode:" + this.countryCode);

            if (this.isRegionExist(this.countryCode)) this.language = this.RegionDefaultLanguages[this.countryCode];
            else this.language = this.Settings.defualtLanguage;

            this.languageDetected = true;

            console.log("Got Language:" + this.language);

            $.cookie('lango_site_language', this.language, { path: '/' });

        }
    });

}

Lango.prototype.getLanguage = function () {

    var langFromCookie = $.cookie('lango_site_language');
    if (langFromCookie) {
        this.language = langFromCookie;
        this.languageDetected = true;
        console.log("Got Language[From Cookie]:" + this.language);
    }
    else {
        if (this.Settings.autoDetectLanguageByCountryCode) this.getLangByGeoInfo();
        else {
            this.language = this.Settings.defualtLanguage;
            console.log("Got Language[From Default Language]:" + this.language);
        }
    }

}


Lango.prototype.translate = function (lang) {

    if (this.isLangExist(lang)) {

        var translating = []
        $("span").each(function () {
            if ($(this).attr("lang_id")) translating.push($(this))
        });

        translating.forEach(function (item) {

            alert(item.attr("lang_id"))

        })

    }

    else throw Error = Error("Input language is not in support list.")

}