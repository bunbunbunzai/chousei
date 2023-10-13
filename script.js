let users = [];
let currentSelection = '〇';
let isDragging = false;
let cellData = {};

document.addEventListener('DOMContentLoaded', function() {
  // Load data from localStorage
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

function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser && !users.includes(newUser)) {
    users.push(newUser);
    generateTables();
    saveDataToLocalStorage();
  }
}

function resetAll() {
  cellData = {};
  users = [];
  generateTables();
  saveDataToLocalStorage();
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

function generateTables() {
  // ... (Your existing code for generating tables)
  // At the end of the function, call findCommonTimes()
  findCommonTimes();
}

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
