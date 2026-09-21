<?php
header('Content-Type: application/json');
require_once 'db_connect.php';   // must define $conn = mysqli_connect(...)
require_once 'fileupload.php';   // contains saveFile() helper

// Read and decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['action'])) {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
    exit;
}

/* =========================
   🔴 REJECTION HANDLER
   ========================= */
if ($data['action'] === 'confirm_rejection') {

    if (empty($data['requestId']) || empty($data['reason'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit;
    }

    $requestId = intval($data['requestId']);
    $reason = mysqli_real_escape_string($conn, trim($data['reason']));

    $query = "
        UPDATE course_requests 
        SET status='Rejected', stage='Verified', rejection_message='$reason' 
        WHERE id=$requestId
    ";

    if (mysqli_query($conn, $query)) {
        echo json_encode([
            "status" => "success",
            "message" => "Request has been rejected successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . mysqli_error($conn)
        ]);
    }

    mysqli_close($conn);
    exit;
}

/* =========================
   🟢 APPROVAL HANDLER
   ========================= */
if ($data['action'] === 'confirm_approval') {

    if (empty($data['requestId']) || empty($data['certificate'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit;
    }

    $requestId = intval($data['requestId']);
    $certificate = $data['certificate'];
    $fileName = $certificate['name'] ?? '';
    $fileData = $certificate['data'] ?? '';

    // Save uploaded file using helper
    $savedPath = saveFile($fileData, $fileName, "certificates");

    if (!$savedPath) {
        echo json_encode(["status" => "error", "message" => "Failed to save certificate file."]);
        exit;
    }

    $safePath = mysqli_real_escape_string($conn, $savedPath);

    $query = "
        UPDATE course_requests 
        SET status='Approved', stage='Approved', certificatepath='$safePath' 
        WHERE id=$requestId
    ";

    if (mysqli_query($conn, $query)) {
        echo json_encode([
            "status" => "success",
            "message" => "Approval confirmed successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . mysqli_error($conn)
        ]);
    }

    mysqli_close($conn);
    exit;
}

/* =========================
   ❌ INVALID ACTION FALLBACK
   ========================= */
echo json_encode(["status" => "error", "message" => "Invalid action provided."]);
exit;
?>

