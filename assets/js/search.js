// searchorg.js

function searchEntries(type) {
  let query = "";
  let url = "";
  let container = "";
  let searchData = {};

  if (type === "student") {
    const textQuery = document.getElementById("searchStudent").value.trim();
    const departmentFilter = document.getElementById("filterDepartment").value;
    const yearFilter = document.getElementById("filterYear").value;

    url = "search_students.php";
    container = "studentEntries";

    searchData = {
      search: textQuery,
        department: departmentFilter,
        year: yearFilter
    };
  } else if (type === "office") {
    const textQuery = document.getElementById("searchOffice").value.trim();
    url = "search_office.php";
    container = "officeEntries";

    searchData = {
      search: textQuery
    };
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchData),
  })
    .then(res => res.json())
    .then(data => {
      const target = document.getElementById(container);
      target.innerHTML = ""; // clear old results

      if (data.success && data.results.length > 0) {
        data.results.forEach(item => {
          let div = document.createElement("div");
          div.className = "entry-box";

          if (type === "student") {
            div.innerHTML = `
              <div class="entry-left">
                <strong>${item.fullname}</strong>
              </div>
              <div class="entry-right">
                Registernumber: ${item.register_number} , Admissionnumber: <b>${item.admission_number}</b><br>
                Department: ${item.department} , Semester: ${item.semester}, Joining_date: ${item.joiningdate}<br>
                PhoneNo: ${item.phone_number} , Email: ${item.email} , Address: ${item.address}<br>
                ParentName: ${item.parent_name} ,ParentPhoneNo: ${item.parent_phone} , DOB: ${item.Dob} <br>
                BloodGroup: ${item.bloodgroup} , Category: ${item.Category} , Gender: ${item.Gender}
<div>
<button  class="delete-btn" onclick="deleteStudent('${item.admission_number}')">Delete</button>
</div>
              </div>
            `;

          } 
          else if (type === "office") { 
            div.innerHTML = `
              <div class="entry-left">
                <strong>${item.staff_name}</strong>
              </div>
              <div class="entry-right">
                ID: ${item.staff_id}, Role: ${item.position}<br>
                Dept: ${item.department}, Phone: ${item.phone_number}<br>
                Email: ${item.email}<br>
                Address: ${item.address}
                <div>
<button class="delete-btn" onclick="deleteOffice('${item.staff_id}')">Delete</button>
</div>
              </div>
            `;
          }
          target.appendChild(div);
        });
      } else {
        target.innerHTML = "<p>No records found.</p>";
      }
    })
    .catch(err => {
      console.error("Search error:", err);
    });
}







// Delete a student by admission number
function deleteStudent(admissionNumber) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  fetch("delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
 // In your deleteStudent function
body: JSON.stringify({
  role:'student',
  admissionNumber: admissionNumber // <-- You use 'admissionNumber' here
})
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Student deleted successfully");  // refresh list
        updateCounts();   // refresh sidebar counts
        window.location.reload(); // Reload the page to reflect changes
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err);
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
        alert("Office staff deleted successfully");
        // refresh list
        updateCounts();  // refresh counts
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err);
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


