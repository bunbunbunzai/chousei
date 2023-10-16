let users = JSON.parse(localStorage.getItem('users')) || [];
let currentSelection = '〇';
let isDragging = false;
let cellData = JSON.parse(localStorage.getItem('cellData')) || {};

document.addEventListener('DOMContentLoaded', function() {
  const storedStartDate = localStorage.getItem('startDate');
  const storedEndDate = localStorage.getItem('endDate');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = storedStartDate || today;
  document.getElementById('endDate').value = storedEndDate || today;
  generateTables();
});

function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser && !users.includes(newUser)) {
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    generateTables();
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
  localStorage.setItem('cellData', JSON.stringify(cellData));
}

function loadCellData(date, user, time) {
  return cellData[date] && cellData[date][user] && cellData[date][user][time] || '';
}

function createCalendarForDate(date) {
  const dateDiv = document.createElement("div");
  dateDiv.className = 'date';
  const dateLabel = document.createElement("h2");
  const day = new Date(date).toLocaleDateString('ja-JP', { weekday: 'long' });
  dateLabel.textContent = `${date} (${day})`;
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
      timeHeader.textContent = `${String(hour).padStart(2, "0")}:${minute}~`;
      timeHeader.classList.add("rotate");
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
      ["00", "30"].forEach(minute => {
        const cell = document.createElement("td");
        const time = `${hour}:${minute}`;
        cell.addEventListener("mousedown", function() {
          toggleCell(this, date, user, time);
        });
        cell.addEventListener("mouseover", function() {
          if (isDragging) {
            toggleCell(this, date, user, time);
          }
        });
        cell.addEventListener("touchstart", function() {
          toggleCell(this, date, user, time);
        });
        cell.addEventListener("touchmove", function() {
          toggleCell(this, date, user, time);
        });

        cell.textContent = loadCellData(date, user, time);
        if (cell.textContent === '〇') {
          cell.classList.add('cell-o');
        } else if (cell.textContent === '△') {
          cell.classList.add('cell-triangle');
        } else if (cell.textContent === '×') {
          cell.classList.add('cell-x');
        }
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

  localStorage.setItem('startDate', startDate.toISOString().split('T')[0]);
  localStorage.setItem('endDate', endDate.toISOString().split('T')[0]);

  const datesDiv = document.getElementById("dates");
  datesDiv.innerHTML = "";
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split("T")[0];
    createCalendarForDate(dateString);
  }
}

document.addEventListener("mousedown", () => { isDragging = true; });
document.addEventListener("mouseup", () => { isDragging = false; });
document.addEventListener("touchstart", () => { isDragging = true; });
document.addEventListener("touchend", () => { isDragging = false; });

function showCommonTimes() {
  let commonTimes = {};
  for (const date in cellData) {
    commonTimes[date] = {};
    for (const user in cellData[date]) {
      for (const time in cellData[date][user]) {
        if (!commonTimes[date][time]) {
          commonTimes[date][time] = 0;
        }
        if (cellData[date][user][time] === '〇') {
          commonTimes[date][time]++;
        }
      }
    }
  }

  let output = "";
  for (const date in commonTimes) {
    let lastTime = null;
    let startTime = null;
    for (const time in commonTimes[date]) {
      if (commonTimes[date][time] === users.length) {
        if (!startTime) {
          startTime = time;
        }
        lastTime = time;
      } else {
        if (startTime && lastTime) {
          const endTimeArray = lastTime.split(":");
          let endHour = parseInt(endTimeArray[0]);
          let endMinute = parseInt(endTimeArray[1]) + 30;
          if (endMinute === 60) {
            endHour++;
            endMinute = 0;
          }
          const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
          output += `全員が〇の時間: ${date} ${startTime}~${endTime}\n`;
        }
        startTime = null;
        lastTime = null;
      }
    }
    if (startTime && lastTime) {
      const endTimeArray = lastTime.split(":");
      let endHour = parseInt(endTimeArray[0]);
      let endMinute = parseInt(endTimeArray[1]) + 30;
      if (endMinute === 60) {
        endHour++;
        endMinute = 0;
      }
      const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
      output += `全員が〇の時間: ${date} ${startTime}~${endTime}\n`;
    }
  }
  document.getElementById('commonTimes').textContent = output;
}


// リセット機能
function resetAll() {
  cellData = {};
  users = [];
  localStorage.setItem('cellData', JSON.stringify(cellData));
  localStorage.setItem('users', JSON.stringify(users));
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('startDate', today);
  localStorage.setItem('endDate', today);
  document.getElementById('startDate').value = today;
  document.getElementById('endDate').value = today;
  document.getElementById('newUser').value = '';
  document.getElementById('commonTimes').textContent = '';
  generateTables();
}

