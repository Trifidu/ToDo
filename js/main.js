//! elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task) {
  const doneClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${doneClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>
      `;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);
});

checkEmptyList();

//! add task
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  const doneClass = newTask.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `
        <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${doneClass}">${newTask.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>
      `;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);

  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
  saveToLocalStorage();
}

form.addEventListener("submit", addTask);

//! remove task
function removeTask(e) {
  if (e.target.dataset.action !== "delete") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const index = tasks.findIndex((task) => task.id === +id);
  tasks.splice(index, 1);

  parentNode.remove();

  checkEmptyList();
  saveToLocalStorage();
}

tasksList.addEventListener("click", removeTask);

//! mark task as completed
function doneTask(e) {
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const taskObj = tasks.find((task) => task.id === +id);
  taskObj.done = !taskObj.done;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  saveToLocalStorage();
}

tasksList.addEventListener("click", doneTask);

//! show empty list
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHtml = `
      <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
      </li>
    `;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHtml);
  }

  if (tasks.length > 0) {
    const emptyListElement = document.querySelector("#emptyList");
    emptyListElement ? emptyListElement.remove() : null;
  }
}

//! save to local storage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//! render task
function renderTask() {}
