document.querySelector(".save-btn").addEventListener("click", function () {
    let doctorId = document.getElementById("doctor-id").value;
    let name = document.getElementById("doctor-name").value;
    let licenseNo = document.getElementById("license-no").value;
    let department = document.getElementById("department").value;
    let password = document.getElementById("new-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (!doctorId || !name || !licenseNo || !department || !password) {
        alert("All fields are required!");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let doctorData = {
        doctor_id: doctorId,
        name: name,
        license_no: licenseNo,
        department: department,
        password: password
    };

    fetch("http://127.0.0.1:5000/save_doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
    })
    .catch(error => console.error("Error:", error));
});
