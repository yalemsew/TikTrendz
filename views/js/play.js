$(document).ready(function () {
  $(".play-button").click(function () {
    // get video
    var video = $("#mainVideo")[0]; 
    if (video.paused) {
      video.play();
      $(this).fadeOut();
    } else {
      video.pause();
      $(this).fadeIn();
    }
  });

  $("#mainVideo").click(function () {
    $(this).pause();
    $(".play-button").fadeIn();
  });
});
