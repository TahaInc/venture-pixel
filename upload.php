<?php
$index_data = file_get_contents('data/'.key($_FILES).'/info.json');
$index = json_decode($index_data, true);

for($i = 0; $i < count($_FILES[key($_FILES)]['name']); $i++){
    if(isset($_FILES[key($_FILES)]['name'][$i]) && $_FILES[key($_FILES)]['name'][$i] != ''){

        $previewfilePath = "data/".key($_FILES)."/preview/".$i.".jpg"; 
        $filePath = "data/".key($_FILES)."/pictures/".$i.".jpg"; 
        $fileType = end(explode(".", $_FILES[key($_FILES)]["name"][$i]));

        $allowTypes = array('jpg','png','jpeg'); 

        
        if(in_array($fileType, $allowTypes)){ 
            if(copy($_FILES[key($_FILES)]["tmp_name"][$i], $previewfilePath)){ 
                copy($_FILES[key($_FILES)]['tmp_name'][$i], $filePath);

                $watermarkImg = imagecreatefrompng("assets/icons/logo.png"); 

                switch($fileType){ 
                    case 'jpg': 
                        $im = imagecreatefromjpeg($previewfilePath); 
                        break; 
                    case 'jpeg': 
                        $im = imagecreatefromjpeg($previewfilePath); 
                        break; 
                    case 'png': 
                        $im = imagecreatefrompng($previewfilePath); 
                        break; 
                    default: 
                        $im = imagecreatefromjpeg($previewfilePath); 
                } 


                $font = dirname(__FILE__).'/assets/CircularStd.ttf';
                $text = 'Venture Pixel';

                $white = imagecolorallocatealpha($im, 255, 255, 255, 25);
                $shadow = imagecolorallocatealpha($im, 0, 0, 0, 95);

                $width = imagesx($im);
                $font_size = $width / 10;

                $height = imagesy($im);
                $centerX = $width / 2;
                $centerY = $height / 2;

                list($left, $bottom, $right, , , $top) = imageftbbox($font_size, 45, $font, $text);

                $left_offset = ($right - $left) / 2;
                $top_offset = ($bottom - $top) / 2;

                $x = $centerX - $left_offset;
                $y = $centerY + $top_offset;

                imagettftext($im, $font_size, 45, $x + 3, $y + 3, $shadow, $font, $text);
                imagettftext($im, $font_size, 45, $x, $y, $white, $font, $text);
            
                imagejpeg($im, $previewfilePath);
                imagedestroy($im);
            }
        }
    }
}

// for($i = 0; $i < count($_FILES[key($_FILES)]['name']); $i++){
//     if(isset($_FILES[key($_FILES)]['name'][$i]) && $_FILES[key($_FILES)]['name'][$i] != ''){

//         $filePath = "data/".key($_FILES)."/pictures/".$i.".jpg"; 
//         $fileType = end(explode(".", $_FILES[key($_FILES)]["name"][$i]));

//         $allowTypes = array('jpg','png','jpeg'); 

//         if(in_array($fileType, $allowTypes)){
//             move_uploaded_file($_FILES[key($_FILES)]['tmp_name'][$i], $filePath);
//         }
//     }
// }

$index_data = file_get_contents('data/'.key($_FILES).'/info.json');
$index = json_decode($index_data, true);
$index["Current_pictures"] = count($_FILES[key($_FILES)]['name']);
file_put_contents('data/'.key($_FILES).'/info.json', json_encode($index));

echo json_encode($index);

?>