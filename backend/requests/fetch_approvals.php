<?php
header('Content-Type: application/json');
require_once '../config/connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$response = ['status' => 'error', 'message' => 'Invalid request.'];

// Optional: Check the action from JS if you sent one
if (isset($data['action']) && $data['action'] === 'fetch') {
    $sql = "
        SELECT id, name, department, message 
        FROM course_requests
        WHERE stage = 'Verified' 
          AND status = 'Approved'
        ORDER BY id DESC
    ";

    $result = mysqli_query($conn, $sql);

    if ($result) {
        $requests = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $requests[] = $row;
        }

        $response = [
            'status' => 'success',
            'data' => $requests
        ];
    } else {
        $response['message'] = 'Database query failed: ' . mysqli_error($conn);
    }
}

echo json_encode($response);
?>
