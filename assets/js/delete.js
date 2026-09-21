// Delete a student by admission number
function deleteStudent(admissionNumber) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  fetch("delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role:'student', 
      admissionNumber: admissionNumber })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Student deleted successfully");
        updateCounts();   // refresh sidebar counts
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => alert("Request failed: " + err));
}

// Delete an office staff by staff ID (unchanged)
function deleteOffice(staffId) {
  if (!confirm("Are you sure you want to delete this staff member?")) return;

  fetch("delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      role: 'staff',
      staffId: staffId
     })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Office staff deleted successfully");   // refresh list
        updateCounts();  // refresh counts
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => alert("Request failed: " + err));
}

// Sidebar counts
async function updateCounts() {
  try {
    const response = await fetch("counter.php");
    const data = await response.json();
    document.getElementById("studentCount").textContent = data.Scount;
    document.getElementById("officeCount").textContent = data.Ocount;
  } catch (err) {
    console.error("Failed to update counts:", err);
  }
}
