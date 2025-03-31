document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent page reload

    let doctorId = document.getElementById("doctor-id").value;
    let password = document.getElementById("password").value;

    if (!doctorId || !password) {
        alert("Doctor ID and Password are required!");
        return;
    }

    let loginData = {
        doctor_id: doctorId,
        password: password
    };

    fetch("http://127.0.0.1:5000/doctor_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = "doctor-dashboard.html";  // Redirect to dashboard
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Error:", error));
});
