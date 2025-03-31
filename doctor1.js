function updatePatientInfo() {
  const currentPatients = document.getElementById("current-patients");
  const dischargedPatients = document.getElementById("discharged-patients");
  const patientInfo = document.getElementById("patient-info");

  let selectedPatient = currentPatients.value || dischargedPatients.value;

  if (selectedPatient) {
    patientInfo.textContent = `Viewing details for ${selectedPatient}`;
  } else {
    patientInfo.textContent = "Select a patient to view details.";
  }
}

function printPage() {
  window.print();
}
