const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  repeat: true,
  getDirection: true,
});

$(document).ready(function () {
  scroll.update();
});
