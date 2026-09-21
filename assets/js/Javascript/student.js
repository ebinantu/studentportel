document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors for Modals ---
    const detailsOverlay = document.getElementById('detailsOverlay');
    const feeDetailsModal = document.getElementById('feeDetailsModal');
    const closeDetailsModalBtn = document.getElementById('closeDetailsModal');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    
    // --- Initial Data Loading ---
    profileload();
    
    // --- New Functions to Manage the Fee Details Modal ---
    function showFeeDetailsModal(details) {
        // Populate the modal with fee details
        document.getElementById('detailFeeTitle').textContent = details.feeTitle;
        document.getElementById('detailStudentName').textContent = details.studentName;
        document.getElementById('detailDepartment').textContent = details.department;
        document.getElementById('detailAmount').textContent = parseFloat(details.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

        if (detailsOverlay && feeDetailsModal) {
            detailsOverlay.style.display = 'block';
            feeDetailsModal.style.display = 'block';
        }

        // Assign the click event handler here, where 'details' is in scope.
        if (proceedToPaymentBtn) {
            proceedToPaymentBtn.onclick = () => {
                hideFeeDetailsModal(); // Close the details modal
                // Pass the necessary details to the payment modal function
                showPaymentModal(details.studentId, details.feeId);
            };
        }
    }

    function hideFeeDetailsModal() {
        if (detailsOverlay && feeDetailsModal) {
            detailsOverlay.style.display = 'none';
            feeDetailsModal.style.display = 'none';
        }
    }

    // --- Event Listeners for the Fee Details Modal ---
    if (closeDetailsModalBtn) closeDetailsModalBtn.addEventListener('click', hideFeeDetailsModal);
    if (detailsOverlay) detailsOverlay.addEventListener('click', hideFeeDetailsModal);

    // --- Section for Navigation, Profile Card, etc. ---
    const sections = document.querySelectorAll('.section');
    const courseMessage = document.getElementById("courseMessage");
    const profilePic = document.getElementById('profilePicheader');
    const profileCard = document.getElementById('profileCard');
    const closeBtn = document.getElementById('closeBtn');

    if (courseMessage) {
        courseMessage.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
        });
    }

    function showSection(id) {
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
        }
    }

    function highlightMenu(item) {
        document.querySelectorAll('.submenu li').forEach(li => li.classList.remove('active-menu'));
        if (item) {
            item.classList.add('active-menu');
        }
    }

    document.querySelectorAll('nav ul > li[data-section]').forEach(item => {
        item.addEventListener('click', () => {
            showSection(item.dataset.section);
            highlightMenu(null);
        });
    });

    document.querySelectorAll('.submenu li[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            showSection(item.dataset.section);
            highlightMenu(item);
        });
    });

    document.querySelectorAll('li.has-submenu[data-default]').forEach(parent => {
        parent.addEventListener('click', (e) => {
            if (e.target.closest('.submenu')) return;
            showSection(parent.dataset.default);
            const defaultItem = parent.querySelector(`.submenu li[data-section="${parent.dataset.default}"]`);
            highlightMenu(defaultItem);
        });
    });

    if (profilePic) {
        profilePic.addEventListener('click', () => {
            profileCard.classList.toggle('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            profileCard.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (profileCard && profilePic && !profileCard.contains(e.target) && e.target !== profilePic) {
            profileCard.classList.remove('active');
        }
    });

    // --- Section for Certificate Status Bar ---
    const statusDisplay = document.getElementById('status-display');
    const checkStatusBtn = document.getElementById('checkStatusBtn');

    if (checkStatusBtn) {
        checkStatusBtn.addEventListener('click', async () => {
            const appId = document.getElementById('applicationid').value.trim();
            if (!appId) {
                showPopup("Please enter an Application ID.");
                return;
            }
            
            const messageTitle = document.getElementById('message-title');
            const messageDescription = document.getElementById('message-description');
            messageTitle.textContent = "Checking Status...";
            messageDescription.textContent = "Please wait a moment.";
            statusDisplay.style.display = 'block';

            try {
                const response = await fetch('getstatus.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ applicationId: appId })
                });
                const result = await response.json();

                if (result.success) {
                    updateUI(result.data);
                } else {
                    document.querySelectorAll('.stage').forEach(stage => stage.classList.remove('completed', 'active', 'rejected'));
                    messageTitle.textContent = "Error";
                    messageDescription.textContent = result.message || "Could not retrieve status.";
                    document.getElementById('download-btn').style.display = 'none';
                }
            } catch (error) {
                console.error('Error fetching status:', error);
                messageTitle.textContent = "Connection Error";
                messageDescription.textContent = "Could not connect to the server. Please try again later.";
            }
        });
    }

    // --- Section for Faculty Communication ---
    const enquiryBtn = document.getElementById('enquiryBtn');
    const formContainer = document.getElementById('formContainer');
    const facultyItems = document.querySelectorAll('.faculty-item');
    const emailInput = document.querySelector('#departmentemail');
    const slider = document.querySelector('.faculty-list');

    if (enquiryBtn) {
        enquiryBtn.addEventListener('click', () => {
            const isVisible = formContainer.classList.toggle('visible');
            enquiryBtn.innerHTML = isVisible ? '<ion-icon name="close-outline"></ion-icon>Close Form' : '<ion-icon name="mail-outline"></ion-icon>Make an Enquiry';
            if (isVisible) formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    facultyItems.forEach(item => {
        item.addEventListener('click', () => {
            emailInput.value = item.dataset.email;
            if (!formContainer.classList.contains('visible')) {
                enquiryBtn.click();
            } else {
                emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            emailInput.focus();
        });
    });

    if (slider) {
        let isDown = false, startX, scrollLeft;
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        ['mouseleave', 'mouseup'].forEach(event => slider.addEventListener(event, () => {
            isDown = false;
            slider.classList.remove('active');
        }));
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            slider.scrollLeft = scrollLeft - (x - startX) * 2;
        });
    }

    // --- Section for Payment Modal ---
    const paymentOverlay = document.getElementById('paymentOverlay');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModalBtn = document.getElementById('closePaymentModal');
    const qrConfirmBtn = document.getElementById('qrConfirmBtn');

    window.showPaymentModal = function(studentId, feeId) {
        console.log(`Opening payment modal for Student ID: ${studentId}, Fee ID: ${feeId}`);
        
        if(qrConfirmBtn) {
            qrConfirmBtn.dataset.studentId = studentId;
            qrConfirmBtn.dataset.feeId = feeId;
        }

        const upiConfirmInput = document.getElementById('upiIdConfirm');
        if (upiConfirmInput) {
            upiConfirmInput.value = '';
        }

        if (paymentOverlay && paymentModal) {
            paymentOverlay.style.display = 'block';
            paymentModal.style.display = 'block';
        }
    }

    window.hidePaymentModal = function() {
        if (paymentOverlay && paymentModal) {
            paymentOverlay.style.display = 'none';
            paymentModal.style.display = 'none';
        }
    }

    if (closePaymentModalBtn) closePaymentModalBtn.addEventListener('click', hidePaymentModal);
    if (paymentOverlay) paymentOverlay.addEventListener('click', hidePaymentModal);
    
    if (qrConfirmBtn) {
        qrConfirmBtn.addEventListener('click', processPaymentConfirmation);
    }
    
    const courseBtn = document.getElementById('courseSubmit');
    if (courseBtn) {
        courseBtn.addEventListener('click', () => submitCourseRequest());
    }





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                      //EXAM REGSITER///
                
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     const registerExamBtn = document.getElementById('registerExamBtn') || document.querySelector('.edit-btn');
    const examConfirmBtn = document.getElementById('examConfirmBtn');

    // --- Register Exam Button ---
    if (registerExamBtn) {
        registerExamBtn.addEventListener('click', async () => {
            const studentName = document.getElementById('examStudentName').value.trim();
            const studentId= document.getElementById('AdmissionNO').value.trim();
            const rollno = document.getElementById('examRollNumber').value.trim();
            const examCode = document.getElementById('examCode').value.trim();
            const examName = document.getElementById('examCourse').value.trim();
            const department = document.getElementById('examDepartment').value.trim();
            const semester = document.getElementById('examSemester').value.trim();
            const amount = await getExamAmount(studentId,examCode);

            if (!examCode) {
                showPopup("Please enter an Exam Code before registering.");
                return;
            }

            // --- Collect only course codes ---
            const courseEntries = document.querySelectorAll('.course-entry');
            const courseCodes = [];
            courseEntries.forEach((entry, index) => {
                const code = entry.querySelectorAll('input')[0].value.trim(); // first input = code
                if (code) courseCodes.push({ [`course${index + 1}`]: code });
            });

            // --- Prepare exam details ---
            const examDetails = {
                studentName,
                studentId,
                rollno,
                examName,
                examCode,
                department,
                semester,
                amount,
                courses: courseCodes
            };

            if (examConfirmBtn) {
                examConfirmBtn.dataset.examDetails = JSON.stringify(examDetails);
            }

            showExamPaymentModal(examDetails); // show modal
        });
    }

    // --- Confirm Exam Payment ---
    if (examConfirmBtn) {
        examConfirmBtn.addEventListener('click', processExamPayment);
    }

    // --- Close Modal when overlay or close button clicked ---
    const examPaymentOverlay = document.getElementById('examPaymentOverlay');
    const closeExamPaymentModalBtn = document.getElementById('closeExamPaymentModal');
    if (examPaymentOverlay) examPaymentOverlay.addEventListener('click', hideExamPaymentModal);
    if (closeExamPaymentModalBtn) closeExamPaymentModalBtn.addEventListener('click', hideExamPaymentModal);




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


});




