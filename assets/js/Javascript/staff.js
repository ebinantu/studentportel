// Global variable to hold the ID of the request currently in the modal
let currentRequestId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup calls when the page is ready
    highlightNav('officeProfileSection');
    updateDepartments(); // From original HTML script block
    profileload();
    loadVerificationQueue();

    // Attach listener for fee registration button
    const registerFeeBtn = document.getElementById('registerFeeBtn');
    if (registerFeeBtn) {
        registerFeeBtn.addEventListener('click', registerFee);
    }
});

// =============================================
// POPUP & MODAL CONTROLS
// =============================================

function showPopup(message) {
    document.getElementById("popupMessage").innerHTML = message;
    document.getElementById("customPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

function openVerificationModal(requestData) {
    // Store the request ID globally for the approve/reject functions
    currentRequestId = requestData.id;

    // Populate the modal fields with data
    document.getElementById('modalRequestId').textContent = requestData.id;
    document.getElementById('modalAdmissionNo').textContent = requestData.admissionNo;
    document.getElementById('modalStudentName').textContent = requestData.name;
    document.getElementById('modalDepartment').textContent = requestData.department;
    document.getElementById('modalCourse').textContent = requestData.course;
    document.getElementById('modalYear').textContent = requestData.year;
    document.getElementById('modalMessage').textContent = requestData.message || 'N/A';
    document.getElementById('modalDoc1').href = requestData.doc1_path || '#';
    document.getElementById('modalDoc2').href = requestData.doc2_path || '#';
    document.getElementById('modalSignature').href = requestData.signature_path || '#';
    
    // Reset the rejection reason field and button text
    document.getElementById('reason-text').value = '';
    document.getElementById('rejection-reason').style.display = 'none';
    const rejectBtn = document.querySelector('.modal-footer .btn-reject');
    rejectBtn.textContent = 'Reject';

    // ATTACH EVENT LISTENERS TO BUTTONS
    const acceptBtn = document.querySelector('.modal-footer .btn-accept');
    
    // Clone and replace buttons to remove any old event listeners
    let newAcceptBtn = acceptBtn.cloneNode(true);
    acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
    newAcceptBtn.addEventListener('click', approveRequest);

    let newRejectBtn = rejectBtn.cloneNode(true);
    rejectBtn.parentNode.replaceChild(newRejectBtn, rejectBtn);
    newRejectBtn.addEventListener('click', showRejection);

    // Display the modal
    document.getElementById('verificationModal').style.display = 'flex';
}

function closeVerificationModal() {
    document.getElementById('verificationModal').style.display = 'none';
    document.getElementById('rejection-reason').style.display = 'none';
    currentRequestId = null; // Clear the stored ID
}

function showRejection() {
    document.getElementById('rejection-reason').style.display = 'block';
    
    // Change the reject button to become the "Submit Rejection" button
    const rejectBtn = document.querySelector('.modal-footer .btn-reject');
    rejectBtn.textContent = 'Submit Rejection';

    // Clone and replace to update its event listener
    let newRejectBtn = rejectBtn.cloneNode(true);
    rejectBtn.parentNode.replaceChild(newRejectBtn, rejectBtn);
    newRejectBtn.addEventListener('click', rejectRequest);
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('verificationModal');
    if (event.target == modal) {
      closeVerificationModal();
    }
};

// =============================================
// API CALLS & DATA HANDLING
// =============================================

/**
 * Logs the user out.
 */
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
            window.location.href = 'login.html'; // replace with your login page URL
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred. Please try again.');
    }
}

/**
 * Loads the staff profile data.
 */
async function profileload() {
    fetch('fetchProfile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'role': 'staff'})
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == 'success') {
          const staff = data.data;
          console.log(staff);
          document.getElementById('popupPic').src = staff.profile_pic;
          document.getElementById('profilePic').src = staff.profile_pic;
          document.getElementById('ProfileSectionPic').src = staff.profile_pic;
          document.getElementById('staffNameText').innerText = staff.staffname;
          document.getElementById('staffidText').innerText = staff.staffid;
          document.getElementById('staffroleText').innerText = staff.staffrole;
          document.getElementById('departmentText').innerText = staff.department;
          document.getElementById('staffName').value = staff.staffname;
          document.getElementById('staffid').value = staff.staffid;
          document.getElementById('staffrole').value = staff.staffrole;
          document.getElementById('department').value = staff.department;
          document.getElementById('phoneNumber').value = staff.PhnNo;
          document.getElementById('staffemail').value = staff.email;
          document.getElementById('staffaddress').value = staff.address;
        } else {
            showPopup(data.message);
        }
    })
    .catch(error => console.error('Error loading profile:', error));
}

/**
 * Fetches and displays the list of pending certificate requests.
 */
