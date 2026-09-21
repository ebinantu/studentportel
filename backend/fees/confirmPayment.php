<?php
header('Content-Type: application/json');
require_once '../config/connect.php'; // $conn = mysqli_connect(...);

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// Extract data
$studentId = isset($data['studentId']) ? mysqli_real_escape_string($conn, trim($data['studentId'])) : '';
$feeId     = isset($data['feeId']) ? mysqli_real_escape_string($conn, trim($data['feeId'])) : '';
$upiId     = isset($data['upiId']) ? mysqli_real_escape_string($conn, trim($data['upiId'])) : '';

// Basic validation
if (empty($studentId) || empty($feeId) || empty($upiId)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

// Validate UPI format
if (!preg_match('/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/', $upiId)) {
    echo json_encode(['success' => false, 'message' => 'Invalid UPI ID format.']);
    exit;
}

// Update fee status
$sql = "UPDATE studentfeecollege
        SET status='paid', upi_id='$upiId' 
        WHERE student_id='$studentId' AND feeid='$feeId'";

$result = mysqli_query($conn, $sql);

if ($result && mysqli_affected_rows($conn) > 0) {
    echo json_encode(['success' => true, 'message' => 'Payment confirmed.']);
} else {
    echo json_encode(['success' => false, 'message' => 'No matching fee found or already paid.']);
}

mysqli_close($conn);
?>

