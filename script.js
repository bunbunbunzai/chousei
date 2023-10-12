let userCount = 2;

function updateUserCount() {
  userCount = document.getElementById("userCount").value;
  initializeCalendar();
}

function initializeCalendar() {
  const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
  const minutes = ["00", "30"];
  const tableHead = document.querySelector("#calendar thead tr");
  const tableBody = document.querySelector("#calendar tbody");

  // Clear existing table
  tableHead.innerHTML = "<th>Time</th>";
  tableBody.innerHTML = "";

  // Add user headers
  for (let i = 1; i <= userCount; i++) {
    const userHeader = document.createElement("th");
    userHeader.textContent = `User ${i}`;
    tableHead.appendChild(userHeader);
  }

  // Add time slots
  hours.forEach(hour => {
    minutes.forEach(minute => {
      const time = `${hour}:${minute}`;
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = time;
      row.appendChild(timeCell);

      for (let i = 1; i <= userCount; i++) {
        const cell = document.createElement("td");
        cell.addEventListener("click", function() {
          if (this.classList.contains("o")) {
            this.classList.remove("o");
            this.classList.add("triangle");
          } else if (this.classList.contains("triangle")) {
            this.classList.remove("triangle");
            this.classList.add("x");
          } else if (this.classList.contains("x")) {
            this.classList.remove("x");
          } else {
            this.classList.add("o");
          }
        });
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });
  });
}

// Initialize
initializeCalendar();
