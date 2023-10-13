let users = [];
let currentSelection = '〇';
let isDragging = false;
let cellData = {};

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
  const storedData = JSON.parse(localStorage.getItem('cellData') || '{}');
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
  cellData = storedData;
  users = storedUsers;
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = today;
  document.getElementById('endDate').value = today;
  
  generateTables();
});

// Save data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem('cellData', JSON.stringify(cellData));
  localStorage.setItem('users', JSON.stringify(users));
}

// Add new user
function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser && !users.includes(newUser)) {
    users.push(newUser);
    generateTables();
    saveDataToLocalStorage();
  }
}

function setSelection(selection) {
  currentSelection = selection;
}

function toggleCell(cell, date, user, time) {
  cell.classList.remove('cell-o', 'cell-triangle', 'cell-x');
  if (cell.textContent === currentSelection) {
    cell.textContent = '';
  } else {
    cell.textContent = currentSelection;
    if (currentSelection === '〇') {
      cell.classList.add('cell-o');
    } else if (currentSelection === '△') {
      cell.classList.add('cell-triangle');
    } else if (currentSelection === '×') {
      cell.classList.add('cell-x');
    }
  }
  saveCellData(date, user, time, cell.textContent);
}

function saveCellData(date, user, time, value) {
  if (!cellData[date]) {
    cellData[date] = {};
  }
  if (!cellData[date][user]) {
    cellData[date][user] = {};
  }
  cellData[date][user][time] = value;
  saveDataToLocalStorage();
}

function loadCellData(date, user, time) {
  return cellData[date] && cellData[date][user] && cellData[date][user][time] || '';
}

function generateTables() {
  const datesDiv = document.getElementById("dates");
  datesDiv.innerHTML = "";

  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split("T")[0];
    createCalendarForDate(dateString);
  }
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
  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Time";
  header.appendChild(timeHeader);

  for (const user of users) {
    const userHeader = document.createElement("th");
    userHeader.textContent = user;
    header.appendChild(userHeader);
  }
  
  tableBody.appendChild(header);
  
  for (let hour = 0; hour < 24; hour++) {
    ["00", "30"].forEach(minute => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = `${String(hour).padStart(2, "0")}:${minute}`;
      row.appendChild(timeCell);
      
      users.forEach(user => {
        const cell = document.createElement("td");
        cell.addEventListener("click", function() {
          toggleCell(this, date, user, `${hour}:${minute}`);
        });
        cell.addEventListener("mouseover", function() {
          if (isDragging) {
            toggleCell(this, date, user, `${hour}:${minute}`);
          }
        });
        cell.textContent = loadCellData(date, user, `${hour}:${minute}`);
        if (cell.textContent === '〇') {
          cell.classList.add('cell-o');
        } else if (cell.textContent === '△') {
          cell.classList.add('cell-triangle');
        } else if (cell.textContent === '×') {
          cell.classList.add('cell-x');
        }
        row.appendChild(cell);
      });
      
      tableBody.appendChild(row);
    });
  }
  
  table.appendChild(tableBody);
  dateDiv.appendChild(table);
  document.getElementById("dates").appendChild(dateDiv);
}

document.addEventListener("mousedown", () => { isDragging = true; });
document.addEventListener("mouseup", () => { isDragging = false; });

function resetAll() {
  cellData = {};
  users = [];
  generateTables();
  saveDataToLocalStorage();
}

