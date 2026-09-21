<?php
function saveFile($base64, $fileName,$foldername="feeFolder")
{
    $folderName =$foldername;
    $uploadDir = __DIR__ . "/" . $folderName . "/";

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            error_log("Failed to create upload directory: $uploadDir");
            return false;
        }
    }

    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExt = ["pdf", "jpg", "jpeg", "png"];

    if (!in_array($fileExt, $allowedExt)) {
        error_log("Invalid file extension: $fileExt");
        return false;
    }

    // Clean filename (remove special chars and spaces)
    $safeName = preg_replace("/[^a-zA-Z0-9_-]/", "", pathinfo($fileName, PATHINFO_FILENAME));
    $finalName = $safeName . "." . $fileExt;
    $targetFile = $uploadDir . $finalName;

    // If file already exists, overwrite
    if (file_exists($targetFile)) {
        unlink($targetFile);
    }

    if (strpos($base64, ',') !== false) {
        $base64 = explode(',', $base64)[1];
    }

    $decodedFile = base64_decode($base64, true);
    if ($decodedFile === false) {
        error_log("Base64 decode failed for $fileName");
        return false;
    }

    if (file_put_contents($targetFile, $decodedFile)) {
        // Return short relative path for DB
        return $folderName . "/" . $finalName;
    } else {
        error_log("Failed to save file: $targetFile");
        return false;
    }
}
?>

