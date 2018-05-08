var obj = {
    file: document.getElementById("file"),
    link: document.getElementById("link"),
    text: document.getElementById("text"),

    file_icon: document.getElementById("file_btn"),
    link_icon: document.getElementById("link_btn"),
    text_icon: document.getElementById("text_btn"),

    file_label: document.getElementById("file_label"),
    link_label: document.getElementById("link_label"),
    text_label: document.getElementById("text_label")
    };



function changeFile(){

    obj.file.className = "make_file";
    obj.link.className = "hidden";
    obj.text.className = "hidden";

    obj.link_icon.className = "icon";
    obj.file_icon.className = "icon_selected";
    obj.text_icon.className = "icon right1";

     obj.file_label.className = "label_for_btn";
            obj.link_label.className = "hidden";
            obj.text_label.className = "hidden";
    return false

};

function changeLink(){

    obj.file.className = "hidden";
    obj.link.className = "make_link";
    obj.text.className = "hidden";

    obj.file_icon.className = "icon right";
    obj.link_icon.className = "icon_selected";
    obj.text_icon.className = "icon right";

    obj.file_label.className = "hidden";
            obj.link_label.className = "label_for_btn";
            obj.text_label.className = "hidden";
    return false

};

function changeText(){

    obj.file.className = "hidden";
    obj.link.className = "hidden";
    obj.text.className = "make_text";

    obj.file_icon.className = "icon";
    obj.link_icon.className = "icon";
    obj.text_icon.className = "icon_selected";

    obj.file_label.className = "hidden";
            obj.link_label.className = "hidden";
            obj.text_label.className = "label_for_btn";
    return false

};