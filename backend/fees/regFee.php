<?php
require '../config/connect.php';
require 'fileupload.php';
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

function escape($conn, $value) {
    return mysqli_real_escape_string($conn, $value);
}

$structure = $data['StructureFile'];
$filepath = saveFile($structure['FileData'], $structure['fileName']);

// Insert without validation
if ($data['type'] === 'college') {

    $title = escape($conn, $data['title']);
    $department = escape($conn, $data['department']);
    $semester = escape($conn, $data['semester']);
    $year = escape($conn, $data['year']);
    $category = $data['category'];
    $amount = escape($conn, $data['amount']);
    $lastDate = escape($conn, $data['lastDate']);
    $path = $filepath;

    $query1 = "INSERT INTO college_fee (fee_title, department, semester, year , category, amount, last_date,fee_structure_path) 
              VALUES ('$title', '$department', $semester, $year, '$category', $amount, '$lastDate','$path')";

      $query2 = "INSERT INTO studentFeeCollege (
    student_id,
    feeId,
    feeTitle,
    department,
    semester,
    year,
    category,
    amount,
    lastdate,
    status
)
SELECT 
    student.admissionNo,
    college_fee.fee_id,
    college_fee.fee_title,
    student.department,
    student.semester,
    student.year,
    student.category,
    college_fee.amount,
    college_fee.last_date,
    'Pending'
FROM student
JOIN college_fee
  ON (
       student.department = college_fee.department 
       OR college_fee.department = 'all'
     )
 AND (
       student.semester = college_fee.semester 
       OR college_fee.semester = 0
     )
 AND (
       student.year = college_fee.year 
       OR college_fee.year = 0
     )
 AND (
       student.category = college_fee.category 
       OR college_fee.category = 'allcat'
     )
WHERE college_fee.active_flag = TRUE
  AND NOT EXISTS (
    SELECT 1 
    FROM studentFeeCollege
    WHERE studentFeeCollege.student_id = student.admissionNo 
      AND studentFeeCollege.feeId = college_fee.fee_id
  );
";

} elseif ($data['type'] === 'exam') {

    $examId = escape($conn, $data['examId']);
    $examName = escape($conn, $data['examName']);
    $department = escape($conn, $data['department']);
    $semester = escape($conn, $data['semester']);
    $category = escape($conn, $data['category']);
    $amount = escape($conn, $data['amount']);
    $dueDate = escape($conn, $data['dueDate']); 
    $path  = $filepath ;

    $query1 = "INSERT INTO exam_fees (exam_id, exam_name, department, semester, category, amount, due_date,fee_structure_path) 
              VALUES ('$examId', '$examName', '$department', $semester, '$category', $amount, '$dueDate','$path')";

    $query2 = "INSERT INTO studentFeeExam (
    studentid,
    studentRoll,
    department,
    category,
    semester,
    examid,
    examname,
    amount,
    lastdate,
    status
)
SELECT 
    student.admissionNo,
    student.regNO,
    student.department,
    student.category,
    student.semester,
    exam_fees.exam_id,
    exam_fees.exam_name,
    exam_fees.amount,
    exam_fees.due_date,
    'Pending'
FROM student
JOIN exam_fees
  ON (
       student.department = exam_fees.department 
       OR exam_fees.department = 'alldep'
     )
 AND (
       student.semester = exam_fees.semester 
       OR exam_fees.semester = 0
     )
 AND (
       student.category = exam_fees.category 
       OR exam_fees.category = 'allcat'
     )
WHERE exam_fees.active_flag = TRUE
  AND NOT EXISTS (
    SELECT 1 
    FROM studentFeeExam 
    WHERE studentFeeExam.studentid = student.admissionNo 
      AND studentFeeExam.examname = exam_fees.exam_name
  );
";
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid fee type']);
    exit;
}

// Execute query
if (mysqli_query($conn, $query1)) {
    if(mysqli_query($conn,$query2)) {
    echo json_encode(['success' => 'good', 'message' => 'Fee registered successfully applied to all students']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database insertion failed: ']);
}

// Close connection
mysqli_close($conn);
?>

