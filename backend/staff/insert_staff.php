<?php
include '../config/connect.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// Assign variables from $data
$staffName   = $data["staff_name"];
$staffId     = $data["staff_id"];
$position    = $data["position"];
$phone       = $data["phone_number"];
$email       = $data["email"];
$address     = $data["address"];
$department  = $data["department"];
// Build SQL query
$sql = "INSERT INTO staffdetails
    (staffid, staffname, staffrole, PhnNo, email,address, department) 
    VALUES (
        '$staffId', '$staffName', '$position', 
        $phone, '$email', '$address', '$department'
    )";
if ($conn->query($sql) === TRUE) {
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
 

