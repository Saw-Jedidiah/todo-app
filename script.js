const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const selectedDateText = document.getElementById("selectedDateText");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const addTaskBtn = document.getElementById("addTaskBtn");
const clearBtn = document.getElementById("clearBtn");

let currentDate = new Date();
let selectedDate = formatDate(new Date());
let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function saveTasks() {
  localStorage.setItem("calendarTasks", JSON.stringify(tasks));
}

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDate(date);

    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;

    if (dateKey === formatDate(new Date())) {
      dayEl.classList.add("today");
    }

    if (dateKey === selectedDate) {
      dayEl.classList.add("selected");
    }

    if (tasks[dateKey] && tasks[dateKey].length > 0) {
      dayEl.classList.add("has-task");
    }

    dayEl.addEventListener("click", () => {
      selectedDate = dateKey;
      renderCalendar();
      renderTasks();
    });

    calendarDays.appendChild(dayEl);
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  selectedDateText.textContent = `Selected Date: ${selectedDate}`;

  const dayTasks = tasks[selectedDate] || [];

  dayTasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(li);
  });

  taskCount.textContent = `${dayTasks.length} task${dayTasks.length !== 1 ? "s" : ""}`;
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  if (!tasks[selectedDate]) {
    tasks[selectedDate] = [];
  }

  tasks[selectedDate].push({
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderCalendar();
  renderTasks();
}

function toggleTask(index) {
  tasks[selectedDate][index].completed = !tasks[selectedDate][index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks[selectedDate].splice(index, 1);

  if (tasks[selectedDate].length === 0) {
    delete tasks[selectedDate];
  }

  saveTasks();
  renderCalendar();
  renderTasks();
}

function clearAll() {
  delete tasks[selectedDate];
  saveTasks();
  renderCalendar();
  renderTasks();
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

addTaskBtn.addEventListener("click", addTask);

clearBtn.addEventListener("click", clearAll);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

renderCalendar();
renderTasks();
