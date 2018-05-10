var business_obj = {

    link_input: document.getElementById("link_input"),
    link_gen_window:document.getElementById("link_gen_window")

    };


function genLink(){

    if (business_obj.link_gen_window.className=="float_window float_window_config_link"){

        business_obj.link_gen_window.className="float_window float_window_config_link_expand";

    }else{

        business_obj.link_gen_window.className="float_window float_window_config_link";

    }
    return false

};


function isLinkAvailable(){

    if (business_obj.link_gen_window.className=="float_window float_window_config_link"){

        business_obj.link_gen_window.className="float_window float_window_config_link_expand";

    }else{

        business_obj.link_gen_window.className="float_window float_window_config_link";

    }
    return false

};