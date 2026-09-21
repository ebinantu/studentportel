<?php
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_USERNAME = 'supp0rtucc0llege@gmail.com';
const SMTP_PASSWORD = 'jxji cpuc cdst znte';

function regmail()
{
$mail = new PHPMailer(true);
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

$SUBJECT = 'SuccessFull Registeration';

$body = 'Your successfully Registered To Union Christain College Website';


$To = $_SESSION['email'] ?? '';

try{
    $mail->setFrom(SMTP_USERNAME, 'Support UCCOLLEGE');
    $mail->addAddress($To);
    $mail->Subject = $SUBJECT;
    $mail->Body = $body;
    $mail->send();
} catch (Exception $e) {
    print_r($e);
}
}


?>
