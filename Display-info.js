function loadPatients() {
    fetch("http://127.0.0.1:5000/get_all_patients")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("patientSelect");
            data.forEach(patient => {
                const option = document.createElement("option");
                option.value = patient.id;
                option.textContent = `${patient.name} (ID: ${patient.id})`;
                select.appendChild(option);
            });
        })
        .catch(err => console.error("Error fetching patients:", err));
}

function loadPatientRecords() {
    const id = document.getElementById("patientSelect").value;
    if (!id) return;

    document.getElementById("selectedPatientId").innerText = `Patient ID: ${id}`;

    fetch(`http://127.0.0.1:5000/get_records/${id}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("patientTableBody");
            tbody.innerHTML = "";

            data.forEach(record => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${record.timestamp}</td>
                    <td>${record.stored_count_60s}</td>
                    <td>${record.prediction}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error("Error fetching records:", err));
}

function setCurrentPatient() {
    const patientId = document.getElementById("patientSelect").value;
    if (!patientId) return;

    fetch("http://127.0.0.1:5000/set_current_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId })
    });
}

document.getElementById("patientSelect").addEventListener("change", () => {
    setCurrentPatient();
    loadPatientRecords();
});

let refreshInterval;

function loadPatientRecords() {
    const select = document.getElementById("patientSelect");
    const patientId = select.value;

    if (!patientId) return;

    document.getElementById("selectedPatientId").textContent = `Patient ID: ${patientId}`;

    fetch(`http://127.0.0.1:5000/get_records/${patientId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("patientTableBody");
            tbody.innerHTML = "";

            data.forEach(record => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${new Date(record.timestamp).toUTCString()}</td>
                    <td>${record.stored_count_60s}</td>
                    <td>${record.prediction}</td>
                `;
                tbody.appendChild(row);
            });
        });

    // Clear previous interval and set new refresh
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => loadPatientRecords(), 10000); // refresh every 10 sec
}



window.onload = loadPatients;
