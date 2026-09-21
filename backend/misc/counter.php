<?php
require '../config/connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$sql1 = "SELECT COUNT(*) AS Scount FROM student";
$sql2 = "SELECT COUNT(*) AS Ocount FROM staffdetails";

$r1 = mysqli_query($conn, $sql1);
$r2 = mysqli_query($conn, $sql2);

$row1 = mysqli_fetch_assoc($r1);
$row2 = mysqli_fetch_assoc($r2);

echo json_encode(['Scount' => $row1['Scount'], 'Ocount' => $row2['Ocount']]);
?>

