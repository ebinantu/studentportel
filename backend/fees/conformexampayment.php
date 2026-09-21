<?php
header("Content-Type: application/json");
require '../config/connect.php'; // defines $conn


$data = json_decode(file_get_contents("php://input"), true);


if (empty($data['studentId']) || empty($data['examCode']) || empty($data['upiId']) || empty($data['amount'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$studentName = mysqli_real_escape_string($conn, trim($data['studentName']));
$rollno =  mysqli_real_escape_string($conn, trim($data['rollno']));
$studentId   = mysqli_real_escape_string($conn, trim($data['studentId']));
$examName    = mysqli_real_escape_string($conn, trim($data['examName']));
$examCode    = mysqli_real_escape_string($conn, trim($data['examCode']));
$department  = mysqli_real_escape_string($conn, trim($data['department']));
$semester    = mysqli_real_escape_string($conn, trim($data['semester']));
$upiId       = mysqli_real_escape_string($conn, trim($data['upiId']));
$amount      = floatval($data['amount']);

// --- Prepare course codes (max 11) ---
$courses = array_fill(0, 11, 'NA'); // default NA
if (!empty($data['courses']) && is_array($data['courses'])) {
    foreach ($data['courses'] as $index => $courseObj) {
        if ($index < 11) {
            $value = reset($courseObj); // first value of object
            $courses[$index] = mysqli_real_escape_string($conn, $value ?: 'NA');
        }
    }
}


mysqli_begin_transaction($conn);

try {
    // 1️⃣ Insert into exam_payments
    $insertSql = "
    INSERT INTO exam_payments(
        student_id, rollno, student_name, department, semester,
        exam_code, exam_name, amount, upi_id,
        course1, course2, course3, course4, course5,
        course6, course7, course8, course9, course10, course11,
        payment_date, status
    ) VALUES (
        '$studentId','$rollno, '$studentName', '$department', '$semester',
        '$examCode', '$examName', '$amount', '$upiId',
        '{$courses[0]}', '{$courses[1]}', '{$courses[2]}', '{$courses[3]}', '{$courses[4]}',
        '{$courses[5]}', '{$courses[6]}', '{$courses[7]}', '{$courses[8]}', '{$courses[9]}', '{$courses[10]}',
        NOW(), 'Paid'
    )";
    if (!mysqli_query($conn, $insertSql)) {
        throw new Exception("Insert exam payment failed: " . mysqli_error($conn));
    }

    // 2️⃣ Update exam_fees table: set status = 'Paid' and store upi_id
    $updateSql = "
        UPDATE studentfeeexam
        SET status = 'Paid', upi_id = '$upiId'
        WHERE student_id = '$studentId' AND exam_id = '$examCode'
    ";
    if (!mysqli_query($conn, $updateSql)) {
        throw new Exception("Update exam_fees failed: " . mysqli_error($conn));
    }

    // 3️⃣ Commit transaction
    mysqli_commit($conn);
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

mysqli_close($conn);
?>

