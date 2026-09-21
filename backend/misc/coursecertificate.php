<?php
require '../config/connect.php';
require 'fileupload.php'; // contains saveFile($base64, $fileName)
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_USERNAME = 'supp0rtucc0llege@gmail.com';
const SMTP_PASSWORD = 'jxji cpuc cdst znte';

header("Content-Type: application/json");

// Decode JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$code = rand(10000, 99999); // generates a random 5-digit number

// --- Sanitize user inputs ---
$admissionNo = mysqli_real_escape_string($conn, $data['admissionNo']);
$name        = mysqli_real_escape_string($conn, $data['name']);
$department  = mysqli_real_escape_string($conn, $data['department']);
$course      = mysqli_real_escape_string($conn, $data['course']);
$year        = mysqli_real_escape_string($conn, $data['year']);
$message     = mysqli_real_escape_string($conn, $data['message']);
$email = $data['mailid'];
// --- Save files and get paths ---
$signaturePath = null;
$doc1Path = null;
$doc2Path = null;

if (!empty($data['signature']['FileData']) && !empty($data['signature']['fileName'])) {
    $signaturePath = saveFile($data['signature']['FileData'], $data['signature']['fileName'], 'documents');
}

if (!empty($data['document1']['FileData']) && !empty($data['document1']['fileName'])) {
    $doc1Path = saveFile($data['document1']['FileData'], $data['document1']['fileName'], 'documents');
}

if (!empty($data['document2']['FileData']) && !empty($data['document2']['fileName'])) {
    $doc2Path = saveFile($data['document2']['FileData'], $data['document2']['fileName'], 'documents');
}

// --- Insert into database ---
$query = "
INSERT INTO course_requests(
    id,admissionNo, name, department, course, year, message,
    signature_path, doc1_path, doc2_path
) VALUES (
    $code,'$admissionNo', '$name', '$department', '$course', $year, '$message',
    '$signaturePath', '$doc1Path', '$doc2Path'
)";

// --- Execute query ---
if (mysqli_query($conn, $query)) {
    regmail($email,$code);
    echo json_encode(["success" => true, "message" => "Course request submitted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database Error: " . mysqli_error($conn)]);
}

mysqli_close($conn);

function regmail($mailid,$code)
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

$SUBJECT = 'Application Code';

$body = 'Course Certificate Application code for your application is     '.$code;


$To = $mailid ?? '';

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

