const numberOfStudents = 50; // Change to 60 if needed
let students = [];

// Load saved data or generate default students
function loadStudents() {
    const savedData = localStorage.getItem("attendanceData");
    const tbody = document.getElementById("tableBody");

    if (savedData) {
        students = JSON.parse(savedData);
    } else {
        for (let i = 1; i <= numberOfStudents; i++) {
            students.push({ name: `Student ${i}`, days: [] });
        }
    }

    // Generate table rows dynamically
    tbody.innerHTML = "";
    students.forEach((student, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Roll No">${index + 1}</td>
            <td data-label="Student Name" contenteditable="true">${student.name}</td>
            <td data-label="Morning" class="attendance" onclick="toggle(this)"></td>
            <td data-label="Afternoon" class="attendance" onclick="toggle(this)"></td>
            <td data-label="Status" class="status"></td>
            <td data-label="Day Value" class="value"></td>
        `;
        tbody.appendChild(tr);
    });
}

// Call on page load
loadStudents();

// Toggle attendance cells
function toggle(cell) {
    if (cell.innerText === "P") {
        cell.innerText = "A";
    } else {
        cell.innerText = "P";
    }
    updateStatus(cell.parentElement);
}

// Update status and day value
function updateStatus(row) {
    const morning = row.children[2].innerText;
    const afternoon = row.children[3].innerText;
    const statusCell = row.children[4];
    const valueCell = row.children[5];

    let value = 0;
    if (morning === "P" && afternoon === "P") {
        statusCell.innerText = "Present";
        value = 1;
    } else if (morning === "A" && afternoon === "A") {
        statusCell.innerText = "Absent";
        value = 0;
    } else if (morning && afternoon) {
        statusCell.innerText = "Half Day";
        value = 0.5;
    } else {
        statusCell.innerText = "";
        value = 0;
    }

    valueCell.innerText = value;

    // Save today's value
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    students[rowIndex].days.push(value);

    // Save students array to localStorage
    localStorage.setItem("attendanceData", JSON.stringify(students));
}

// Calculate monthly attendance
function calculateMonthly() {
    const tbody = document.getElementById("tableBody");
    const rows = tbody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        students[index].name = row.children[1].innerText;
    });

    localStorage.setItem("attendanceData", JSON.stringify(students));

    let results = "<h2>Monthly Attendance:</h2><ul>";
    students.forEach(student => {
        const total = student.days.reduce((a, b) => a + b, 0);
        const daysCount = student.days.length;
        const percentage = (total / daysCount) * 100;
        const styleClass = percentage < 75 ? "red" : "";
        results += `<li class="${styleClass}">${student.name}: Total = ${total.toFixed(1)}, Attendance = ${percentage.toFixed(1)}%</li>`;
    });
    results += "</ul>";

    document.getElementById("monthlyResults").innerHTML = results;
}
