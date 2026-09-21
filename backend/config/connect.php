<?php
$username = "root";
$password = "";
$hostname = "localhost";
$database = "studentportel";

try {
     $conn = mysqli_connect($hostname, $username, $password, $database);
        if (!$conn) {
            throw new Exception("Connection failed: " . mysqli_connect_error());
        }else {
             return "Connected successfully";
        }
} catch (Exception $e) {
     return "Connection failed: " . $e->getMessage();
}
?>

