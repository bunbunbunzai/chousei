let users = [];  // No pre-added users
let currentSelection = '〇';
let isDragging = false;

function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser) {
    users.push(newUser);
    generateTables();
  }
}

function setSelection(selection) {
  currentSelection = selection;
}

function createCalendarForDate(date) {
  const dateDiv = document.createElement("div");
  dateDiv.className = 'date';
  
  const dateLabel = document.createElement("h2");
  dateLabel.textContent = date;
  dateDiv.appendChild(dateLabel);
  
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");
  
  const header = document.createElement("tr");
  const userHeader = document.createElement("th");
  userHeader.textContent = "User";
  header.appendChild(userHeader);

  for (let hour = 0; hour < 24; hour++) {
    ["00", "30"].forEach(minute => {
      const timeHeader = document.createElement("th");
      timeHeader.textContent = `${String(hour).padStart(2, "0")}:${minute}`;
      timeHeader.className = 'rotate';
      header.appendChild(timeHeader);
    });
  }
  tableBody.appendChild(header);
  
  users.forEach(user => {
    const row = document.createElement("tr");
    const userNameCell = document.createElement("td");
    userNameCell.textContent = user;
    row.appendChild(userNameCell);
    
    for (let hour = 0; hour < 24; hour++) {
      ["00", "30"].forEach(() => {
        const cell = document.createElement("td");
        cell.addEventListener("click", function() {
          this.textContent = currentSelection;
        });
        cell.addEventListener("mouseover", function() {
          if (isDragging) this.textContent = currentSelection;
        });
        row.appendChild(cell);
      });
    }
    
    tableBody.appendChild(row);
  });
  
  table.appendChild(tableBody);
  dateDiv.appendChild(table);
  document.getElementById("dates").appendChild(dateDiv);
}

function generateTables() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  if (startDate > endDate) {
    alert("開始日は終了日より前でなければなりません。");
    return;
  }
  const datesDiv = document.getElementById("dates");
  dates


