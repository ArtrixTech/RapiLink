function Lango() { }

Lango.prototype.init = function i() {

    // Detect if the JQuery.cookie is exist
    function loadScript(loc) {
        var newScript = document.createElement("script");
        newScript.setAttribute("type", "text/javascript");
        newScript.setAttribute("src", loc);
        document.body.appendChild(newScript);
    }
    !window.jQuery && loadScript("static/js/jquery-3.3.1.min.js");
    !window.jQuery.cookie && loadScript("static/js/jquery.cookie.js");

}

Lango.prototype.lang_zh_cn=0;
Lango.prototype.lang_en_us=1;

Lango.prototype.strToLang=function stl(str){

    if (str=="ZH_CN")return lango.lang_zh_cn;
    if (str=="EN_US")return lango.lang_en_us;

    return lango.lang_zh_cn;

}


Lango.prototype.getLang = function get() {

    var langFromCookie=$.cookie('lango_site_language');
    if (langFromCookie) return this.strToLang(langFromCookie);

}