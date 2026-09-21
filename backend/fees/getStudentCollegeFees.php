<?php
header('Content-Type: application/json');

require '../config/connect.php';
// --- Read POST JSON data ---
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['student_id']) || empty($data['student_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Student ID is required"]);
    exit;
}

$student_id = mysqli_real_escape_string($conn, $data['student_id']);

// --- SQL Query Placeholder ---
// Replace 'your_fee_table' with your table name
$sql = "SELECT studentfeecollege.*
FROM studentfeecollege
JOIN college_fees 
  ON studentfeecollege.feeId = college_fees.feeid
WHERE studentfeecollege.student_id = '$student_id'
  AND studentfeecollege.status = 'Pending'
  AND college_fees.active_flag = TRUE;";

$result = mysqli_query($conn, $sql);

$fees = [];

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $fees[] = [
            "feeid" => $row['id'],                 // fill your column
            "feeTitle" => $row['FeeTitle'],       // fill your column
            "amount" => $row['amount'],         // fill your column
            "lastdate" => $row['lastdate'],     // fill your column
            "studentid" => $row['student_id'],  // fill your column, // fill your column
            "department" => $row['department']  // fill your column
        ];
    }
}

// Return JSON
echo json_encode($fees);

// Close connection
mysqli_close($conn);
?>

