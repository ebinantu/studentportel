<?php
require '../config/connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

// Escape all inputs
$admissionNo  = mysqli_real_escape_string($conn, $data["admissionNumber"]);
$fullname     = mysqli_real_escape_string($conn, $data["name"]);
$regNo        = mysqli_real_escape_string($conn, $data["registerNumber"]);
$department   = mysqli_real_escape_string($conn, $data["department"]);
$joiningdate  = mysqli_real_escape_string($conn, $data["joiningYear"]);
$semester     = mysqli_real_escape_string($conn, $data["semester"]);
$phone        = mysqli_real_escape_string($conn, $data["phone"]);
$email        = mysqli_real_escape_string($conn, $data["email"]);
$parentName   = mysqli_real_escape_string($conn, $data["parentName"]);
$parentPhone  = mysqli_real_escape_string($conn, $data["parentPhone"]);
$address      = mysqli_real_escape_string($conn, $data["address"]);
$category     = mysqli_real_escape_string($conn, $data["category"]);
$dob          = mysqli_real_escape_string($conn, $data["dob"]);
$bloodgroup   = mysqli_real_escape_string($conn, $data["bloodgroup"]);
$gender       = mysqli_real_escape_string($conn, $data["gender"]);
$year         = mysqli_real_escape_string($conn, $data["currentYear"]);

// ✅ Step 1: Check for duplicate admission number
$checkQuery = "SELECT admissionNo FROM student WHERE admissionNo = '$admissionNo'";
$checkResult = mysqli_query($conn, $checkQuery);

if (mysqli_num_rows($checkResult) > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Student with this Admission Number already exists.'
    ]);
    mysqli_close($conn);
    exit;
}

// ✅ Step 2: Insert the new student
$sql = "
INSERT INTO student 
(admissionNo, fullname, regNo, department, joiningdate, semester, PhnNo, email, ParentName, ParentPho, address, category, Dob, Gender, bloodgroup, year)
VALUES (
    '$admissionNo',
    '$fullname',
    '$regNo',
    '$department',
    '$joiningdate',
    '$semester',
    '$phone',
    '$email',
    '$parentName',
    '$parentPhone',
    '$address',
    '$category',
    '$dob',
    '$gender',
    '$bloodgroup',
    '$year'
)
";

if (mysqli_query($conn, $sql)) {
    echo json_encode([
        'success' => true,
        'message' => 'Student record inserted successfully.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>

