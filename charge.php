<?php
    include('lib/stripe-php-7.92.0/init.php');

    \Stripe\Stripe::setApiKey(fgets(fopen("stripe-key", "r")));

    $status = $_POST["status"];

    if ($status == "cart_intent_request") {
      $cart = $_POST["cart"];

      $total = 0;
      $price_data = json_decode(file_get_contents('texts/en.json'), true);

      foreach ($cart as &$value) {
        if ($value["size"] == "4x6") {
          $total += $price_data["photography_prices"]["printing"][0] * $value["quantity"];
        } else if ($value["size"] == "5x7") {
          $total += $price_data["photography_prices"]["printing"][1] * $value["quantity"];
        } else if ($value["size"] == "8x10") {
          $total += $price_data["photography_prices"]["printing"][2] * $value["quantity"];
        } else if ($value["size"] == "8.5x11") {
          $total += $price_data["photography_prices"]["printing"][3] * $value["quantity"];
        }
      }

      $intent = \Stripe\PaymentIntent::create([
        'amount' => $total * 100,
        'currency' => 'cad',
      ]);
  
      echo json_encode($intent);
    } else if ($status == "booking_intent_request") {
      $accessid = $_POST["accessid"];

      $price_data = json_decode(file_get_contents('texts/en.json'), true);
      $booking_data = json_decode(file_get_contents('data/'.$accessid.'/info.json'), true);

      $total = floatval($booking_data["Total"]);
      $total += ($booking_data["Photo_editing"] == "true" ? $price_data["photography_prices"]["addon"][0] : 0);

      $intent = \Stripe\PaymentIntent::create([
        'amount' => $total * 100,
        'currency' => 'cad',
      ]);
  
      echo json_encode($intent);
    } else if ($status == "editing_intent_request") {
      $accessid = $_POST["accessid"];

      $price_data = json_decode(file_get_contents('texts/en.json'), true);
      $booking_data = json_decode(file_get_contents('data/'.$accessid.'/info.json'), true);

      $total = floatval($price_data["photography_prices"]["addon"][0]);

      $intent = \Stripe\PaymentIntent::create([
        'amount' => $total * 100,
        'currency' => 'cad',
      ]);
  
      echo json_encode($intent);
    } else if ($status == "cart_payment_complete"){
      $name = $_POST["name"];
      $email = $_POST["email"];
      $address = $_POST["address"];
      $accessid = $_POST["accessid"];
      $payment_type = $_POST["payment_type"];
      $cart = $_POST["cart"];
      
      if ($payment_type == "card" && $status == "cart_payment_complete") {
        $clientid = $_POST["client_id"];
        $intent = \Stripe\PaymentIntent::retrieve($clientid);
      }

      $total = 0;
      foreach ($cart as &$value) {
        $total += floatval($value["price"]) * $value["quantity"];
      }

      if ($payment_type != "card" || ($intent -> status == "succeeded" && $intent -> amount == $total * 100)) {
        $order_data = file_get_contents('data/order.json');
        $order = json_decode($order_data, true);

        do {
          $order_number = abs(crc32(uniqid()));
        } while (array_key_exists($order_number, $order));

        $order[$order_number] = array("access_id" => $accessid, "name" => $name, "email" => $email, "address" => $address, "cart" => $cart, "paid" => ($payment_type == "card" ? true : false), "payment_type" => $payment_type, "new" => true);
        file_put_contents('data/order.json', json_encode($order));
        
        $text_data = json_decode(file_get_contents('texts/'.$language.'.json'), true);

        $subject = $text_data["order_sent"];
        $message = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <style> @font-face { font-family: Circular; src: url("../assets/CircularStd.ttf") format("truetype"), url("../assets/CircularStd.woff") format("woff"); } body { background-color: #d8d8d8; } h1 { font-family: "Circular"; color: #2d2d2d; } h2 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; } h3 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; width: 100%; text-align: center; } #main { position: relative; width: 500px; max-width: 80%; height: auto; padding: 50px 25px; margin: 100px auto; background-color: white; border-radius: 10px; box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.15); } #circle_logo { position: absolute; top: -40px; left: 30px; } #logo { width: 200px; display: block; margin: 40px auto; } </style> </head> <body> <div id="main"> <img id="circle_logo" src="assets/icons/circular_logo.png"> <h1>'.$text_data["order_sent"].'</h1><h2>'.$text_data["expect_shipping"].'</h2> </div> <img id="logo" src="assets/icons/logo.png"> <h3>© Copyright 2022 Venture Pixel</h3> </body> </html>';
    
        mail($email, $subject, $message);


        echo $order_number;

      } else if ($intent -> amount != $total * 100) {
        echo "error";
      }
    } else if ($status == "booking_payment_complete"){
      $accessid = $_POST["accessid"];
      $clientid = $_POST["client_id"];
      
      $intent = \Stripe\PaymentIntent::retrieve($clientid);

      if ($intent -> status == "succeeded") {
        
        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["Status"] = 3;
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo "success";
      } else {
        echo "error";
      }
    } else if ($status == "editing_payment_complete"){
      $accessid = $_POST["accessid"];
      $clientid = $_POST["client_id"];
      
      $intent = \Stripe\PaymentIntent::retrieve($clientid);

      if ($intent -> status == "succeeded") {
        
        $index_data = file_get_contents('data/bookings.json');
        $index = json_decode($index_data, true);
        $index[$accessid]["Status"] = 5;
        file_put_contents('data/bookings.json', json_encode($index));
        
        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["Status"] = 5;
        $index["Photo_editing"] = "true";
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo "success";
      } else {
        echo "error";
      }
    }

?>