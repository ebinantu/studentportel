<?php
require '../config/connect.php'; 

function  fulldeatils($Id,$role){
    global $conn;

    //prevent SQL injection
    $Id = mysqli_real_escape_string($conn, $Id);
    $role = mysqli_real_escape_string($conn, $role);

    if($role=='student'){
        $table = 'student';
        $id_column = 'admissionNO';
    } elseif($role=='staff'){
        $table = 'staffdetails';
        $id_column = 'staffid';
    } else {
        return null;
    }

    $sql = "SELECT * FROM $table WHERE $id_column = '$Id'";
    $result = mysqli_query($conn, $sql);
    if (!$result || mysqli_num_rows($result) === 0) {
        return null;
    }
    $row = mysqli_fetch_assoc($result);
    return $row;
}

?>
