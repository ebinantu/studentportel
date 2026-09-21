let currentStep = 1;
const totalSteps = 3;
let currentRole = "student";
let otpCountdown;

document.addEventListener("DOMContentLoaded", function () {
    showStep(currentStep);
    updateProgress();

    const studentBtn = document.getElementById("studentBtn");
    if (studentBtn) studentBtn.addEventListener("click", () => switchRole("student"));

    const staffBtn = document.getElementById("staffBtn");
    if (staffBtn) staffBtn.addEventListener("click", () => switchRole("staff"));

    const otpBtn = document.getElementById("otpBtn");
    if (otpBtn) otpBtn.addEventListener("click", Getotp);

    const submit = document.getElementById("submit");
    if (submit) submit.addEventListener("click", submitForm);

    const verifyBtn = document.getElementById("verifyBtn");
    if (verifyBtn) verifyBtn.addEventListener("click", verifyOtp);

    const nextBtnStudent = document.getElementById("nextBtnStudent");
    if (nextBtnStudent) nextBtnStudent.addEventListener("click", nextStep);

    const nextBtnStaff = document.getElementById("nextBtnStaff");
    if (nextBtnStaff) nextBtnStaff.addEventListener("click", nextStep);

    const prevBtn = document.getElementById("prevBtn");
    if (prevBtn) prevBtn.addEventListener("click", previousStep);

    const fullnameInput = document.querySelector('input[name="fullname"]');
    if (fullnameInput) fullnameInput.addEventListener("input", namevalidation);

    const admissionInput = document.querySelector('input[name="admission"]');
    if (admissionInput) admissionInput.addEventListener("input", idNumber); // ✅ FIXED
});

function switchRole(role) {
    const studentBtn = document.getElementById("studentBtn");
    const staffBtn = document.getElementById("staffBtn");
    const studentFields = document.getElementById("studentFields");
    const staffFields = document.getElementById("staffFields");

    currentRole = role;
    document.getElementById("otpTimer").innerText = "";

    if (role === "student") {
        studentFields.style.display = "block";
        staffFields.style.display = "none";
        studentBtn.classList.add("active");
        staffBtn.classList.remove("active");
    } else {
        studentFields.style.display = "none";
        staffFields.style.display = "block";
        staffBtn.classList.add("active");
        studentBtn.classList.remove("active");
    }
}

function nextStep() {
    if (currentStep === 1) {
        if (!namevalidation() || !idNumber()) {
            showPopup(`Please enter valid ${currentRole === "student" ? "Student" : "Staff"} details`);
            return;
        }

        setTimeout(() => {
            currentStep = 2;
            showStep(currentStep);

            const selector = currentRole === "student" ? "#studentStep2" : "#staffStep2";
            document.querySelectorAll(`${selector} input, ${selector} select, ${selector} textarea`)
                .forEach(el => el.disabled = false);
        }, 500);
    } else if (currentStep === 2) {
        const nextBtn = currentRole === "student" ? document.getElementById("nextBtnStudent") : document.getElementById("nextBtnStaff");
        nextBtn.innerHTML = `<span class="spinner"></span>Going To Next Step...`;
        nextBtn.disabled = true;

        setTimeout(() => {
            currentStep = 3;
            showStep(currentStep);
            document.querySelectorAll('#step3 input, #step3 select, #step3 textarea')
                .forEach(el => el.disabled = false);
            nextBtn.innerHTML = "Next Step";
            nextBtn.disabled = false;
        }, 300);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function updateProgress() {
    const progress = document.getElementById("progressStatus");
    const percentage = (currentStep / totalSteps) * 100;
    progress.style.width = percentage + "%";
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));

    if (step === 1) {
        document.getElementById("step1").classList.add("active");
    } else if (step === 2) {
        const step2Id = currentRole === "student" ? "studentStep2" : "staffStep2";
        document.getElementById(step2Id).classList.add("active");
    } else if (step === 3) {
        document.getElementById("step3").classList.add("active");
    }

    updateProgress();
}

