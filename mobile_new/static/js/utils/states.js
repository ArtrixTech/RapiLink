function States() {

    this.states = {};
    this.elements = {}; // This dict contains elementName and its related states
    this.updateFunctions = {};

    this.contains = (list, obj) => {
        for (index in list)
            if (list[index] === obj) return true;
        return false;
    };

    this.getState = (stateName) => {
        if (this.states.hasOwnProperty(stateName)) return this.states[stateName];
        throw Error = "State unexist.";
    };

    this.setState = (stateName, value) => {

        if (this.states.hasOwnProperty(stateName)) {

            if (this.states[stateName] != value) { // Only call function when value changes.

                this.states[stateName] = value;
                var toCall = [];
                for (key in this.elements) {
                    var relatedStates = this.elements[key];
                    if (this.contains(relatedStates, stateName)) toCall.push(key) // Only push element name.
                }

                for (index in toCall) {

                    var elementName = toCall[index]

                    function throwErr(errMsg) {
                        throw Error = "State set failed due to '" + errMsg + "'.";
                    }
                    if (this.updateFunctions.hasOwnProperty(elementName)) {
                        var callFunc = this.updateFunctions[elementName];
                        if (typeof callFunc === "function") callFunc();
                        else throwErr("Element[" + elementName + "]'s update function is not a function.");
                    }else throwErr("Element[" + elementName + "] didn't bind with an update function.");
                }
            }

        } else throw Error = "State unexist or unbound.";

    };

    this.bindElementUpdateFunction = (elementName, updateFunction) => {
        if (this.elements.hasOwnProperty(elementName)) this.updateFunctions[elementName] = updateFunction;
        else throw Error = "Element unexist.";
    };

    this.bindStateWithElement = (stateName, elementName) => {
        this.states[stateName] = NaN;
        if (this.elements.hasOwnProperty(elementName)) {
            // Unique operation.
            if (!this.contains(this.elements[elementName], stateName)) this.elements[elementName].push(stateName);
        } else this.elements[elementName] = [stateName];
    };


}

var state = new States();
/*
var state = new States();

state.bindStateWithElement("show", "element1");
state.bindStateWithElement("show", "element2");
state.bindStateWithElement("color", "element2");

state.setState("show", true);


state.bindElementUpdateFunction("element1", () => {
    if (state.getState("show")) $("#e1").removeClass("hidden");
    else $("#e1").addClass("hidden");
})
state.bindElementUpdateFunction("element2", () => {
    if (state.getState("show")) $("#e2").removeClass("hidden");
    else $("#e2").addClass("hidden");
    $("#e2").css("color", state.getState("color"));
})*/