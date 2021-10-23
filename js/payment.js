var stripe = Stripe("pk_test_51JKGF8EeG2pw9B8s4IQkWCQZvTQDSyDAMKhw05tcG4LpqHkJv3bFYC3Wb6cH8g20kbGTfAYfKnauBTCC010sc3Op00xvGKkDxn");
var elements = stripe.elements();

// Booking
function startBookingPayment() {
  var total = parseInt(information.Total) + parseInt(information.Photo_editing == "true" ? dictionary.photography_prices.addon[0] : 0);

  var paymentRequest = stripe.paymentRequest({
    country: "CA",
    currency: "cad",
    total: {
      label: "Venture Pixel",
      amount: total * 100,
    },
  });

  var card = elements.create("card", {
    hidePostalCode: true,
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: {
      paymentRequestButton: {
        theme: "dark",
        height: "64px",
      },
    },
  });

  $("#booking_total").html("$" + total);

  paymentRequest.canMakePayment().then(function (result) {
    if (result) {
      prButton.mount("#booking_payment_request_button");
      if (!result.applePay && !result.googlePay) {
        $("#booking_payment_request_button").css("filter", "grayscale() invert()");
      }
    } else {
      document.getElementById("booking_payment_request_button").style.display = "none";
      document.getElementById("booking_payment_seperator").style.display = "none";
    }
  });

  card.mount("#booking_card_form");

  card.addEventListener("change", ({ error }) => {
    const displayError = document.getElementById("booking_card_errors");
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = "";
    }
  });

  $("#transition").fadeOut(400);

  // Card
  $("#booking_checkout").click(function (e) {
    if ($("#booking_checkout").attr("data-language") != "processing") {
      $(window).bind("beforeunload", function () {
        return "";
      });

      $("#booking_checkout").attr("data-language", "processing");
      $("#booking_checkout").text(dictionary.processing);

      var result;

      $.ajax({
        type: "POST",
        url: "charge.php",
        dataType: "json",
        async: false,
        cache: false,
        data: {
          status: "booking_intent_request",
          accessid: accessid,
        },
        success: function (response) {
          result = response;
        },
      });

      stripe
        .confirmCardPayment(result.client_secret, {
          payment_method: {
            card: card,
            billing_details: {
              name: information.Name,
            },
          },
        })
        .then(function (response) {
          if (response.error) {
            $("#booking_card_errors").text(dictionary[response.error.code] || dictionary.processing_error);
            $("#booking_checkout").attr("data-language", "try_again");
            $("#booking_checkout").text(dictionary.try_again);
          } else {
            if (response.paymentIntent.status === "succeeded") {
              $("#booking_checkout").attr("data-language", "done");
              $("#booking_checkout").text(dictionary.done);

              $.ajax({
                type: "POST",
                url: "charge.php",
                async: false,
                cache: false,
                data: {
                  status: "booking_payment_complete",
                  client_id: result.id,
                  accessid: accessid,
                },
                success: function (response) {
                  if (response != "error") {
                    $(window).off("beforeunload");
                    location.reload();
                  }
                },
              });
            }
          }

          $(window).off("beforeunload");
        });
    }
  });

  // Apple Pay, Google Pay, etc
  paymentRequest.on("paymentmethod", async (e) => {
    var result;

    $.ajax({
      type: "POST",
      url: "charge.php",
      dataType: "json",
      async: false,
      cache: false,
      data: {
        status: "booking_intent_request",
        accessid: accessid,
      },
      success: function (response) {
        result = response;
      },
    });

    let { error, paymentIntent } = await stripe.confirmCardPayment(
      result.client_secret,
      {
        payment_method: e.paymentMethod.id,
      },
      {
        handleActions: false,
      }
    );

    if (error) {
      e.complete("fail");
      alert(error);
      return;
    }

    e.complete("success");

    if (paymentIntent.status === "requires_action") {
      let { error, paymentIntent } = await stripe.confirmCardPayment(result.client_secret);
      if (error) {
        alert(error);
        return;
      }
    }

    $.ajax({
      type: "POST",
      url: "charge.php",
      async: false,
      cache: false,
      data: {
        status: "booking_payment_complete",
        client_id: result.id,
        accessid: accessid,
      },
      success: function (response) {
        if (response != "error") {
          $(window).off("beforeunload");
          location.reload();
        }
      },
    });

    $(window).off("beforeunload");
  });
}

