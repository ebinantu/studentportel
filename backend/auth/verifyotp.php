<?php
require '../config/connect.php';
  header('Content-Type: application/json');
  session_start();
    $data = json_decode(file_get_contents('php://input'), true);
    $otp = $data['otp'];
    $current_time = time();
    if(!isset($_SESSION['otp']) || !isset($_SESSION['otp_time'])){
        echo json_encode(['status' => 'error', 'message' => 'No OTP found. Please request a new OTP.']);
        exit;
    }
    if($current_time > $_SESSION['otp_time']){
        unset($_SESSION['otp']);
        unset($_SESSION['otp_time']);
        echo json_encode(['status' => 'error', 'message' => 'OTP has expired. Please request a new OTP.']);
        exit;
    }
    if($otp == $_SESSION['otp']){
        echo json_encode(['status' => 'success', 'message' => 'OTP verified successfully.']);
        exit;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid OTP. Please try again.']);
        exit;
    }
?>
