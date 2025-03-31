function dischargePatient() {
    document.getElementById("popup").style.display = "block";
}

function confirmDischarge(isConfirmed) {
    if (isConfirmed) {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) {
            console.error("No patient ID found.");
            return;
        }

        // Send POST request to backend to update status
        fetch(`http://127.0.0.1:5000/discharge_patient/${id}`, {
            method: "POST",
        })
        .then(response => {
            if (!response.ok) throw new Error("Discharge failed");
            return response.json();
        })
        .then(data => {
            alert("Patient successfully discharged.");
            window.location.href = "Current-Patients.html"; // redirect after discharge
        })
        .catch(error => {
            console.error("Error during discharge:", error);
            alert("Something went wrong.");
        });
    }

    closePopup();
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
