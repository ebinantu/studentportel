document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selectors ---
  const studentYearInput = document.getElementById('studentYear');
  const dobInput = document.getElementById('dob');
  const yearSelect = document.getElementById('CurrentYear');
  const studentCountDisplay = document.getElementById('studentCount');
  const officeCountDisplay = document.getElementById('officeCount');
  const navLinks = document.querySelectorAll('.sidebar ul li');
  const addStudentBtn = document.querySelector('.add-buttons button:nth-child(1)');
  const addStaffBtn = document.querySelector('.add-buttons button:nth-child(2)');
  const studentFormBtn = document.querySelector('#studentForm button');
  const officeFormBtn = document.querySelector('#officeForm button');
  const logoutBtn = document.getElementById('logout');

  // --- Tab and Form Switching Logic ---
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const tabName = link.textContent.trim().toLowerCase().split(' ')[0];
      const tabIdMap = {
        'students': 'students',
        'office': 'office',
        'approvals': 'requests'
      };
      switchTab(tabIdMap[tabName]);
    });
  });

  if (addStudentBtn) addStudentBtn.addEventListener('click', () => showForm('student'));
  if (addStaffBtn) addStaffBtn.addEventListener('click', () => showForm('office'));
  if (studentFormBtn) studentFormBtn.addEventListener('click', validateStudent);
  if (officeFormBtn) officeFormBtn.addEventListener('click', validateOffice);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  function switchTab(tabId) {
    document.querySelectorAll('.main-content .section').forEach(section => {
      section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar ul li').forEach(li => {
      li.classList.remove('active');
    });

    const activeSection = document.getElementById(tabId);
    if (activeSection) activeSection.classList.add('active');

    const tabNameMap = {
      'students': 'Students',
      'office': 'Office Staffs',
      'requests': 'Approvals'
    };
    navLinks.forEach(link => {
      if (link.textContent.includes(tabNameMap[tabId])) {
        link.classList.add('active');
      }
    });

    hideForms();
  }

  window.showForm = function (type) {
    hideForms();
    const form = document.getElementById(type + "Form");
    if (form) form.style.display = 'block';
    document.querySelectorAll('.main-content .section').forEach(s => s.classList.remove('active'));
  }

  function hideForms() {
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('officeForm').style.display = 'none';
  }

  // --- Dynamic Semester Dropdown ---
  if (yearSelect) {
    yearSelect.addEventListener('change', updateSemesters);
  }

  function updateSemesters() {
    const semesterSelect = document.getElementById('studentSemester');
    const selectedYear = yearSelect.value;
    semesterSelect.innerHTML = '<option value="" disabled selected>Semester</option>';
    switch (selectedYear) {
      case '1': semesterSelect.innerHTML += '<option value="1">Semester 1</option><option value="2">Semester 2</option>'; break;
      case '2': semesterSelect.innerHTML += '<option value="3">Semester 3</option><option value="4">Semester 4</option>'; break;
      case '3': semesterSelect.innerHTML += '<option value="5">Semester 5</option><option value="6">Semester 6</option>'; break;
    }
  }

  // --- Date Input Type Toggling ---
  function setupDateInput(element) {
    if (!element) return;
    element.addEventListener("focus", () => element.type = "date");
    element.addEventListener("blur", () => element.type = "text");
  }
  setupDateInput(studentYearInput);
  setupDateInput(dobInput);

  // --- STUDENT FORM VALIDATION ---
  function validateStudent() {
    const name = document.getElementById("studentName").value.trim();
    const reg = document.getElementById("registerNumberStudent").value.trim();
    const adm = document.getElementById("admissionNumberStudent").value.trim();
    const phone = document.getElementById("phoneNumberStudent").value.trim();
    const email = document.getElementById("emailStudent").value.trim();
    const address = document.getElementById("addressStudent").value.trim();
    const dept = document.getElementById("departmentStudent").value.trim();
    const sem = document.getElementById("studentSemester").value.trim();
    const joinYear = document.getElementById("studentYear").value.trim();
    const parentName = document.getElementById("parentName").value.trim();
    const parentPhone = document.getElementById("parentPhone").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const blood = document.getElementById("bloodgroup").value.trim();
    const category = document.getElementById("Category").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const currentYear = document.getElementById("CurrentYear").value.trim();

    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regPattern = /^\d{12}$/;
    const admPattern = /^[A-Za-z][0-9]{4}$/;

    if (!name || !isNaN(name)) return alert("Enter valid full name.");
    if (!regPattern.test(reg)) return alert("Enter valid Register Number (12digits).");
    if (!admPattern.test(adm)) return alert("Enter valid Admission Number (e.g., H1234).");
    if (!phonePattern.test(phone)) return alert("Enter valid Phone Number (10 digits).");
    if (!emailPattern.test(email)) return alert("Enter valid Email.");
    if (address.length < 5) return alert("Enter valid Address (min 5 chars).");
    if (!dept) return alert("Select Department.");
    if (!currentYear) return alert("Select Current Year.");
    if (!sem) return alert("Select Semester.");
    if (!joinYear || joinYear > new Date().getFullYear()) return alert("Enter valid Joining Year.");
    if (!parentName || !isNaN(parentName)) return alert("Enter valid Parent Name.");
    if (!phonePattern.test(parentPhone)) return alert("Enter valid Parent Phone (10 digits).");
    if (phone === parentPhone) return alert("Parent and Student phone numbers should differ.");
    if (!dob) return alert("Enter Date of Birth.");
    if (!blood) return alert("Select Blood Group.");
    if (!gender) return alert("Select Gender.");
    if (!category) return alert("Select Category.");

    addStudent();
  }

  // --- OFFICE FORM VALIDATION ---
  function validateOffice() {
    const name = document.getElementById("officeName").value.trim();
    const id = document.getElementById("officeId").value.trim();
    const role = document.getElementById("jobRole").value.trim();
    const dept = document.getElementById("officeDepartment").value.trim();
    const addr = document.getElementById("officeAddress").value.trim();
    const phone = document.getElementById("officePhone").value.trim();
    const email = document.getElementById("officeEmail").value.trim();

    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idPattern = /^\d{8}$/;

    if (!name || !isNaN(name)) return alert("Enter valid staff name.");
    if (!idPattern.test(id)) return alert("Enter valid Staff ID (8 digits).");
    if (!role || !isNaN(role)) return alert("Enter valid Job Role.");
    if (!dept) return alert("Select Department.");
    if (addr.length < 5) return alert("Enter valid Address.");
    if (!phonePattern.test(phone)) return alert("Enter valid Phone (10 digits).");
    if (!emailPattern.test(email)) return alert("Enter valid Email.");

    addOffice();
  }

  // --- STUDENT ADD FUNCTION ---
  function addStudent() {
    const data = {
      name: document.getElementById("studentName").value.trim(),
      registerNumber: document.getElementById("registerNumberStudent").value.trim(),
      admissionNumber: document.getElementById("admissionNumberStudent").value.trim(),
      phone: document.getElementById("phoneNumberStudent").value.trim(),
      email: document.getElementById("emailStudent").value.trim(),
      address: document.getElementById("addressStudent").value.trim(),
      department: document.getElementById("departmentStudent").value.trim(),
      semester: document.getElementById("studentSemester").value.trim(),
      joiningYear: document.getElementById("studentYear").value.trim(),
      parentName: document.getElementById("parentName").value.trim(),
      parentPhone: document.getElementById("parentPhone").value.trim(),
      dob: document.getElementById("dob").value.trim(),
      bloodgroup: document.getElementById("bloodgroup").value.trim(),
      category: document.getElementById("Category").value.trim(),
      gender: document.getElementById("gender").value.trim(),
      currentYear: document.getElementById("CurrentYear").value.trim()
    };

    fetch("insert_student.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(async resData => {
        if (resData.success) {
          await updateCounts();
          alert("Student added successfully.");
          clearStudentForm();
          switchTab("students");
        } else {
          alert("Error: " + resData.message);
        }
      })
      .catch(err => console.error("Add student failed:", err));
  }

  // --- OFFICE ADD FUNCTION ---
  function addOffice() {
    const data = {
      staff_name: document.getElementById("officeName").value.trim(),
      staff_id: document.getElementById("officeId").value.trim(),
      position: document.getElementById("jobRole").value.trim(),
      department: document.getElementById("officeDepartment").value.trim(),
      address: document.getElementById("officeAddress").value.trim(),
      phone_number: document.getElementById("officePhone").value.trim(),
      email: document.getElementById("officeEmail").value.trim()
    };

    fetch("insert_staff.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(async resData => {
        if (resData.success) {
          await updateCounts();
          alert("Staff added successfully.");
          clearOfficeForm();
          switchTab("office");
        } else {
          alert("Error: " + resData.message);
        }
      })
      .catch(err => console.error("Add office failed:", err));
  }

  // --- CLEAR FORMS ---
  function clearStudentForm() {
    [
      'studentName', 'registerNumberStudent', 'admissionNumberStudent', 'phoneNumberStudent',
      'emailStudent', 'addressStudent', 'departmentStudent', 'studentSemester', 'studentYear',
      'parentName', 'parentPhone', 'dob', 'bloodgroup', 'Category', 'gender', 'CurrentYear'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  function clearOfficeForm() {
    ['officeName', 'officeId', 'jobRole', 'officeDepartment', 'officeAddress', 'officePhone', 'officeEmail']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
  }

  // --- COUNTERS ---
  async function updateCount() {
    try {
      const res = await fetch('counter.php');
      const data = await res.json();
      if (studentCountDisplay) studentCountDisplay.textContent = data.Scount;
      if (officeCountDisplay) officeCountDisplay.textContent = data.Ocount;
    } catch (err) {
      console.error("Failed to update counts:", err);
    }
  }

async function logout() {
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);

        }

        const data = await response.json();

        if (data.status === 'success') {
            showPopup(data.message);
            window.location.href = 'homepage.html'; // replace with your login page URL
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred. Please try again.');
    }
}

  // --- Approval Section Logic ---
  function closeModals() {
    document.getElementById('approvalModal').style.display = 'none';
    document.getElementById('rejectionModal').style.display = 'none';
  }

  async function loadApprovals() {
    const container = document.getElementById('approvalContainer');
    
    try {
        const response = await fetch('fetch_approvals.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'fetch' }) // you can send any payload if needed
        });

        const result = await response.json();

        if (result.status === 'success' && result.data.length > 0) {
            container.innerHTML = ''; // Clear loading message

            result.data.forEach(req => {
                const card = document.createElement('div');
                card.className = 'approval-card';
                card.innerHTML = `
                    <p><strong>Application ID:</strong> ${req.id}</p>
                    <p><strong>Name:</strong> ${req.name}</p>
                    <p><strong>Department:</strong> ${req.department}</p>
                    <p><strong>Request:</strong> ${req.message}</p>
                    <div class="approval-actions">
                        <button class="approve-btn" data-id="${req.id}">Approve</button>
                        <button class="reject-btn" data-id="${req.id}">Reject</button>
                    </div>
                `;
                container.appendChild(card);
            });

            // Add event listeners
            container.querySelectorAll('.approve-btn').forEach(btn => {
                btn.addEventListener('click', (e) => openApprovalModal(e.target.dataset.id));
            });
            container.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', (e) => openRejectionModal(e.target.dataset.id));
            });

        } else {
            container.innerHTML = '<p>No requests for final approval at the moment.</p>';
        }

    } catch (error) {
        console.error('Error loading approvals:', error);
        container.innerHTML = '<p>Failed to load approval requests.</p>';
    }
}


  function openApprovalModal(requestId) {
    document.getElementById('approvalRequestId').textContent = requestId;
    document.getElementById('approvalModal').dataset.id = requestId;
    document.getElementById('approvalModal').style.display = 'flex';
  }

  function openRejectionModal(requestId) {
    document.getElementById('rejectionRequestId').textContent = requestId;
    document.getElementById('rejectionModal').dataset.id = requestId;
    document.getElementById('rejectionModal').style.display = 'flex';
  }




  async function confirmApproval() {
  const modal = document.getElementById('approvalModal');
  const requestId = modal.dataset.id;
  const fileInput = document.getElementById('certificateFile');

  if (fileInput.files.length === 0) {
    alert('Please select a certificate file to upload.');
    return;
  }

  // Read file as Base64
  const file = fileInput.files[0];
  const base64File = await toBase64(file);

  const payload = {
    action: 'confirm_approval',
    requestId: requestId,
    certificate: {
      name: file.name,
      type: file.type,
      data: base64File
    }
  };

  try {
    const response = await fetch('handle_approvel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') {
      closeModals();
      loadApprovals(); // refresh the list
    }
  } catch (error) {
    console.error('Error confirming approval:', error);
    alert('An error occurred. Please try again.');
  }
}


function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      const base64Data = result.substring(result.indexOf(',') + 1); // remove prefix
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
}



  async function confirmRejection() {
    const modal = document.getElementById('rejectionModal');
    const requestId = modal.dataset.id;
    const reason = document.getElementById('rejectionReason').value.trim();

    if (!reason) {
        alert('Please provide a reason for rejection.');
        return;
    }

    const data = {
        action: 'confirm_rejection',
        requestId: requestId,
        reason: reason
    };

    try {
        const response = await fetch('handle_approvel.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        if (result.status === 'success') {
            closeModals();
            loadApprovals(); // Refresh the list
        }
    } catch (error) {
        console.error('Error confirming rejection:', error);
        alert('An error occurred. Please try again.');
    }
  }
  
  // --- Initial Setup Calls ---
  updateCount();
  loadApprovals();

  // --- Modal Event Listeners ---
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  document.getElementById('confirmApprovalBtn').addEventListener('click', confirmApproval);
  document.getElementById('confirmRejectionBtn').addEventListener('click', confirmRejection);
});
