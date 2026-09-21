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
      // De-structure the text content to handle "Office Staffs"
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
    if (activeSection) {
      activeSection.classList.add('active');
    }

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

  window.showForm = function(type) { // Assign to window to be accessible from HTML onclick
    hideForms();
    const form = document.getElementById(type + "Form");
    if (form) {
      form.style.display = 'block';
    }
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
    semesterSelect.innerHTML = '<option value="" disabled selected>Semester</option>'; // Reset

    switch (selectedYear) {
      case '1': semesterSelect.innerHTML += '<option value="1">Semester 1</option><option value="2">Semester 2</option>'; break;
      case '2': semesterSelect.innerHTML += '<option value="3">Semester 3</option><option value="4">Semester 4</option>'; break;
      case '3': semesterSelect.innerHTML += '<option value="5">Semester 5</option><option value="6">Semester 6</option>'; break;
      case '4': semesterSelect.innerHTML += '<option value="7">Semester 7</option><option value="8">Semester 8</option>'; break;
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

  // --- Form Validation ---
  function validateStudent() {
    // Placeholder for your detailed validation logic
    console.log("Validating student...");
    addStudent();
  }

  function validateOffice() {
    // Placeholder for your detailed validation logic
    console.log("Validating office staff...");
    addOffice();
  }

  // --- Data Submission (Fetch API) ---
  function addStudent() {
    // Placeholder for your data gathering and fetch call
    alert("Add Student function called.");
  }

  function addOffice() {
    // Placeholder for your data gathering and fetch call
    alert("Add Office Staff function called.");
  }

  // --- Utility Functions ---
  async function updateCounts() {
    try {
      const response = await fetch('counter.php'); // Assuming you have a counter.php
      const data = await response.json();
      if (studentCountDisplay) studentCountDisplay.textContent = data.Scount;
      if (officeCountDisplay) officeCountDisplay.textContent = data.Ocount;
    } catch (error) {
      console.error("Failed to update counts:", error);
    }
  }

  function logout() {
    alert("Logged out!");
    // Example: window.location.href = 'login.html';
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
    const response = await fetch('handle_approval.php', {
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
        const response = await fetch('handle_approval.php', {
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
  updateCounts();
  loadApprovals();

  // --- Modal Event Listeners ---
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  document.getElementById('confirmApprovalBtn').addEventListener('click', confirmApproval);
  document.getElementById('confirmRejectionBtn').addEventListener('click', confirmRejection);
});