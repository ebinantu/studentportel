<?php
function profilephoto($base64, $photoname, $username)
{
    $uploadDir = __DIR__ . "/profilepics/";  // keep consistent with return path

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            error_log("Failed to create upload dir: $uploadDir");
            return false;
        }
    }

    $fileExt = strtolower(pathinfo($photoname, PATHINFO_EXTENSION));
    $allowedExt = ["jpg", "jpeg", "png"];

    if (!in_array($fileExt, $allowedExt)) {
        error_log("Invalid extension: $fileExt");
        return false;
    }

    $usernameSafe = preg_replace("/[^a-zA-Z0-9_-]/", "", strtolower($username));
    $fileName =  $usernameSafe . "." . $fileExt;
    $targetFile = $uploadDir . $fileName;

    if (strpos($base64, ',') !== false) {
        $base64 = explode(',', $base64)[1];
    }

    $decodedImage = base64_decode($base64, true);
    if ($decodedImage === false) {
        error_log("Base64 decode failed");
        return false;
    }

    if (file_put_contents($targetFile, $decodedImage)) {
        // return relative web path for DB and <img src="">
        return "profilepics/" . $fileName;
    } else {
        error_log("Failed to write file: $targetFile");
        return false;
    }
}
?>

