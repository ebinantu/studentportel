<?php
require '../config/connect.php'; 

function getEmail($id, $role) {
    global $conn;

    // For staff role
    if ($role === 'staff') {
        $id = mysqli_real_escape_string($conn, $id);
        $sql = "SELECT email FROM staffdetails WHERE staffid = '$id'";
        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            return $row['email'];
        } else {
            return null;
        }
    }

    // For student role
    if ($role === 'student') {
        $id = mysqli_real_escape_string($conn, $id);
        $sql = "SELECT email FROM student WHERE admissionNo = '$id'";
        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            return $row['email'];
        } else {
            return null;
        }
    }

    // If role doesn't match any case
    return null;
}
?>

