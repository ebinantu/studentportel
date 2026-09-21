<?php
include '../config/connect.php'; // Make sure this file handles connection errors properly
header('Content-Type: application/json');

/**
 * Sends a JSON error response and terminates the script.
 * @param string $message The error message to send.
 */
function send_error($message) {
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// Get and sanitize input from the POST request
$input = json_decode(file_get_contents("php://input"), true);
$search = isset($input['search']) ? trim($input['search']) : '';
$department = isset($input['department']) ? trim($input['department']) : '';
$year = isset($input['year']) ? trim($input['year']) : '';


// --- Main Logic ---

// Base SQL query, starts with `WHERE 1=1` to easily append conditions.
$sql = "SELECT
            admissionNo AS admission_number, fullname, regNo AS register_number,
            department, joiningdate, semester AS semester, PhnNo AS phone_number,
            email, ParentName AS parent_name, ParentPho AS parent_phone,
            address, Dob, bloodgroup, category, Gender
        FROM student
        WHERE 1=1";

$params = [];
$types = '';

// Dynamically build the WHERE clause based on provided filters.
// ⚠️ IMPORTANT: Ensure the values from your HTML <select> dropdowns
// for department and year exactly match the data stored in your database.
if ($department !== '') {
    $sql .= " AND department = ?";
    $types .= 's';
    $params[] = $department;
}

if ($year !== '') {
    // Use the YEAR() function to extract the year from a DATE or DATETIME column.
    // This assumes your 'joiningdate' column is of a date/datetime type.
    $sql .= " AND YEAR(joiningdate) = ?";
    $types .= 's';
    $params[] = $year;
}

if ($search !== '') {
    $searchTerm = $search . '%'; // Prepare search term for a "starts with" search.
    $sql .= " AND (admissionNo LIKE ? OR fullname LIKE ? OR regNo LIKE ?)";
    $types .= 'sss';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

// Add a LIMIT clause for performance and pagination.
$sql .= " ORDER BY fullname ASC LIMIT 20";

// Prepare and execute the statement
$stmt = $conn->prepare($sql);
if (!$stmt) {
    // Log the detailed error for the developer, but send a generic error to the user.
    error_log("SQL Prepare Failed: " . $conn->error);
    send_error("There was an issue preparing the database query.");
}

// Bind parameters if any were added.
// This uses the modern splat operator (...), available in PHP 5.6+.
if (!empty($types)) {
    $stmt->bind_param($types, ...$params);
}

if (!$stmt->execute()) {
    error_log("SQL Execute Failed: " . $stmt->error);
    send_error("Failed to execute the search query.");
}

$result = $stmt->get_result();
$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}

$stmt->close();
$conn->close();

// Send the successful response
echo json_encode([
    "success" => true,
    "results" => $rows
]);
?>


