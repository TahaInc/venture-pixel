var language = localStorage.getItem("language") ?? "en";
var dictionary;

refreshLanguage();

$("#en_selector").click(function () {
  if (language != "en") {
    language = "en";
    localStorage.setItem("language", language);
    refreshLanguage();
  }
});

$("#fr_selector").click(function () {
  if (language != "fr") {
    language = "fr";
    localStorage.setItem("language", language);
    refreshLanguage();
  }
});

$("#sp_selector").click(function () {
  if (language != "sp") {
    language = "sp";
    localStorage.setItem("language", language);
    refreshLanguage();
  }
});

function refreshLanguage() {
  $.ajax({
    url: "texts/" + language + ".json",
    dataType: "json",
    async: false,
    dataType: "json",
    success: function (dict) {
      dictionary = dict;
    },
  });

  $(".language_selector").css("text-decoration", "none");
  $("#" + language + "_selector").css("text-decoration", "underline");

  // Nav & footer
  $('[data-language="home"]').html(dictionary.home);
  $('[data-language="services"]').html(dictionary.services);
  $('[data-language="login"]').html(dictionary.login);
  $('[data-language="pricing"]').html(dictionary.pricing);
  $('[data-language="booking"]').html(dictionary.booking);
  $('[data-language="copyright"]').html(dictionary.copyright);
  document.title = "Venture Pixel" + (dictionary[$("meta[name=keywords]").attr("content")] ? " - " + dictionary[$("meta[name=keywords]").attr("content")] : "");

  //Prices
  /*
  $('[data-language="base_price"]').html(dictionary.photography_prices.packages[0]);
  $('[data-language="mid_price"]').html(dictionary.photography_prices.packages[1]);
  $('[data-language="pro_price"]').html(dictionary.photography_prices.packages[2]);
  $('[data-language="photo_editing_price"]').html(dictionary.photography_prices.addon[0]);
  $('[data-language="digital_release_price"]').html(dictionary.photography_prices.addon[1]);
  $('[data-language="4x6"]').html(dictionary.photography_prices.printing[0]);
  $('[data-language="5x7"]').html(dictionary.photography_prices.printing[1]);
  $('[data-language="8x10"]').html(dictionary.photography_prices.printing[2]);
  $('[data-language="8.5x11"]').html(dictionary.photography_prices.printing[3]);
  */

  // Home page
  $('[data-language="business_slogan"]').html(dictionary.business_slogan);
  $('[data-language="business_desc"]').html(dictionary.business_desc);

  // Pricing page
  $('[data-language="photography_packages"]').html(dictionary.photography_packages);
  $('[data-language="one_hour_session"]').html(dictionary.one_hour_session);
  $('[data-language="one_and_half_hour_session"]').html(dictionary.one_and_half_hour_session);
  $('[data-language="two_hour_session"]').html(dictionary.two_hour_session);
  $('[data-language="one_location"]').html(dictionary.one_location);
  $('[data-language="two_location"]').html(dictionary.two_location);
  $('[data-language="multi_location"]').html(dictionary.multi_location);
  $('[data-language="fifteen_professionally_edited_photos"]').html(dictionary.fifteen_professionally_edited_photos);
  $('[data-language="twenty_professionally_edited_photos"]').html(dictionary.twenty_professionally_edited_photos);
  $('[data-language="thirty_five_professionally_edited_photos"]').html(dictionary.thirty_five_professionally_edited_photos);
  $('[data-language="print_release"]').html(dictionary.print_release);
  $('[data-language="print_release_desc"]').html(dictionary.print_release_desc);
  $('[data-language="booking_process_step_one"]').html("&ensp;" + dictionary.booking_process_step_one);
  $('[data-language="booking_process_step_two"]').html("&ensp;" + dictionary.booking_process_step_two);
  $('[data-language="booking_process_step_three"]').html("&ensp;" + dictionary.booking_process_step_three);
  $('[data-language="booking_process_step_four"]').html("&ensp;" + dictionary.booking_process_step_four);
  $('[data-language="book_now"]').html(dictionary.book_now);

  //Booking
  $('[data-language="book_your_shoot"]').html(dictionary.book_your_shoot);
  $('[data-language="contact_information"]').html(dictionary.contact_information);
  $('[data-language="photoshoot_information"]').html(dictionary.photoshoot_information);
  $('[data-language="pricing_information"]').html(dictionary.pricing_information);
  $('[data-language="booking_name"]').html(dictionary.booking_name);
  $('[data-language="booking_email"]').html(dictionary.booking_email);
  $('[data-language="booking_phone"]').html(dictionary.booking_phone);
  $('[data-language="booking_location"]').html(dictionary.booking_location);
  $('[data-language="time_place"]').html(dictionary.time_place);
  $('[data-language="event_type"]').html(dictionary.event_type);
  $('[data-language="one_hour"]').html(dictionary.one_hour);
  $('[data-language="one_and_half_hour"]').html(dictionary.one_and_half_hour);
  $('[data-language="two_hour"]').html(dictionary.two_hour);
  $('[data-language="fifteen_pictures"]').html(dictionary.fifteen_pictures);
  $('[data-language="twenty_pictures"]').html(dictionary.twenty_pictures);
  $('[data-language="thirty_five_pictures"]').html(dictionary.thirty_five_pictures);
  $('[data-language="error_occured"]').html(dictionary.error_occured);
  $('[data-language="error"]').html(dictionary.error);
  $('[data-language="booking_received"]').html(dictionary.booking_received);
  $('[data-language="expect_email"]').html(dictionary.expect_email);
  $('[data-language="your_access_code"]').html(dictionary.your_access_code);

  // Login
  $('[data-language="error_empty_field"]').html(dictionary.error_empty_field);
  $('[data-language="error_invalid_access_code"]').html(dictionary.error_invalid_access_code);

  // View
  $('[data-language="booking_not_confirmed"]').html(dictionary.booking_not_confirmed);
  $('[data-language="pictures_not_ready"]').html(dictionary.pictures_not_ready);
  $('[data-language="get_ready_for_booking"]').html(dictionary.get_ready_for_booking);
  $('[data-language="awaiting_payment"]').html(dictionary.awaiting_payment);
  $('[data-language="almost_done"]').html(dictionary.almost_done);
  $('[data-language="expect_answer_soon"]').html(dictionary.expect_answer_soon);
  $('[data-language="see_you_soon"]').html(dictionary.see_you_soon);
  $('[data-language="wait_for_pictures"]').html(dictionary.wait_for_pictures);
  $('[data-language="print_release_only"]').html(dictionary.print_release_only);
  $('[data-language="buy_prints"]').html(dictionary.buy_prints);
  $('[data-language="pick_size"]').html(dictionary.pick_size);
  $('[data-language="add_order"]').html(dictionary.add_order);
  $('[data-language="add_again"]').html(dictionary.add_again);
  $('[data-language="free"]').html(dictionary.free);
  $('[data-language="download"]').html(dictionary.download);
  $('[data-language="greeting"]').html(dictionary.greeting);
  $('[data-language="package_info"]').html(dictionary.package_info);
  $('[data-language="pictures"]').html(dictionary.pictures);
  $('[data-language="release"]').html(dictionary.release);
  $('[data-language="editing"]').html(dictionary.editing);
  $('[data-language="access_id"]').html(dictionary.access_id);
  $('[data-language="your_order"]').html(dictionary.your_order);
  $('[data-language="size"]').html(dictionary.size);
  $('[data-language="total"]').html(dictionary.total);
  $('[data-language="address"]').html(dictionary.address);
  $('[data-language="checkout"]').html(dictionary.checkout);
  $('[data-language="order"]').html(dictionary.order);
  $('[data-language="processing"]').html(dictionary.processing);
  $('[data-language="try_again"]').html(dictionary.try_again);
  $('[data-language="done"]').html(dictionary.done);
  $('[data-language="go_back"]').html(dictionary.go_back);
  $('[data-language="select_payment_option"]').html(dictionary.select_payment_option);
  $('[data-language="card"]').html(dictionary.card);
  $('[data-language="cash"]').html(dictionary.cash);
  $('[data-language="or"]').html(dictionary.or);
  $('[data-language="security_message"]').html(dictionary.security_message);
  $('[data-language="etransfer_desc"]').html(dictionary.etransfer_desc);
  $('[data-language="logout"]').html(dictionary.logout);
  $('[data-language="order_received"]').html(dictionary.order_received);
  $('[data-language="expect_shipping"]').html(dictionary.expect_shipping);
  $('[data-language="expect_shipping_etransfer"]').html(dictionary.expect_shipping_etransfer);
  $('[data-language="cash_cheque_desc"]').html(dictionary.cash_cheque_desc);
  $('[data-language="your_total_is"]').html(dictionary.your_total_is);
  $('[data-language="your_order_id"]').html(dictionary.your_order_id);
  $('[data-language="photo_editing_price"]').html(dictionary.photography_prices.addon[0]);
  $('[data-language="editing_title"]').html(dictionary.editing_title);
  $('[data-language="editing_subtitle"]').html(dictionary.editing_subtitle);
  $('[data-language="get_pictures_now"]').html(dictionary.get_pictures_now);
  $('[data-language="add_editing"]').html(dictionary.add_editing);

  try {
    scroll.update();
  } catch {}

  try {
    $("#comment_input")[0].placeholder = dictionary.comment_input;
    $("#event")[0].placeholder = dictionary.event_input;
  } catch {}
}