// Editing
function startEditingPayment() {
  var total = parseInt(dictionary.photography_prices.addon[0]);

  var paymentRequest = stripe.paymentRequest({
    country: "CA",
    currency: "cad",
    total: {
      label: "Venture Pixel",
      amount: total * 100,
    },
  });

  var card = elements.create("card", {
    hidePostalCode: true,
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: {
      paymentRequestButton: {
        theme: "dark",
        height: "64px",
      },
    },
  });

  paymentRequest.canMakePayment().then(function (result) {
    if (result) {
      prButton.mount("#editing_payment_request_button");
      if (!result.applePay && !result.googlePay) {
        $("#editing_payment_request_button").css("filter", "grayscale() invert()");
      }
    } else {
      document.getElementById("editing_payment_request_button").style.display = "none";
      document.getElementById("editing_payment_seperator").style.display = "none";
    }
  });

  card.mount("#editing_card_form");

  card.addEventListener("change", ({ error }) => {
    const displayError = document.getElementById("editing_card_errors");
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = "";
    }
  });

  $("#transition").fadeOut(400);

  // Card
  $("#editing_checkout").click(function (e) {
    if ($("#editing_checkout").attr("data-language") != "processing") {
      $(window).bind("beforeunload", function () {
        return "";
      });

      $("#editing_checkout").attr("data-language", "processing");
      $("#editing_checkout").text(dictionary.processing);

      var result;

      $.ajax({
        type: "POST",
        url: "charge.php",
        dataType: "json",
        async: false,
        cache: false,
        data: {
          status: "editing_intent_request",
          accessid: accessid,
        },
        success: function (response) {
          result = response;
        },
      });

      stripe
        .confirmCardPayment(result.client_secret, {
          payment_method: {
            card: card,
            billing_details: {
              name: information.Name,
            },
          },
        })
        .then(function (response) {
          if (response.error) {
            $("#editing_card_errors").text(dictionary[response.error.code] || dictionary.processing_error);
            $("#editing_checkout").attr("data-language", "try_again");
            $("#editing_checkout").text(dictionary.try_again);
          } else {
            if (response.paymentIntent.status === "succeeded") {
              $("#editing_checkout").attr("data-language", "done");
              $("#editing_checkout").text(dictionary.done);

              $.ajax({
                type: "POST",
                url: "charge.php",
                async: false,
                cache: false,
                data: {
                  status: "editing_payment_complete",
                  client_id: result.id,
                  accessid: accessid,
                },
                success: function (response) {
                  if (response != "error") {
                    $(window).off("beforeunload");
                    location.reload();
                  }
                },
              });
            }
          }

          $(window).off("beforeunload");
        });
    }
  });

  // Apple Pay, Google Pay, etc
  paymentRequest.on("paymentmethod", async (e) => {
    var result;

    $.ajax({
      type: "POST",
      url: "charge.php",
      dataType: "json",
      async: false,
      cache: false,
      data: {
        status: "editing_intent_request",
        accessid: accessid,
      },
      success: function (response) {
        result = response;
      },
    });

    let { error, paymentIntent } = await stripe.confirmCardPayment(
      result.client_secret,
      {
        payment_method: e.paymentMethod.id,
      },
      {
        handleActions: false,
      }
    );

    if (error) {
      e.complete("fail");
      alert(error);
      return;
    }

    e.complete("success");

    if (paymentIntent.status === "requires_action") {
      let { error, paymentIntent } = await stripe.confirmCardPayment(result.client_secret);
      if (error) {
        alert(error);
        return;
      }
    }

    $.ajax({
      type: "POST",
      url: "charge.php",
      async: false,
      cache: false,
      data: {
        status: "editing_payment_complete",
        client_id: result.id,
        accessid: accessid,
      },
      success: function (response) {
        if (response != "error") {
          $(window).off("beforeunload");
          location.reload();
        }
      },
    });

    $(window).off("beforeunload");
  });
}