async function loadVerificationQueue() {
    const container = document.getElementById('verificationQueueContainer');
    try {
        const response = await fetch('fetch_requests.php');
        const data = await response.json();

        if (data.status === 'success' && data.data.length > 0) {
            container.innerHTML = ''; 
            data.data.forEach(request => {
                const card = document.createElement('div');
                card.className = 'verification-card';
                card.innerHTML = `
                    <div class="card-details">
                        <p><strong>Request ID:</strong> ${request.id}</p>
                        <p><strong>Student Name:</strong> ${request.name}</p>
                        <p><strong>Admission No:</strong> ${request.admissionNo}</p>
                        <p><strong>Department:</strong> ${request.department}</p>
                    </div>
                    <div class="card-actions">
                        <button class="view-btn">View Details</button>
                    </div>
                `;
                const viewBtn = card.querySelector('.view-btn');
                viewBtn.addEventListener('click', () => openVerificationModal(request));
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p>No pending certificate requests at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching verification requests:', error);
        container.innerHTML = '<p>Could not load verification requests. Please try again later.</p>';
    }
}

/**
 * Handles the approval of a certificate request.
 */
async function approveRequest() {
    if (!currentRequestId) return;

    const response = await fetch('update_request_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requestId: currentRequestId,
            action: 'verify'
        })
    });
    const result = await response.json();
    showPopup(result.message);

    if (result.status === 'success') {
        closeVerificationModal();
        loadVerificationQueue(); // Refresh the list
    }
}

/**
 * Handles the rejection of a certificate request.
 */
async function rejectRequest() {
    if (!currentRequestId) return;
    const reason = document.getElementById('reason-text').value.trim();

    if (!reason) {
        showPopup('Please provide a reason for rejection.');
        return;
    }

    const response = await fetch('update_request_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requestId: currentRequestId,
            action: 'reject',
            reason: reason
        })
    });
    const result = await response.json();
    showPopup(result.message);

    if (result.status === 'success') {
        closeVerificationModal();
        loadVerificationQueue(); // Refresh the list
    }
}

/**
 * Submits the fee registration form.
 */
async function registerFee() {
  const selectedType = document.querySelector('input[name="feeRegType"]:checked').value;
  let feeData = {};
  let missingFields = [];
  if (selectedType === 'college') {

    const fileinput = document.getElementById("collegeFeeStructure");
    const file = fileinput.files[0];
    if(!file)
    {
        showPopup("Please Add Fee Structure");
        return;
    }
    const base64 = await fileToBase64(file);

    // Prepare JSON
    const fileData = {
        fileName: file.name,
        fileType: file.type,
        FileData: base64
    };

    feeData = {
      type: 'college',
      title: document.getElementById('feeTitle').value.trim(),
      department: document.getElementById('collegeDepts').value.trim(),
      semester: document.getElementById('collegeSemester').value.trim(),
      year: document.getElementById('collegeYear').value.trim(),
      category: document.getElementById('collegeCategory').value.trim(),
      amount: document.getElementById('collegeAmount').value.trim(),
      lastDate: document.getElementById('collegeLastDate').value.trim(),
      StructureFile: fileData
    };

   
    if (!feeData.title) missingFields.push('Fee Title');
    if (!feeData.department) missingFields.push('Department');
    if (!feeData.year) missingFields.push('Year');
    if (!feeData.amount) missingFields.push('Amount');
    if (!feeData.lastDate) missingFields.push('Last Date');

  } else if (selectedType === 'exam') {


    const fileinput = document.getElementById("examFeeStructure");
    const file = fileinput.files[0];
    if(!file)
    {
        showPopup("Please Add Fee Structure");
        return;
    }
    const base64 = await fileToBase64(file);

    // Prepare JSON
    const fileData = {
        fileName: file.name,
        fileType: file.type,
        FileData: base64
    };
    
    feeData = {
      type: 'exam',
      examId: document.getElementById('examId').value.trim(),
      examName: document.getElementById('examName').value.trim(),
      department: document.getElementById('examDept').value.trim(),
      semester: document.getElementById('examSemester').value.trim(),
      category: document.getElementById('examCategory').value.trim(),
      amount: document.getElementById('examAmount').value.trim(),
      dueDate: document.getElementById('examDueDate').value.trim(),
      StructureFile: fileData
    };

    // Validation rules
    if (!feeData.examId) missingFields.push('Exam ID');
    if (!feeData.examName) missingFields.push('Exam Name');
    if (!feeData.department) missingFields.push('Department');
    if (!feeData.amount) missingFields.push('Amount');
    if (!feeData.dueDate) missingFields.push('Due Date');
  }

  //  Check for missing fields
  if (missingFields.length > 0) {
    showPopup("Please fill the following fields:\n\n" + missingFields.join('\t\t,\t\t'));
    return;
  }

  fetch('regFee.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feeData)
  })
  .then(res => res.json())
  .then(data => {
    if(data.status == "good")
    showPopup(data.message);
    else 
    showPopup(data.message)
  })
  .catch(err => console.error('Error:', err));
};

/**
 * Sends a notification.
 */
function Notification() { 
    const title = document.getElementById('notificationTitle').value;
    const dept = document.getElementById('specificdept').value;
    const message = document.getElementById('notificationMessage').value;

    let data = {
        title: title,
        department: dept,
        message: message
    };  
console.log(data);
  fetch("notification.php", {
    method: "POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Notification sent successfully!");
        document.getElementById('notificationTitle').value = '';
        document.getElementById('specificdept').value = '';
        document.getElementById('notificationMessage').value = '';
      } else {
        alert("Failed to send notification. Please try again.");
      }
    })
   }

/**
 * Converts a file to a Base64 string.
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); 
        reader.onerror = error => reject(error);
    });
}