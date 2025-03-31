function fetchPatientDetails() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        console.error("No patient ID found in URL.");
        return;
    }

    fetch(`http://127.0.0.1:5000/get_patient/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(patient => {
            if (patient.error) {
                console.warn("Patient not found:", patient.error);
                document.getElementById("patient-info").innerText = "Patient not found.";
                return;
            }

            // ✅ Format DOB: mm/dd/yyyy, hh:mm AM/PM
            const dob = new Date(patient.dob);
            const formattedDOB = dob.toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            // ✅ Gestational Age with unit fallback
            const gestationalAge = patient.gestational_unit
                ? `${patient.gestational_age} ${patient.gestational_unit}`
                : `${patient.gestational_age}`;

            // ✅ Set input values
            document.getElementById("patient_name").value = patient.name;
            document.getElementById("patient_sex").value = patient.sex;
            document.getElementById("patient_dob").value = formattedDOB;
            document.getElementById("patient_ga").value = gestationalAge;
            document.getElementById("patient_category").value = patient.category;
            document.getElementById("patient_weight").value = patient.birth_weight;

            // Ensure inputs are readonly
            document.querySelectorAll("input").forEach(input => input.setAttribute("readonly", true));
        })
        .catch(error => console.error("Error fetching patient details:", error));
}

window.onload = fetchPatientDetails;
