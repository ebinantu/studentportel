<?php
require_once '../config/connect.php';
require_once 'photoupload.php';
require_once 'regmail.php';
header('Content-Type: application/json');
session_start();

$data = json_decode(file_get_contents('php://input'), true);

$username    = $data['username'] ?? '';
$password    = $data['password'] ?? '';
$role        = $data['role'] ?? '';
$photoBase64 = $data['photo'] ?? '';
$photoname   = $data['photoName'] ?? '';
$id = $_SESSION['id'] ??'';

$photoPath = profilephoto($photoBase64, $photoname, $username);


if ($photoPath) {
   
  $usernameEsc = mysqli_real_escape_string($conn, $username);
    $passwordEsc = mysqli_real_escape_string($conn, $password);
    $roleEsc     = mysqli_real_escape_string($conn, $role);
    $photoEsc    = mysqli_real_escape_string($conn, $photoPath);

   
 $sql = "INSERT INTO userdetails (id,username, password, role, profile_pic) 
            VALUES ('$id','$usernameEsc', '$passwordEsc', '$roleEsc', '$photoEsc')";

    if (mysqli_query($conn, $sql)) {
        $response = [
            "status"  => "success",
            "message" => "User registered successfully",
            "photo"   => $photoPath
        ];
        regmail();
    } else {
        $response = [
            "status"  => "error",
            "message" => "DB insert failed: " . mysqli_error($conn)
        ];
    }
} else {
    $response = [
        "status"  => "error",
        "message" => "Failed to upload photo" , 
        "photo"   => $photoPath

    ];
}

echo json_encode($response);

?>
