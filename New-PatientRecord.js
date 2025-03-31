document.querySelector(".btn-enroll").addEventListener("click", function () {
    let name = document.getElementById("name").value;
    let sex = document.getElementById("sex").value;
    let dob = document.getElementById("dob").value;
    let gestationalAge = document.getElementById("gestationalage").value;
    let gestationalUnit = document.getElementById("gestationalunit").value;
    let category = document.getElementById("category").value;
    let birthWeight = document.getElementById("birthweight").value;

    if (!name || !dob || !gestationalAge || !birthWeight) {
        alert("Please fill in all required fields.");
        return;
    }

    let patientData = {
        name: name,
        sex: sex,
        dob: dob,
        gestational_age: parseInt(gestationalAge),
        gestational_unit: gestationalUnit,
        category: category,
        birth_weight: parseFloat(birthWeight)
    };

    fetch("http://127.0.0.1:5000/add_patient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("popup-message").innerText = data.message;
        document.getElementById("popup").style.display = "block";
    })
    .catch(error => console.error("Error:", error));
});

function clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("gestationalage").value = "";
    document.getElementById("birthweight").value = "";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function showPopup() {
    const name = document.getElementById("name").value;
    const sex = document.getElementById("sex").value;
    const dob = document.getElementById("dob").value;
    const gestationalAge = document.getElementById("gestationalage").value + " " + document.getElementById("gestationalunit").value;
    const category = document.getElementById("category").value;
    const birthWeight = document.getElementById("birthweight").value + " KG";
    
    document.getElementById("popup-message").innerText = `You have successfully enrolled at Tiny Breaths!\n\nName: ${name}\nSex: ${sex}\nDate of Birth: ${dob}\nGestational Age at Birth: ${gestationalAge}\nCategory: ${category}\nBirth Weight: ${birthWeight}`;

    const popup = document.getElementById("popup");
    popup.classList.add("show");
    //document.getElementById("popup").style.display = "block";
}
