async function checkLogin() {
  const res = await fetch("login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "checkLogin" }),
  });

  const data = await res.json();

  if (data.status === "success") {
    if (data.role === "student") {
      location.href = "student.html";
    } else if (data.role === "staff") {
      location.href = "staff.html";
    } else if (data.role === "admin") {
      location.href = "admin.html";
    }
  } else {
    location.href = "login.html";
  }
}

checkLogin();
