<?php
require 'userdetails.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
session_start();
$_SESSION['id']=$data['id'];
$role = $data['role'];
if ($role === 'student') {
    $id = $data['id'];
    $result = fulldeatils($id, $role);
    $info = [ 
        'status' => 'success',
        'data' => $result
    ];

} elseif ($role === 'staff') {
    $id = $data['id'];
    $result = fulldeatils($id, $role);
    $info = [ 
        'status' => 'success',
        'data' => $result
    ];
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid role']);
    exit;
}
echo json_encode($info);
?>


