<?php
    $status = $_POST["status"];

    if ($status == "update_payment_option") {
        $option = $_POST["option"];
        $accessid = $_POST["accessid"];

        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["payment_type"] = $option;
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));
    } else if ($status == "update_cart") {
        $cart = $_POST["cart"] ?? [];
        $accessid = $_POST["accessid"];

        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["cart"] = json_encode($cart);
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo $cart;
    } else if ($status == "get_cart") {
        $accessid = $_POST["accessid"];

        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);

        echo json_encode($index["cart"]);
    } else if ($status == "update_cart") {
        $cart = $_POST["cart"] ?? [];
        $accessid = $_POST["accessid"];

        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["cart"] = json_encode($cart);
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo $cart;
    } else if (isSet($_POST['status']) && $_POST['status'] == 'no_editing') {
        $accessid = filter_var($_POST['accessid'], FILTER_SANITIZE_STRING);
        
        $index_data = file_get_contents('data/bookings.json');
        $index = json_decode($index_data, true);
        $index[$accessid]["Status"] = 6;
        file_put_contents('data/bookings.json', json_encode($index));
        
        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["Status"] = 6;
        $index["Photo_editing"] = "false";
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo "success";
    } else if (isSet($_POST['status']) && $_POST['status'] == 'etransfer_editing') {
        $accessid = filter_var($_POST['accessid'], FILTER_SANITIZE_STRING);
        
        $index_data = file_get_contents('data/'.$accessid.'/info.json');
        $index = json_decode($index_data, true);
        $index["Photo_editing"] = "true";
        file_put_contents('data/'.$accessid.'/info.json', json_encode($index));

        echo "success";
    }

?>