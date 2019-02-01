function showMessageBar(id, message, message_type, hideDelay = 3000) {

  var barHeight = 68;

  var barObject = "<div id=\"" + id + "\" class=\"message_bar\"></div>";
  var textObject = "<span id=\"bar_text\" \"class=\"message_bar_text\">" + message + "</span>";
  $("body").prepend(barObject);
  $("#" + id).prepend(textObject);

  $("#" + id).css("height", barHeight);
  //alert($("#bar_text").width())
  $("#" + id).css("width", $("#bar_text").width() + 128);


  if (message_type == "GOOD") {

    var barColor = "rgb(46, 176, 243)";
    $("#" + id).css("background", barColor);
    $("#" + id).css("border-bottom", "3px solid white");

  }

  if (message_type == "WARNING") {

    var barColor = "rgb(220, 67, 67)";
    $("#" + id).css("background", barColor);
    $("#" + id).css("border-bottom", "3px solid white");

  }

  setTimeout(closeMessageBar, hideDelay, id);
}

function closeMessageBar(id) {
  $("#" + id).css("height", 0);
  $("#" + id).css("border-bottom", "0px solid white");
  $("#bar_text").css("opacity", 0);
  var hideAnimationDuration = 0.5; // Unit: Second

  setTimeout(function remove(id) {
    $("#" + id).remove();
  }, hideAnimationDuration * 1000, id);
}