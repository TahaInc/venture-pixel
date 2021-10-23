<?php
if(isSet($_POST['status']) && $_POST['status'] == 'submit'){
    $name=filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email=filter_var($_POST['email'], FILTER_SANITIZE_STRING);
    $phone=filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $location=filter_var($_POST['location'], FILTER_SANITIZE_STRING);
    $date=filter_var($_POST['date'], FILTER_SANITIZE_STRING);
    $time=filter_var($_POST['time'], FILTER_SANITIZE_STRING);
    $event=filter_var($_POST['event'], FILTER_SANITIZE_STRING);
    $comment=filter_var($_POST['comment'], FILTER_SANITIZE_STRING);
    $language=filter_var($_POST['language'], FILTER_SANITIZE_STRING);
    $plan=filter_var($_POST['plan'], FILTER_SANITIZE_STRING);
    $photoEditing=$_POST['photo_editing'];

    
    $language_data = json_decode(file_get_contents('texts/'.$language.'.json'), true);
    $pictures = $plan == 0 ? 15 : ($plan == 1 ? 20 : 35);
    $total = $language_data["photography_prices"]["packages"][$plan];
    $customMessage = $language_data["default_message"][0].strtolower($event).$language_data["default_message"][1];

    $subject = 'New booking';
    $message = "<Strong>Name:</Strong> ".$name."<br><Strong>Contact email:</Strong> ".$email."<br><Strong>Phone number:</Strong> ".$phone."<br><br><Strong>Location:</Strong> ".$location."<br><Strong>Date:</Strong> ".$date."<br><Strong>Time:</Strong> ".$time."<br><Strong>Pricing:</Strong> ".$total."<br><Strong>Edited:</Strong> ".($photoEditing == "true" ? "Yes" : "No")."<br><br><Strong>Other comments:</Strong><br>".$comment;

    mail('email@email.com', $subject, $message);

    
    do {
        $accessid = uniqid();
    } while (file_exists('data/'.$accessid));

    mkdir('data/'.$accessid, 0777, true);
    mkdir('data/'.$accessid.'/pictures/', 0777, true);
    mkdir('data/'.$accessid.'/preview/', 0777, true);

    $info = array("accessid" => $accessid, "Name" => $name, "Email" => $email, "Phone" => $phone, "Total" => $total, "Pictures" => $pictures, "Current_pictures" => 0, "Photo_editing" => $photoEditing, "Language" => $language, "Message" => $customMessage, "Event" => $event, "Location" => $location, "Date" => $date, "Time" => $time, "Comment" => $comment, "Status" => 1, "payment_type" => "", "cart" => "[]");

    $info_data = fopen('data/'.$accessid.'/info.json', 'w');
    fwrite($info_data, json_encode($info, JSON_FORCE_OBJECT));
    fclose($info_data);

    $index_data = file_get_contents('data/bookings.json');
    $index = json_decode($index_data, true);
    $index[$accessid] = array("Name" => $name, "Status" => 1);
    file_put_contents('data/bookings.json', json_encode($index));

    $text_data = json_decode(file_get_contents('texts/'.$language.'.json'), true);

    $subject = $text_data["booking_received"];
    $message = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <style> @font-face { font-family: Circular; src: url("../assets/CircularStd.ttf") format("truetype"), url("../assets/CircularStd.woff") format("woff"); } body { background-color: #d8d8d8; } h1 { font-family: "Circular"; color: #2d2d2d; } h2 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; } h3 { font-family: "Circular"; font-weight: lighter; font-size: 1em; color: #2d2d2d; width: 100%; text-align: center; } #main { position: relative; width: 500px; max-width: 80%; height: auto; padding: 50px 25px; margin: 100px auto; background-color: white; border-radius: 10px; box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.15); } #circle_logo { position: absolute; top: -40px; left: 30px; } #logo { width: 200px; display: block; margin: 40px auto; } </style> </head> <body> <div id="main"> <img id="circle_logo" src="assets/icons/circular_logo.png"> <h1>'.$text_data["booking_received"].'</h1><h2>'.$text_data["booking_processed"].$accessid.'</h2> </div> <img id="logo" src="assets/icons/logo.png"> <h3>© Copyright 2022 Venture Pixel</h3> </body> </html>';

    mail($email, $subject, $message);
    
    echo $accessid;
}
?>