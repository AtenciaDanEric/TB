document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      resetPassword();
  });
});

function sendOTP() {
  let doctorId = prompt("Enter your Doctor ID to receive an OTP:");
  if (!doctorId) return;

  fetch("http://127.0.0.1:5000/send_otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id: doctorId })
  })
  .then(response => response.json())
  .then(data => alert(data.message || data.error))
  .catch(error => console.error("Error:", error));
}

function resetPassword() {
  let doctorId = prompt("Enter your Doctor ID:");
  let otp = document.getElementById("otp").value;
  let newPassword = document.getElementById("new-password").value;
  let confirmPassword = document.getElementById("confirm-password").value;

  if (!otp || !newPassword || !confirmPassword) {
      alert("All fields are required!");
      return;
  }
  
  if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  fetch("http://127.0.0.1:5000/reset_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id: doctorId, otp: otp, new_password: newPassword })
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message || data.error);
      if (data.message) window.location.href = "Doctor-Login.html";
  })
  .catch(error => console.error("Error:", error));
}
