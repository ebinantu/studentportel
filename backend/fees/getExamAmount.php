<?php
header("Content-Type: application/json");
require '../config/connect.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate
if (empty($data['studentId']) || empty($data['examCode'])) {
    echo json_encode(['amount' => 0]);
    exit;
}

$studentId = mysqli_real_escape_string($conn, trim($data['studentId']));
$examCode  = mysqli_real_escape_string($conn, trim($data['examCode']));

// Fetch amount from exam_fees table (adjust table/column names if needed)
$sql = "SELECT amount FROM studentfeeexam WHERE student_id='$studentId' AND exam_id='$examCode' LIMIT 1";
$result = mysqli_query($conn, $sql);

$amount = 0;
if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $amount = floatval($row['amount']);
}

mysqli_close($conn);

// Return JSON
echo json_encode(['amount' => $amount]);
?>