function namevalidation() {
    const format = /^[A-Za-z\s]+$/;
    let name;
    let fullnameError;

    if (currentRole === "student") {
        name = document.querySelector('input[name="fullname"]').value.trim();
        fullnameError = document.getElementById("fullname-error");
    } else {
        name = document.querySelector('input[name="staffname"]').value.trim();
        fullnameError = document.getElementById("staffname-error");
    }

    if (name === "") {
        fullnameError.innerHTML = "";
        return false;
    }

    if (!format.test(name)) {
        fullnameError.innerHTML = "(i) Only letters and spaces allowed";
        return false;
    } else {
        fullnameError.innerHTML = "";
        return true;
    }
}

function idNumber() {
    const format = /^[A-Z0-9]+$/;
    let id;
    let idError;

    if (currentRole === "student") {
        id = document.querySelector('input[name="admission"]').value.trim();
        idError = document.getElementById("admissionno-error");
    } else {
        id = document.querySelector('input[name="staffid"]').value.trim();
        idError = document.getElementById("staffid-error");
    }

    if (id === "") {
        idError.innerHTML = "";
        return false;
    }

    if (!format.test(id)) {
        idError.innerHTML = "Only uppercase letters and digits allowed";
        return false;
    } else {
        idError.innerHTML = "";
        return true;
    }
}

function showOtpFields() {
    document.getElementById("otpSection").style.display = "block";
}

function showFileName(input) {
    const fileName = input.files[0] ? input.files[0].name : "No file chosen";
    document.getElementById("fileName").innerText = fileName;
}

function startOtpTimer() {
    const button = document.querySelector(".get-otp-btn");
    const timerDisplay = document.querySelector("#otpTimer");
    let timeLeft = 60;

    if (otpCountdown) clearInterval(otpCountdown);

    if (!button || !timerDisplay) {
        console.error("OTP button or timer display not found");
        return;
    }

    button.disabled = true;

    otpCountdown = setInterval(() => {
        timerDisplay.textContent =
            "wait : " + new Date(timeLeft * 1000).toISOString().substr(14, 5);

        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(otpCountdown);
            otpCountdown = null;
            button.disabled = false;
            timerDisplay.textContent = "";
        }
    }, 1000);
}