async function processPaymentConfirmation(event) {
    const button = event.target;
    const studentId = button.dataset.studentId;
    const feeId = button.dataset.feeId;
    const upiId = document.getElementById('upiIdConfirm').value.trim();

    if (!upiId) {
        showPopup("Please enter your UPI ID for confirmation.");
        return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
        showPopup("Please enter a valid UPI ID format (e.g., yourname@bank).");
        return;
    }

    try {
        const response = await fetch('confirmPayment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: studentId,
                feeId: feeId,
                upiId: upiId
            })
        });

        const result = await response.json();

        if (result.success) {
            hidePaymentModal();
            showPopup("✅ Payment confirmed successfully!");
            loadFeeNotifications();
        } else {
            showPopup("⚠️ Error: " + (result.message || "Could not confirm payment."));
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        showPopup("❌ Failed to connect to the server. Please try again later.");
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

async function loadFeeNotifications() {
    const feeListContainer = document.getElementById('feeNotificationList');
    const noFeesMessage = document.getElementById('noFeesMessage');
    const studentId = document.getElementById('admissionNo').value.trim();

    if (!studentId) {
        console.error('Student Admission Number not found.');
        noFeesMessage.innerText = 'Could not identify student. Please refresh the page.';
        noFeesMessage.style.display = 'block';
        if(feeListContainer) feeListContainer.style.display = 'none';
        return;
    }

    try {
        const response = await fetch('getStudentCollegeFees.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const feeData = await response.json();
        feeListContainer.innerHTML = ''; // Clear old fee items

        if (!feeData || feeData.length === 0) {
            noFeesMessage.innerText = "You have no pending fees. 🎉";
            noFeesMessage.style.display = 'block';
            feeListContainer.style.display = 'none';
            return;
        }

        noFeesMessage.style.display = 'none';
        feeListContainer.style.display = 'flex';

        feeData.forEach(fee => {
            const formattedAmount = parseFloat(fee.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
            const formattedDate = fee.lastdate ? new Date(fee.lastdate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

            const feeItem = document.createElement('div');
            feeItem.className = 'notification-item fee-item';
            feeItem.innerHTML = `
                <div class="fee-item-details">
                    <p class="notification-title">${fee.feename}</p>
                    <p class="fee-meta"><strong>Last Date:</strong> ${formattedDate}</p>
                    <p class="fee-meta"><strong>Amount:</strong> ${formattedAmount}</p>
                </div>
                <div class="fee-item-action">
                    <button class="pay-fee-btn"
                        data-fee-id="${fee.id}"
                        data-student-id="${studentId}"
                        data-amount="${fee.amount}"
                        data-fee-title="${fee.feename}"
                        data-student-name="${document.getElementById('fullName').value.trim()}"
                        data-department="${document.getElementById('department').value.trim()}">
                        Pay Now
                    </button>
                </div>`;
            feeListContainer.appendChild(feeItem);
        });

        // Event delegation for dynamic Pay Now buttons
        feeListContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('pay-fee-btn')) {
                const button = event.target;
                const feeDetails = {
                    feeId: button.dataset.feeId,
                    studentId: button.dataset.studentId,
                    amount: button.dataset.amount,
                    feeTitle: button.dataset.feeTitle,
                    studentName: button.dataset.studentName,
                    department: button.dataset.department
                };
                showFeeDetailsModal(feeDetails); // Show fee details modal
            }
        });

    } catch (error) {
        console.error('Error loading fee data:', error);
        noFeesMessage.innerText = 'Could not load fee information. Please try again later.';
        noFeesMessage.style.display = 'block';
        if(feeListContainer) feeListContainer.style.display = 'none';
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////


function updateUI(currentStageData) {
    const currentStage = currentStageData.stage;
    const currentStatus = currentStageData.status;
    const messageTitle = document.getElementById('message-title');
    const messageDescription = document.getElementById('message-description');
    const downloadBtn = document.getElementById('download-btn');
    const stageOrder = ['Requested', 'Verified', 'Approved'];
    const stageElements = {
        Requested: document.querySelector('.stage[data-stage-name="requested"]'),
        Verified: document.querySelector('.stage[data-stage-name="verified"]'),
        Approved: document.querySelector('.stage[data-stage-name="approved"]')
    };

    for (const key in stageElements) {
        if (stageElements[key]) {
            stageElements[key].className = 'stage';
        }
    }

    if (currentStatus === 'rejected') {
        const rejectedStageIndex = stageOrder.indexOf(currentStage);
        for (let i = 0; i < rejectedStageIndex; i++) {
            if (stageElements[stageOrder[i]]) {
                stageElements[stageOrder[i]].classList.add('completed');
            }
        }
        if (stageElements[currentStage]) {
            stageElements[currentStage].classList.add('rejected');
        }
    } else {
        const currentIndex = stageOrder.indexOf(currentStage);
        for (let i = 0; i <= currentIndex; i++) {
            if (stageElements[stageOrder[i]]) {
                stageElements[stageOrder[i]].classList.add('completed');
            }
        }
        if (currentIndex < stageOrder.length - 1) {
            const nextStage = stageOrder[currentIndex + 1];
            if (stageElements[nextStage]) {
                stageElements[nextStage].classList.add('active');
            }
        }
    }

    const statusLabels = { approved: "Approved", rejected: "Rejected", pending: "In Progress" };
    if (messageTitle) messageTitle.textContent = "Status: " + (statusLabels[currentStatus] || currentStatus);
    if (messageDescription) messageDescription.textContent = currentStageData.message || "";

    const isFullyApproved = currentStage === 'Approved' && currentStatus === 'approved';
    if (downloadBtn) {
        if (isFullyApproved && currentStageData.filepath) {
            downloadBtn.style.display = 'inline-block';
            downloadBtn.onclick = () => window.open(currentStageData.filepath, '_blank');
        } else {
            downloadBtn.style.display = 'none';
        }
    }
}

async function profileload() {
    try {
        const response = await fetch('fetchProfile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'role': 'student'})
        });
        
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const data = await response.json();

        if (data.status === 'success') {
            const studentData = data.data;
            document.getElementById('popupPic').src = studentData.profilePic;
            document.getElementById('profilePicheader').src = studentData.profilePic;
            document.getElementById('studentNameText').innerText = studentData.fullname;
            document.getElementById("registerNoText").innerText = studentData.regNo;
            document.getElementById("admissionNoText").innerText = studentData.admissionNo;
            document.getElementById("departmentText").innerText = studentData.department;
            document.getElementById("semesterText").innerText = studentData.semester;
            document.getElementById("fullName").value = studentData.fullname;
            document.getElementById("registerNo").value = studentData.regNo;
            document.getElementById("admissionNo").value = studentData.admissionNo;
            document.getElementById("department").value = studentData.department;
            document.getElementById("joinedDate").value = studentData.joinedDate;
            document.getElementById("semester").value = studentData.semester;
            document.getElementById("email").value = studentData.email;
            document.getElementById("phone").value = studentData.PhnNo;
            document.getElementById("dob").value = studentData.dob;
            document.getElementById("gender").value = studentData.gender;
            document.getElementById("category").value = studentData.category;
            document.getElementById("parentName").value = studentData.ParentName;
            document.getElementById("parentPhone").value = studentData.ParentPhone;
            document.getElementById("address").value = studentData.address;
            document.getElementById("ProfilePic").src = studentData.profilePic;
            loadFeeNotifications();
            loadGeneralNotifications();
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

async function submitCourseRequest() {
    const admissionNo = document.getElementById("AdmissionNO").value.trim();
    const name = document.getElementById("Name").value.trim();
    const department = document.getElementById("Department").value.trim();
    const course = document.getElementById("Course").value.trim();
    const year = document.getElementById("Year").value.trim();
    const message = document.getElementById("courseMessage").value.trim();
    const signatureFile = document.getElementById("uploadFile").files[0];
    const doc1File = document.getElementById("uploadFile1").files[0];
    const doc2File = document.getElementById("uploadFile2").files[0];
    const mailid = document.getElementById('email').value.trim();
    
    let errors = [];
    if (!admissionNo) errors.push("Admission Number is required.");
    if (!name) errors.push("Name is required.");
    if (!department) errors.push("Department is required.");
    if (!course) errors.push("Course Name is required.");
    if (!year) errors.push("Current Year is required.");
    if (!message) errors.push("Request Message cannot be empty.");
    if (!signatureFile) errors.push("Signature upload is required.");

    if (errors.length > 0) {
        alert("Please correct the following:\n\n" + errors.join("\n"));
        return;
    }

    async function prepareFileData(file) {
        if (!file) return null;
        const base64 = await fileToBase64(file);
        return {
            fileName: file.name,
            fileType: file.type,
            FileData: base64
        };
    }

    const signature = await prepareFileData(signatureFile);
    const document1 = await prepareFileData(doc1File);
    const document2 = await prepareFileData(doc2File);

    const requestData = {
        admissionNo, mailid, name, department, course, year,
        message, signature, document1, document2
    };

    try {
        const response = await fetch("coursecertificate.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();

        if (result.success) {
            alert("✅ Course certificate request submitted successfully!");
            document.querySelectorAll("#courseRequestSection input, #courseRequestSection textarea, #courseRequestSection select").forEach(el => el.value = "");
        } else {
            alert("⚠️ Error: " + (result.message || "Could not submit request."));
        }
    } catch (error) {
        console.error("Error submitting request:", error);
        alert("❌ Failed to connect to the server. Please try again later.");
    }
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

function showPopup(message) {
    document.getElementById("popupMessage").innerHTML = message;
    document.getElementById("customPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}

async function loadGeneralNotifications() {
    const notificationList = document.getElementById('generalNotificationList');
    const noNotificationsMsg = document.getElementById('noGeneralNotificationsMessage');
    const department = document.getElementById("department").value.trim();
    try {
        const response = await fetch("fetchgeneralnotification.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ department: department })
        });
        const notifications = await response.json();
        notificationList.innerHTML = '';

        if (!notifications || notifications.length === 0) {
            noNotificationsMsg.style.display = 'block';
            notificationList.style.display = 'none';
        } else {
            noNotificationsMsg.style.display = 'none';
            notificationList.style.display = 'flex';
            notifications.forEach(notification => {
                const item = document.createElement('div');
                item.className = 'notification-item';
                item.innerHTML = `
                    <div class="notification-content">
                        <p class="notification-title">${notification.title}</p>
                        <p class="notification-meta"><strong>For:</strong> ${notification.department}</p>
                        <p class="notification-message">${notification.message}</p>
                        <p class="notification-time">${notification.created_at}</p>
                    </div>
                `;
                notificationList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading general notifications:', error);
        noNotificationsMsg.innerText = 'Could not load notifications. Please try again later.';
        noNotificationsMsg.style.display = 'block';
        notificationList.style.display = 'none';
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                       //    EXAMREGISTERATION ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// --- Show Modal ---

function showExamPaymentModal(details) {
    // Populate modal fields
    document.getElementById('examPayStudentName').textContent = details.studentName;
    document.getElementById('examPayExamName').textContent = `${details.examName} (${details.examCode})`;
    document.getElementById('examPayAmount').textContent = parseFloat(details.amount)
        .toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    // Clear UPI input
    const upiInput = document.getElementById('examUpiIdConfirm');
    if (upiInput) upiInput.value = '';

    // ✅ Store entire exam details JSON for later use in processExamPayment
    const examConfirmBtn = document.getElementById('examConfirmBtn');
    if (examConfirmBtn) {
        examConfirmBtn.dataset.details = JSON.stringify(details);
    }

    // Show modal
    const examPaymentOverlay = document.getElementById('examPaymentOverlay');
    const examPaymentModal = document.getElementById('examPaymentModal');
    if (examPaymentOverlay && examPaymentModal) {
        examPaymentOverlay.style.display = 'block';
        examPaymentModal.style.display = 'block';
    }
}


// --- Hide Modal ---
function hideExamPaymentModal() {
    const examPaymentOverlay = document.getElementById('examPaymentOverlay');
    const examPaymentModal = document.getElementById('examPaymentModal');
    if (examPaymentOverlay && examPaymentModal) {
        examPaymentOverlay.style.display = 'none';
        examPaymentModal.style.display = 'none';
    }
}

// --- Process Payment & Send to Server ---
async function processExamPayment(event) {
    const button = event.target;
    const upiId = document.getElementById('examUpiIdConfirm').value.trim();

    if (!upiId) {
        showPopup("Please enter your UPI ID to proceed.");
        return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiId)) {
        showPopup("Please enter a valid UPI ID format (e.g., yourname@bank).");
        return;
    }

    // ✅ Retrieve the full details object
    const examDetails = JSON.parse(button.dataset.details);
    examDetails.upiId = upiId; // Add the UPI ID now

    try {
        const response = await fetch('confirmexampayment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(examDetails) // ✅ Send entire details
        });

        const result = await response.json();

        if (result.success) {
            hideExamPaymentModal();
            showPopup("✅ Exam registration payment confirmed!");
        } else {
            showPopup("⚠️ Error: " + (result.message || "Could not confirm payment."));
        }
    } catch (error) {
        console.error('Error confirming exam payment:', error);
        showPopup("❌ Failed to connect to the server.");
    }
}

async function getExamAmount(studentId, examCode) {
    try {
        const response = await fetch('getExamAmount.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: studentId, examCode: examCode })
        });

        const result = await response.json();
        return result.amount || 0; // fallback to 0 if not returned
    } catch (error) {
        console.error('Failed to fetch exam amount', error);
        return 0;
    }
}
