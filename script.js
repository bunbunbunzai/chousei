let users = ["User1", "User2"];
let currentSelection = 'o';

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
  table.id = `calendar-${date}`;
  
  const header = document.createElement("tr");
  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Time";
  header.appendChild(timeHeader);
  users.forEach(user => {
    const userHeader = document.createElement("th");
    userHeader.textContent = user;
    header.appendChild(userHeader);
  });
  tableBody.appendChild(header);

  for (let hour = 0; hour < 24; hour++) {
    ["00", "30"].forEach(minute => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = `${String(hour).padStart(2, "0")}:${minute}`;
      row.appendChild(timeCell);

      users.forEach(() => {
        const cell = document.createElement("td");
        cell.addEventListener("click", function() {
          this.className = currentSelection;
        });
        row.appendChild(cell);
      });
      
      tableBody.appendChild(row);
    });
  }
  
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

// 初期化
generateTables();

