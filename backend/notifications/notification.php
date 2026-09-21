<?php
 error_reporting(E_ALL);
ini_set('display_errors', 0);
include ('db_connect.php');
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$title = $data["title"];
$department = $data["department"];
$message = $data["message"];   

$sql1 = "INSERT INTO notifications (title, department, message) VALUES ('$title', '$department', '$message')";
if (mysqli_query($conn, $sql1)) {
    echo json_encode([
        'success' => true,
        'message' => 'Record inserted successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $conn->error
    ]);
}
$conn->close();
?>
