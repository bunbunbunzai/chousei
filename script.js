let users = [];
let currentSelection = 'o';
let isDragging = false;

function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser) {
    users.push(newUser);
    initializeCalendar();
  }
}

function setSelection(selection) {
  currentSelection = selection;
}

function checkAvailability() {
  // Omitted for brevity; you can add the logic here
}

function createCalendarForDate(date) {
  const dateDiv = document.createElement("div");
  dateDiv.className = 'date';
  
  const dateLabel = document.createElement("h2");
  dateLabel.textContent = date;
  dateDiv.appendChild(dateLabel);
  
  const table = document.createElement("table");
  table.id = `calendar-${date}`;
  
  // ... (same as before, to create the table)
  
  dateDiv.appendChild(table);
  document.getElementById("dates").appendChild(dateDiv);
}

function initializeCalendar() {
  // ... (same as before)
  
  // Add mouse event listeners for drag-to-fill functionality
  tableBody.addEventListener("mousedown", e => {
    isDragging = true;
    if (e.target.tagName === "TD") {
      e.target.className = currentSelection;
    }
  });
  
  tableBody.addEventListener("mouseover", e => {
    if (isDragging && e.target.tagName === "TD") {
      e.target.className = currentSelection;
    }
  });
  
  tableBody.addEventListener("mouseup", () => {
    isDragging = false;
  });
  
  // Add date
  createCalendarForDate("2022-01-01");  // Replace with actual date
  createCalendarForDate("2022-01-02");  // Replace with actual date
  
  checkAvailability();
}

// Initialize
initializeCalendar();
