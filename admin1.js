// admin1.js
document.addEventListener("DOMContentLoaded", function () {
    showSection("dashboard");
});

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

function updateStatus(button, newStatus) {
    let row = button.parentElement.parentElement;
    row.cells[4].textContent = newStatus;
    if (newStatus === "Delivered") {
        button.textContent = "Completed";
        button.disabled = true;
    } else {
        button.textContent = "Deliver";
        button.onclick = () => updateStatus(button, "Delivered");
    }
}

function removeUser(button) {
    if (confirm("Are you sure you want to remove this user?")) {
        let row = button.parentElement.parentElement;
        row.remove();
    }
}

function approveUser(button) {
    let row = button.parentElement.parentElement;
    row.cells[4].textContent = "Active";
    button.textContent = "Remove";
    button.onclick = () => removeUser(button);
}

function editProduct(button) {
    alert("Edit product functionality to be implemented");
}

function addProduct() {
    alert("Add product functionality to be implemented");
}

function generateReport(type) {
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`);
}

function saveSettings() {
    alert("Settings saved successfully!");
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!");
        // Add actual logout logic here
    }
}