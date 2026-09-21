<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
require '../config/connect.php';

if ($data['role'] == 'student') {
    // FIX: Use the correct key 'admissionNumber' sent from JavaScript
    $id = $data['admissionNumber'];
    $query = "DELETE FROM student WHERE admissionNo = '$id'"; // Semicolon inside query is not needed

} else {
    $id = $data['staffId'];
    $query = "DELETE FROM staffdetails WHERE staffid = '$id'"; // Semicolon inside query is not needed
}

mysqli_query($conn, $query);

if (mysqli_affected_rows($conn) > 0) {
    echo json_encode([
        'success' => true,
        'message' => 'Record deleted successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No record found to delete or an error occurred.'
    ]);
}

mysqli_close($conn);
?>
