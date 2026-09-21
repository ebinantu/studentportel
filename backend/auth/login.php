<?php
require '../config/connect.php';
session_start();
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if ($data["action"] == "login") {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $remindme = $data['remindme'] ?? false;

    if (!$username || !$password) {
        echo json_encode(["status" => "error", "message" => "Missing credentials"]);
        exit;
    }

    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    $sql = "SELECT id, username, password, role 
            FROM userdetails
            WHERE username = '$username'
            LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if ($row = mysqli_fetch_assoc($result)) {
        if ($password==$row['password']) {
            $_SESSION['id']  = $row['id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['role']     = $row['role'];

            if ($remindme) {
                setcookie("user", $row['id'], time() + (86400 * 30), "/", "", false, true);
            }

            echo json_encode(["status" => "success", "role" => $row["role"], "id" => $row["id"]]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

    if ($result) mysqli_free_result($result);
}

elseif ($data["action"] == "checklogin") {
    if (isset($_COOKIE["user"])) {
        $id = $_COOKIE["user"];
        $sql = "SELECT id, role FROM userdetails WHERE id = '$id'";
        $result = mysqli_query($conn, $sql);

        if ($result && $row = mysqli_fetch_assoc($result)) {
            $_SESSION['id'] = $row['id'];
            $_SESSION['role'] = $row['role'];

            echo json_encode(["status" => "success", "role" => $row["role"]]);
        } else {
            echo json_encode(["status" => "error", "message" => "User not found"]);
        }

        if ($result) mysqli_free_result($result);
    } else {
        echo json_encode(["status" => "error", "message" => "No cookie found"]);
    }
}

elseif ($data["action"] == "logout") {
    session_unset();
    session_destroy();

    setcookie("user", "", time() - 3600, "/", "", false, true);

    echo json_encode(["status" => "success", "message" => "Logged out successfully"]);
}

mysqli_close($conn);
?>

