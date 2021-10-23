<?php

$data = json_decode(file_get_contents("php://input"));

if ($data->type === "booking.created") {
    
    $text_data = json_decode(file_get_contents('texts/'.$language.'.json'), true);
    
    // TODO
    $id = $data->data->object->booking->customer_id;
    $plan = ($data->data->object->booking->appointment_segments->service_variation_id == "" ? 0 : ($data->data->object->booking->appointment_segments->service_variation_id == "KMDGTRR7Q7UL2GKTQC6GHIFW" ? 1 : 2)); // GET IDs
    $total = $text_data["photography_prices"]["packages"][$plan];
    $pictures = $plan == 0 ? 15 : ($plan == 1 ? 20 : 35);
    $location = "";
    $date = "";
    $time = "";
    $comment = $data->data->object->booking->customer_note;
    $customMessage = $language_data["default_message"][0].$language_data["default_message"][1];
    
    $language = "en";
    $event = "";
    
    
    $url = "https://connect.squareup.com/v2/customers/".$id;
    
    $curl = curl_init($url);
    
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    $headers = array(
       "Square-Version: 2021-10-20",
       "Authorization: Bearer ".fgets(fopen("square", "r")),
       "Content-Type: application/json",
    );
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    
    $resp = json_decode(curl_exec($curl));
    curl_close($curl);
    
    $name = $resp->customer->given_name." ".$resp->customer->family_name;
    $email = $resp->customer->email_address;
    $phone = $resp->customer->phone_number;
    
    do {
        $accessid = uniqid();
    } while (file_exists('data/'.$accessid));
    
    mkdir('data/'.$accessid, 0777, true);
    mkdir('data/'.$accessid.'/pictures/', 0777, true);
    mkdir('data/'.$accessid.'/preview/', 0777, true);
    
    $info = array("accessid" => $accessid, "Name" => $name, "Email" => $email, "Phone" => $phone, "Total" => $total, "Pictures" => $pictures, "Current_pictures" => 0, "Photo_editing" => false, "Language" => $language, "Message" => $customMessage, "Event" => $event, "Location" => $location, "Date" => $date, "Time" => $time, "Comment" => $comment, "Status" => 1, "payment_type" => "", "cart" => "[]");
    
    $info_data = fopen('data/'.$accessid.'/info.json', 'w');
    fwrite($info_data, json_encode($info, JSON_FORCE_OBJECT));
    fclose($info_data);
    
    $index_data = file_get_contents('data/bookings.json');
    $index = json_decode($index_data, true);
    $index[$accessid] = array("Name" => $name, "Status" => 1);
    file_put_contents('data/bookings.json', json_encode($index));
    
    $subject = $text_data["booking_received"];
    $message = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <style> @font-face { font-family: Circular; src: url("../assets/CircularStd.ttf") format("truetype"), url("../assets/CircularStd.woff") format("woff"); } body { background-color: #d8d8d8; } h1 { font-family: "Circular"; color: #2d2d2d; } h2 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; } h3 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; width: 100%; text-align: center; } #main { position: relative; width: 500px; max-width: 80%; height: auto; padding: 50px 25px; margin: 100px auto; background-color: white; border-radius: 10px; box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.15); } #circle_logo { position: absolute; top: -40px; left: 30px; } #logo { width: 200px; display: block; margin: 40px auto; } </style> </head> <body> <div id="main"> <img id="circle_logo" src="assets/icons/circular_logo.png"> <h1>'.$text_data["booking_received"].'</h1><h2>'.$text_data["booking_processed"].$accessid.'</h2> </div> <img id="logo" src="assets/icons/logo.png"> <h3>© Copyright 2022 Venture Pixel</h3> </body> </html>';
    
    mail($email, $subject, $message);
}

?>

