function LangDetector() { }

LangDetector.prototype.init = function i() {

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

LangDetector.prototype.getLang = function get() {

    

}