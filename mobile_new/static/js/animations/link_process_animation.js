var elements = {
    btn: document.getElementById("link_hover_btn")
    
};

function btnMouseDown(){

    elements.btn.classList.add("rotated");

}

function btnMouseUp(){

    elements.btn.classList.remove("rotated");

}
