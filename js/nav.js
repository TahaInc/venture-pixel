// Drop down menu
$("#hamburger_menu").click(function () {
  if ($("#nav_content").hasClass("nav_active")) {
    $("#nav_content").removeClass("nav_active");
    $("#hamburger_menu").removeClass("nav_active");
    $("#hamburger_menu span:nth-child(1)").css("transform", "rotate( 0deg )");
    $("#hamburger_menu span:nth-child(2)").css("opacity", "1");
    $("#hamburger_menu span:nth-child(3)").css("transform", "rotate( 0deg )");
    $("#nav_content > *").css("opacity", "0");
    clearTimeout(navLinksAnimation);
    setTimeout(function () {
      $("#nav_content").css("visibility", "hidden");
    }, 400);
  } else {
    $("#nav_content").css("visibility", "visible");
    $("#nav_content").addClass("nav_active");
    $("#hamburger_menu").addClass("nav_active");
    $("#hamburger_menu span:nth-child(1)").css("transform", "rotate( 45deg )");
    $("#hamburger_menu span:nth-child(2)").css("opacity", "0");
    $("#hamburger_menu span:nth-child(3)").css("transform", "rotate( -45deg )");
    var navLinksAnimation = setTimeout(() => {
      $("#nav_content > *").css("opacity", "1");
    }, 200);
  }
});

// Fade in animation
$("a").click(function (e) {
  if (!$(this).hasClass("bypass_link")) {
    e.preventDefault();
    $("#transition").fadeIn(400, () => {
      window.location = this.href;
    });
  }
});

// Reviews scroll
var reviews;
let randomNumber = -1;

$.ajax({
  url: "texts/reviews.json",
  dataType: "json",
  async: false,
  dataType: "json",
  success: function (result) {
    reviews = result;
  },
});

switchReview();
setInterval(() => {
  if ($("#nav_content").hasClass("nav_active")) {
    switchReview();
  }
}, 4000);

function switchReview() {
  oldNumber = randomNumber;
  randomNumber = Math.floor(Math.random() * reviews.length);
  if (randomNumber == oldNumber) {
    if (randomNumber + 1 == reviews.length) {
      randomNumber -= 1;
    } else {
      randomNumber += 1;
    }
  }

  $("#testimonials > *")
    .fadeOut(function () {
      $("#review_author").html("- " + reviews[randomNumber].author);
      $("#review_message").html("&#10077;" + reviews[randomNumber].review + "&#10078;");
    })
    .fadeIn();
}
