<?php
session_start();
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
header('Content-Type: application/json');
require 'checkemail.php';
$data = json_decode(file_get_contents('php://input'), true);


$email = getEmail($data['id'], $data['role']); 
if (!$email) {
    echo json_encode(["status" => "error", "message" => "Student email not found."]);
    exit;
}

$_SESSION['email']=$email;
$mail = new PHPMailer(true);
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_USERNAME = 'supp0rtucc0llege@gmail.com';
const SMTP_PASSWORD = 'jxji cpuc cdst znte';
$mail->isSMTP();
//$mail->SMTPDebug = SMTP::DEBUG_CONNECTION;
$mail->Host = SMTP_HOST;
$mail->SMTPAuth = true;
$mail->Username = SMTP_USERNAME;
$mail->Password = SMTP_PASSWORD;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
$mail->SMTPAutoTLS = false;
$mail->SMTPOptions = [
"ssl" => [
"verify_peer" => false,
"verify_peer_name" => false,
"allow_self_signed" => true,
]
];

$otp = rand(10000,99999);
$_SESSION['otp'] = $otp;
$_SESSION['otp_time'] = time()+(5*60);
const SUBJECT = 'UC COLLEGE OTP Verification';
$body = 'Your OTP code is:' . $otp.' if you did not request this code, please ignore this email.';

$To = $email ?? 'ebinantu76@gmail.com';

try{
    $mail->setFrom(SMTP_USERNAME, 'Support UCCOLLEGE');
    $mail->addAddress($To);
    $mail->Subject = SUBJECT;
    $mail->Body = $body;
    $mail->send();
    echo json_encode(["status" => "success", "message" => "OTP sent successfully to "]);
    exit;
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: "]);
    print_r($e);
}
?>