async function Getotp() {
    let data = {};

    if (currentRole === "student") {
        let studentname = document.querySelector('input[name="fullname"]').value.trim();
        let admissionno = document.querySelector('input[name="admission"]').value.trim();

        if (studentname === "" || admissionno === "") {
            document.getElementById("otpTimer").innerText = "(i) Please enter Student Name and Admission Number";
            return;
        }

        data = {
            role: "student",
            name: studentname,
            id: admissionno
        };
    } else {
        let staffname = document.querySelector('input[name="staffnameFirst"]').value.trim();
        let staffid = document.querySelector('input[name="staffidFirst"]').value.trim();

        if (staffname === "" || staffid === "") {
            document.getElementById("otpTimer").innerText = "(i) Please enter Staff Name and Staff ID";
            return;
        }

        data = {
            role: "staff",
            name: staffname,
            id: staffid
        };
    }

    document.getElementById("otpTimer").innerText = "";
    showOtpFields();
    startOtpTimer();

    try {
        const response = await fetch("otp.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
            document.getElementById("otpTimer").innerText = "(i) OTP sent successfully. Please check your email.";
        } else {
            showPopup("Failed to send OTP: " + result.message);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        showPopup("Something went wrong, please try again.");
    }
}

async function verifyOtp() {
    let otp = document.getElementById("otp").value.trim();
    if (otp === "") {
        document.getElementById("otp-error").innerText = "(i) Please enter the OTP";
        return;
    } else {
        document.getElementById("otp-error").innerText = "";
    }

    try {
        const response = await fetch("verifyotp.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ otp })
        });

        const result = await response.json();
        if (result.status === 'success') {
            showPopup("OTP verified successfully!");
            datafetch();
        } else {
            document.getElementById("otp-error").innerText = "(i) Invalid OTP, please try again.";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById("otp-error").innerText = "(i) Something went wrong, please try again.";
    }
}

async function datafetch() {
    let data = {
        role: currentRole,
        id: currentRole === "student"
            ? document.querySelector('input[name="admission"]').value.trim()
            : document.querySelector('input[name="staffidFirst"]').value.trim()
    };

    fetch('getdetails.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data) {
                const fields = data.data;

                if (currentRole === "student") {
                    document.querySelector('input[name="name"]').value = fields.fullname || '';
                    document.querySelector('input[name="admissionNO"]').value = fields.admissionNo || '';
                    document.querySelector('input[name="registernumber"]').value = fields.regNo || '';
                    document.querySelector('input[name="department"]').value = fields.department || '';
                    document.querySelector('input[name="year"]').value = fields.CurrentYear || '';
                    document.querySelector('input[name="semester"]').value = fields.sem || '';
                    document.querySelector('input[name="phonenumber"]').value = fields.PhnNo || '';
                    document.querySelector('input[name="email"]').value = fields.email || '';
                    document.querySelector('input[name="Parentname"]').value = fields.ParentName || '';
                    document.querySelector('input[name="ParentPHNO"]').value = fields.ParentPho || '';
                    document.querySelector('textarea[name="address"]').value = fields.address || '';
                } else {
                    document.querySelector('input[name="staffname"]').value = fields.staffname || '';
                    document.querySelector('input[name="staffid"]').value = fields.staffid || '';
                    document.querySelector('input[name="staffrole"]').value = fields.staffrole || '';
                    document.querySelector('input[name="staffdepartment"]').value = fields.department || '';
                    document.querySelector('textarea[name="staffaddress"]').value = fields.address || '';
                    document.querySelector('input[name="staffphone"]').value = fields.PhnNo || '';
                    document.querySelector('input[name="staffemail"]').value = fields.email || '';
                }

                nextStep();
            } else {
                showPopup("No details found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showPopup("Something went wrong, please try again.");
        });
}

function passwordMatch() {
    const password = document.querySelector('input[name="password"]').value;
    const confirm = document.querySelector('input[name="confirm_password"]').value;
    if (password !== confirm) {
        document.getElementById("password-error").innerText = "(i) Passwords do not match";
        return false;
    } else {
        document.getElementById("password-error").innerText = "";
        return true;
    }
}

function photoValidation() {
    const photoInput = document.querySelector('input[name="userphoto"]');
    const file = photoInput.files[0];
    if (!file) {
        document.getElementById("photo-error").innerText = "(i) Please upload a photo";
        return false;
    } else {
        document.getElementById("photo-error").innerText = "";
        return true;
    }
}

async function submitForm() {
    if (!passwordMatch() || !photoValidation()) {
        showPopup("Please fix the errors before submitting.");
        return;
    }

    const id = currentRole === "student"
        ? document.querySelector('input[name="admission"]').value.trim()
        : document.querySelector('input[name="staffid"]').value.trim();

    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const userphoto = document.querySelector('input[name="userphoto"]').files[0];

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const userphotobase64 = await toBase64(userphoto);

    const data = {
        id,
        username,
        password,
        role: currentRole,
        photo: userphotobase64,
        photoName: userphoto.name
    };

    fetch('submitForm.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                showPopup('Registration successful!<br><ion-icon name="checkmark-outline"></ion-icon>');
                window.location.href = "homepage.html";
            } else {
                showPopup("Registration failed: " + result.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showPopup("Something went wrong, please try again.");
        });
}

function showPopup(message) {
    document.getElementById("popupMessage").innerHTML = message;
    document.getElementById("customPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("customPopup").style.display = "none";
}
