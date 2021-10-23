<?php
if(isSet($_POST['status']) && $_POST['status'] == 'submit'){
    $accessid = filter_var($_POST['accessid'], FILTER_SANITIZE_EMAIL);
    if ($accessid != "") {
        if ($accessid == fgets(fopen("password", "r"))) {
            echo "admin";
        } else if (file_exists('data/'.$accessid)) {
            echo "true";
        } else {
            echo "false";
        }
    } else {
        echo "logout";
    }
}
?>