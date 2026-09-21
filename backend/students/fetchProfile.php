<?php
session_start();
require '../config/connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if ($data['role'] == 'staff') {
    $id = $_SESSION['id'] ?? '';
    $sql = "SELECT * FROM  staffdetails WHERE staffid = '$id';";
    $sql2  = "SELECT profile_pic FROM userdetails WHERE id = '$id';";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        $staffDetails = mysqli_fetch_assoc($result);
        $result2 = mysqli_query($conn, $sql2);
        if ($result2) {
            $userDetails = mysqli_fetch_assoc($result2);
            $staffDetails['profile_pic'] = $userDetails['profile_pic'] ?? '';
        }
        echo json_encode(['status' => 'success', 'data' => $staffDetails]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch profile details']);
    }
}

if ($data['role'] == 'student') {
    $id = $_SESSION['id'] ?? '';
    $sql = "SELECT * FROM  student WHERE  admissionNO = '$id';";
    $sql2 = "SELECT profile_pic FROM userdetails WHERE id = '$id';";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        $studentDetails = mysqli_fetch_assoc($result);
        $result2 = mysqli_query($conn, $sql2);
        if ($result2) {
            $userDetails = mysqli_fetch_assoc($result2);
            $studentDetails['profile_pic'] = $userDetails['profile_pic'] ?? '';
        }
        echo json_encode(['status' => 'success', 'data' => $studentDetails]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch profile details']);
    }
}
    
?>
