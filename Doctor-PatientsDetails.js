document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get("patient") || "Patient";
    document.getElementById("form-title").innerText = `${patientId}’S DETAILS`;
});
