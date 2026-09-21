<?php
header('Content-Type: application/json');
require_once 'db_connection.php'; // Make sure this defines $conn as mysqli connection

$data = json_decode(file_get_contents('php://input'), true);
$response = ['status' => 'error', 'message' => 'Invalid request.'];

if (isset($data['requestId'], $data['action'])) {
    $requestId = intval($data['requestId']);
    $action = trim($data['action']);

    if ($requestId <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request ID.']);
        exit;
    }

    // Escape values for safety (since we are using mysqli_query directly)
    $requestIdEscaped = mysqli_real_escape_string($conn, $requestId);

    if ($action === 'verify') {
        $sql = "UPDATE course_requests 
                SET stage = 'Verified', status = 'Approved' 
                WHERE id = '$requestIdEscaped'";

    } elseif ($action === 'reject') {
        if (empty($data['reason'])) {
            echo json_encode(['status' => 'error', 'message' => 'Missing a reason for rejection.']);
            exit;
        }
        $reasonEscaped = mysqli_real_escape_string($conn, $data['reason']);
        $sql = "UPDATE course_requests 
                SET status = 'Rejected', rejection_message = '$reasonEscaped' 
                WHERE id = '$requestIdEscaped'";

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
        exit;
    }

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            $response = [
                'status' => 'success',
                'message' => $action === 'verify  ' ? 'Request approved successfully.' : 'Request has been rejected.'
            ];
        } else {
            $response['message'] = 'Could not find request to ' . $action . '.';
        }
    } else {
        $response['message'] = 'A database error occurred: ' . mysqli_error($conn);
    }
}

echo json_encode($response);
?>

