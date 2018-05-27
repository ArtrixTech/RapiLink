function showMessageBar(id, message, message_type) {

  var barHeight = 30;

  var barObject = "<div id=\"" + id + "\" class=\"message_bar\"></div>";
  var textObject = "<span id=\"bar_text\" \"class=\"message_bar_text\">" + message + "</span>";
  $("body").prepend(barObject);
  $("#" + id).prepend(textObject);

  $("#" + id).css("height", 30);
  //alert($("#bar_text").width())
  $("#" + id).css("width", $("#bar_text").width() + 50);


  if (message_type == "GOOD") {

  }

  if (message_type == "WARNING") {
    var barColor = "#ff3f32fa"

    $("#" + id).css("background", color);
    $("#" + id).css("border-bottom", "2px solid white");
  }

  setTimeout(closeMessageBar, 3000, id);
}

function closeMessageBar(id) {
  $("#" + id).css("height", 0);
  $("#" + id).css("border-bottom", "0px solid rgb(255, 42, 42)");
  $("#bar_text").css("opacity", 0);
  var hideAnimationDuration = 0.5; // Unit: Second

  setTimeout(function remove(id) {
    $("#" + id).remove();
  }, hideAnimationDuration * 1000, id);
}