// Cart
function startCartPayment() {
  var paymentRequest = stripe.paymentRequest({
    country: "CA",
    currency: "cad",
    requestShipping: true,
    total: {
      label: "Venture Pixel",
      amount: 0,
    },
    shippingOptions: [
      {
        id: "free-shipping",
        label: dictionary.shipping_label,
        detail: dictionary.shipping_detail,
        amount: 0,
      },
    ],
  });

  var card = elements.create("card", {
    hidePostalCode: true,
  });

  $("#show_checkout").click(function () {
    var price = cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0);
    if ($(this).attr("data-language") == "checkout" && price > 0) {
      paymentRequest.update({
        total: {
          label: "Venture Pixel",
          amount: cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) * 100,
        },
        shippingOptions: [
          {
            id: "free-shipping",
            label: dictionary.shipping_label,
            detail: dictionary.shipping_detail,
            amount: 0,
          },
        ],
      });
    }
  });

  const prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: {
      paymentRequestButton: {
        theme: "dark",
        height: "64px",
      },
    },
  });

  paymentRequest.canMakePayment().then(function (result) {
    if (result) {
      if (result.applePay) {
        $('[data-payment-selection="applepay"] > .payment_option_text').html("&#63743;Pay");
      } else if (result.googlePay) {
        $('[data-payment-selection="applepay"] > .payment_option_text').html('<img src="assets/icons/google-logo.png" id="google_icon"> Pay');
      } else {
        $('[data-payment-selection="applepay"] > .payment_option_text').html('<img src="assets/icons/lightning.png" id="google_icon"> <span data-language="checkout">Checkout</span>');
        $("#cart_payment_request_button").css("filter", "grayscale() invert()");
      }
      prButton.mount("#cart_payment_request_button");
    } else {
      document.getElementById("cart_payment_request_button").style.display = "none";
      $('[data-payment-selection="applepay"]').remove();
    }
  });

  card.mount("#cart_card_form");

  card.addEventListener("change", ({ error }) => {
    const displayError = document.getElementById("cart_card_errors");
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = "";
    }
  });

  // E-transfer
  $("#order_etransfer").click(function () {
    if ($("#address_etransfer").val() != "") {
      $.ajax({
        type: "POST",
        url: "charge.php",
        async: false,
        cache: false,
        data: {
          status: "cart_payment_complete",
          payment_type: "e-transfer",
          name: information.Name,
          email: information.Email,
          accessid: accessid,
          address: $("#address_etransfer").val(),
          cart: cart,
        },
        success: function (response) {
          if (response != "error") {
            scroll.start();
            $(".booking_msg:nth-child(2)").attr("data-language", "expect_shipping_etransfer");
            $(".booking_msg:nth-child(2)").html(dictionary.expect_shipping_etransfer);
            $("#order_id").html("#" + response);
            $("#msg_card").animate({ top: "100px" }, 300);
            $("#msg_card_bg").fadeIn(200);
            $(".c-scrollbar").animate({ opacity: 1 }, 300);
            $("#cart_content").removeClass("cart_active");
            $("#cart_content_backdrop").css("pointer-events", "none");
            $("#cart_content_backdrop").fadeOut(300);
            $("#show_checkout").attr("data-language", "checkout");
            $("#show_checkout").html(dictionary.checkout);
            $("#cart_items_list, #cart_total").removeClass("checkout_menu");
            $("#cart_total.checkout_menu").removeClass("quick_checkout_menu");
            $("#cart_total.checkout_menu").removeClass("cash_checkout_menu");
            $(".hidden_checkout").fadeOut(200);
            cart = [];
            setCart(cart, accessid);
            $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
            $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
            ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
          }
        },
      });
    } else {
      $("#etransfer_error").text(dictionary.address_missing);
    }
  });

  // Cash
  $("#order_cash").click(function () {
    if ($("#address_cash").val() != "") {
      $.ajax({
        type: "POST",
        url: "charge.php",
        async: false,
        cache: false,
        data: {
          status: "cart_payment_complete",
          payment_type: "cash",
          name: information.Name,
          email: information.Email,
          accessid: accessid,
          address: $("#address_cash").val(),
          cart: cart,
        },
        success: function (response) {
          if (response != "error") {
            scroll.start();
            $(".booking_msg:nth-child(2)").attr("data-language", "expect_shipping_etransfer");
            $(".booking_msg:nth-child(2)").html(dictionary.expect_shipping_etransfer);
            $("#order_id").html("#" + response);
            $("#msg_card").animate({ top: "100px" }, 300);
            $("#msg_card_bg").fadeIn(200);
            $(".c-scrollbar").animate({ opacity: 1 }, 300);
            $("#cart_content").removeClass("cart_active");
            $("#cart_content_backdrop").css("pointer-events", "none");
            $("#cart_content_backdrop").fadeOut(300);
            $("#show_checkout").attr("data-language", "checkout");
            $("#show_checkout").html(dictionary.checkout);
            $("#cart_items_list, #cart_total").removeClass("checkout_menu");
            $("#cart_total.checkout_menu").removeClass("quick_checkout_menu");
            $("#cart_total.checkout_menu").removeClass("cash_checkout_menu");
            $(".hidden_checkout").fadeOut(200);
            cart = [];
            setCart(cart, accessid);
            $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
            $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
            ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
          }
        },
      });
    } else {
      $("#cash_error").text(dictionary.address_missing);
    }
  });

  // Card
  $("#cart_checkout").click(function (e) {
    if ($("#address_card").val() != "") {
      if ($("#cart_checkout").attr("data-language") != "processing") {
        $(window).bind("beforeunload", function () {
          return "";
        });

        $("#cart_checkout").attr("data-language", "processing");
        $("#cart_checkout").text(dictionary.processing);

        var result;

        $.ajax({
          type: "POST",
          url: "charge.php",
          dataType: "json",
          async: false,
          cache: false,
          data: {
            status: "cart_intent_request",
            cart: cart,
          },
          success: function (response) {
            result = response;
          },
        });

        stripe
          .confirmCardPayment(result.client_secret, {
            payment_method: {
              card: card,
              billing_details: {
                name: information.Name,
              },
            },
          })
          .then(function (response) {
            if (response.error) {
              $("#cart_card_errors").text(dictionary[response.error.code] || dictionary.processing_error);
              $("#cart_checkout").attr("data-language", "try_again");
              $("#cart_checkout").text(dictionary.try_again);
            } else {
              if (response.paymentIntent.status === "succeeded") {
                $("#cart_checkout").attr("data-language", "done");
                $("#cart_checkout").text(dictionary.done);

                $.ajax({
                  type: "POST",
                  url: "charge.php",
                  async: false,
                  cache: false,
                  data: {
                    status: "cart_payment_complete",
                    payment_type: "card",
                    client_id: result.id,
                    name: information.Name,
                    email: information.Email,
                    accessid: accessid,
                    address: $("#address_card").val(),
                    cart: cart,
                  },
                  success: function (response) {
                    if (response != "error") {
                      scroll.start();
                      $("#order_id").html("#" + response);
                      $("#msg_card").animate({ top: "100px" }, 300);
                      $("#msg_card_bg").fadeIn(200);
                      $(".c-scrollbar").animate({ opacity: 1 }, 300);
                      $("#cart_content").removeClass("cart_active");
                      $("#cart_content_backdrop").css("pointer-events", "none");
                      $("#cart_content_backdrop").fadeOut(300);
                      $("#show_checkout").attr("data-language", "checkout");
                      $("#show_checkout").html(dictionary.checkout);
                      $("#cart_items_list, #cart_total").removeClass("checkout_menu");
                      $("#cart_total.checkout_menu").removeClass("quick_checkout_menu");
                      $("#cart_total.checkout_menu").removeClass("cash_checkout_menu");
                      $(".hidden_checkout").fadeOut(200);
                      cart = [];
                      setCart(cart, accessid);
                      $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
                      $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
                      ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
                    }
                  },
                });
              }
            }

            $(window).off("beforeunload");
          });
      }
    } else {
      $("#cart_card_errors").text(dictionary.address_missing);
    }
  });

  // Apple Pay, Google Pay, etc
  paymentRequest.on("paymentmethod", async (e) => {
    var result;

    $.ajax({
      type: "POST",
      url: "charge.php",
      dataType: "json",
      async: false,
      cache: false,
      data: {
        status: "cart_intent_request",
        cart: cart,
      },
      success: function (response) {
        result = response;
      },
    });

    let { error, paymentIntent } = await stripe.confirmCardPayment(
      result.client_secret,
      {
        payment_method: e.paymentMethod.id,
      },
      {
        handleActions: false,
      }
    );

    if (error) {
      e.complete("fail");
      alert(error);
      return;
    }

    e.complete("success");

    if (paymentIntent.status === "requires_action") {
      let { error, paymentIntent } = await stripe.confirmCardPayment(result.client_secret);
      if (error) {
        alert(error);
        return;
      }
    }

    $.ajax({
      type: "POST",
      url: "charge.php",
      async: false,
      cache: false,
      data: {
        status: "cart_payment_complete",
        payment_type: "card",
        client_id: result.id,
        name: information.Name,
        email: information.Email,
        accessid: accessid,
        address: e.shippingAddress.addressLine + ", " + e.shippingAddress.city + ", " + e.shippingAddress.postalCode,
        cart: cart,
      },
      success: function (response) {
        if (response != "error") {
          scroll.start();
          $("#order_id").html("#" + response);
          $("#msg_card").animate({ top: "100px" }, 300);
          $("#msg_card_bg").fadeIn(200);
          $(".c-scrollbar").animate({ opacity: 1 }, 300);
          $("#cart_content").removeClass("cart_active");
          $("#cart_content_backdrop").css("pointer-events", "none");
          $("#cart_content_backdrop").fadeOut(300);
          $("#show_checkout").attr("data-language", "checkout");
          $("#show_checkout").html(dictionary.checkout);
          $("#cart_items_list, #cart_total").removeClass("checkout_menu");
          $("#cart_total.checkout_menu").removeClass("quick_checkout_menu");
          $("#cart_total.checkout_menu").removeClass("cash_checkout_menu");
          $(".hidden_checkout").fadeOut(200);
          cart = [];
          setCart(cart, accessid);
          $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
          $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
          ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
        }
      },
    });

    $(window).off("beforeunload");
  });
}

$("#msg_card_bg").click(function () {
  $("#msg_card").animate({ top: "-400px" }, 600);
  $("#msg_card_bg").fadeOut(300);
});
