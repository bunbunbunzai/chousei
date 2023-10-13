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

// Set current selection for cell marking
function setSelection(selection) {
  currentSelection = selection;
}

// Toggle cell marking
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

// Save data to the cellData object
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

// Load data from the cellData object
function loadCellData(date, user, time) {
  return cellData[date] && cellData[date][user] && cellData[date][user][time] || '';
}

// Create calendar for a specific date
function createCalendarForDate(date) {
  // (Your existing code to create the calendar)
  // At the end, load cell data using loadCellData()
}

// Generate tables for the date range
function generateTables() {
  // (Your existing code to generate tables)
  // At the end, call findCommonTimes()
  findCommonTimes();
}

// Find common times where all users have marked '〇'
function findCommonTimes() {
  const commonTimes = [];
  const dates = Object.keys(cellData);
  for (const date of dates) {
    const timeSlots = Object.keys(cellData[date][users[0]] || {});
    for (const time of timeSlots) {
      if (users.every(user => cellData[date][user] && cellData[date][user][time] === '〇')) {
        commonTimes.push(`${date} ${time}`);
      }
    }
  }
  document.getElementById('commonTimes').textContent = commonTimes.join(', ');
}

// Reset all tables, cellData, and users
function resetAll() {
  cellData = {};
  users = [];
  generateTables();
  saveDataToLocalStorage();
}

document.addEventListener("mousedown", () => { isDragging = true; });
document.addEventListener("mouseup", () => { isDragging = false; });

