<?php
// fetch_requests.php
header('Content-Type: application/json');

// Include your database connection
require '../config/connect.php'; // this should define $conn as the mysqli connection

// Fetch pending requests
$sql = "SELECT * 
        FROM course_requests 
        WHERE status = 'Pending' 
        ORDER BY request_date DESC";

$result = mysqli_query($conn, $sql);

if ($result) {
    $requests = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $requests[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'data' => $requests
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Query failed: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>

