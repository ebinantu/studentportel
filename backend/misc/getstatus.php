<?php
require '../config/connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$applicationId = $data['applicationId'] ?? '';

if (empty($applicationId)) {
    echo json_encode(["success" => false, "message" => "Missing application ID."]);
    exit;
}

// Escape input
$applicationId = mysqli_real_escape_string($conn, $applicationId);

// Query the table
$sql = "SELECT id, status, stage, rejection_message, certificatepath 
        FROM course_requests 
        WHERE id = '$applicationId' 
        LIMIT 1";

$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);

    // Set proper message
    if (strtolower($row['status']) === 'rejected') {
        $message = $row['rejection_message'] ?: "Your request has been rejected.";
    } elseif (strtolower($row['status']) === 'approved') {
        $message = "Your request has been approved.";
    } else {
        $message = "Your request is being processed.";
    }

    // Prepare response
    $response = [
        "success" => true,
        "data" => [
            "id" => $row["id"],
            "status" => $row["status"],
            "stage" => $row["stage"],
            "message" => $message,
            "filepath" => $row["certificatepath"] !== "document" ? $row["certificatepath"] : null
        ]
    ];

    echo json_encode($response);
} else {
    echo json_encode(["success" => false, "message" => "Application not found."]);
}

// Cleanup
if ($result) {
    mysqli_free_result($result);
}
mysqli_close($conn);

?>

