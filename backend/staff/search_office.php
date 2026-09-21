<?php
include '../config/connect.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$search = isset($input['search']) ? trim($input['search']) : '';

if ($search === '') {
    echo json_encode(["success" => true, "results" => []]);
    exit;
}

$sql = "SELECT staffname AS staff_name, 
               staffid AS staff_id, 
               staffrole AS position, 
               PhnNo AS phone_number, 
               email, 
               address, 
               department 
        FROM staffdetails
        WHERE staffname LIKE ? 
           OR staffid LIKE ?
        LIMIT 200";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    error_log("prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "results" => []]);
    exit;
}

$param = $search . "%";
$stmt->bind_param("ss", $param, $param);

$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode(["success" => true, "results" => $rows]);

$stmt->close();
$conn->close();

