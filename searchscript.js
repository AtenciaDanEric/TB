/*document.addEventListener("DOMContentLoaded", function () {
    fetchPatients();
});

function fetchPatients() {
    fetch("http://127.0.0.1:5000/get_patients")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Patients:", data); // Debugging
            let patientList = document.getElementById("patientList");
            patientList.innerHTML = ""; // Clear existing list

            data.forEach(patient => {
                let listItem = document.createElement("li");
                listItem.textContent = `Patient ${patient.id} - ${patient.name}`;
                patientList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching patients:", error));
}

function searchPatient() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let patientList = document.querySelectorAll("#patientList li");

    patientList.forEach(item => {
        if (item.textContent.toLowerCase().includes(searchValue)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}
*/

// searchscript.js

document.addEventListener("DOMContentLoaded", function () {
    fetchPatients();
});

function fetchPatients() {
    fetch("http://127.0.0.1:5000/get_patients")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Patients:", data); // Debugging
            let patientList = document.getElementById("patientList");
            patientList.innerHTML = ""; // Clear existing list

            data.forEach(patient => {
                let listItem = document.createElement("li");
                let link = document.createElement("a");
                
                link.href = `Select-Options.html?id=${patient.id}`;
                link.textContent = `Patient ${patient.id} - ${patient.name}`;
                
                listItem.appendChild(link);
                patientList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching patients:", error));
}

function searchPatient() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let patientList = document.querySelectorAll("#patientList li");

    patientList.forEach(item => {
        if (item.textContent.toLowerCase().includes(searchValue)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

function loadFilteredPatients() {
    const filter = document.getElementById("statusFilter").value;
    const url = `http://127.0.0.1:5000/get_patients_by_status?status=${filter}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("patientList");
            list.innerHTML = "";

            data.forEach(patient => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = `Select-Options.html?id=${patient.id}`;
                link.textContent = `${patient.name} (ID: ${patient.id})`;
                li.appendChild(link);
                list.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Failed to load patients:", err);
        });
}

window.onload = loadFilteredPatients;

