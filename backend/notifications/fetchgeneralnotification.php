<?php
header("Content-Type: application/json");
require '../config/connect.php'; // your database connection file

// Read and decode the JSON input from JS fetch
$input = json_decode(file_get_contents("php://input"), true);

// Check if department is sent
if (!isset($input['department'])) {
    echo json_encode([]);
    exit;
}

// Clean the input to prevent SQL injection
$department = mysqli_real_escape_string($conn, trim($input['department']));

// Build query: show notifications for department or for 'All'
$sql = "
    SELECT id, title, department, message, created_at
    FROM notifications
    WHERE department = '$department' OR department = 'All'
    ORDER BY created_at DESC
";

$result = mysqli_query($conn, $sql);

$notifications = [];

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $notifications[] = $row;
    }
}

// Close DB connection
mysqli_close($conn);

// Output JSON
echo json_encode($notifications);
?>

