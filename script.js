let users = [];
let currentSelection = '〇';
let isDragging = false;
let cellData = {};

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = today;
  document.getElementById('endDate').value = today;
  generateTables();
});

function addUser() {
  const newUser = document.getElementById("newUser").value;
  if (newUser && !users.includes(newUser)) {
    users.push(newUser);
    generateTables();
  }
}

function setSelection(selection) {
  currentSelection = selection;
}

function toggleCell(cell) {
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
}

function saveCellData(date, user, time, value) {
  if (!cellData[date]) {
    cellData[date] = {};
  }
  if (!cellData[date][user]) {
    cellData[date][user] = {};
  }
  cellData[date][user][time] = value;
}

function loadCellData(date, user, time) {
  return cellData[date] && cellData[date][user] && cellData[date][user][time] || '';
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
      ["00", "30"].forEach(minute => {
        const cell = document.createElement("td");
        cell.addEventListener("click", function() {
          toggleCell(this);
          saveCellData(date, user, `${hour}:${minute}`, this.textContent);
        });
        cell.addEventListener("mouseover", function() {
          if (isDragging) {
            toggleCell(this);
            saveCellData(date, user, `${hour}:${minute}`, this.textContent);
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
  datesDiv.innerHTML = "";
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split("T")[0];
    createCalendarForDate(dateString);
  }
}

document.addEventListener("mousedown", () => { isDragging = true; });
document.addEventListener("mouseup", () => { isDragging = false; });

// 修正された関数：セルのマークと背景色を設定
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

// すべてのテーブルとセルデータ、ユーザーをリセットする
function resetAll() {
  cellData = {};
  users = [];
  generateTables();
  findCommonTimes(); // この関数は後で追加します
}

// 登録しているユーザー全員が〇をつけた時間を出力
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

// generateTables 関数の最後にこの行を追加
findCommonTimes();



