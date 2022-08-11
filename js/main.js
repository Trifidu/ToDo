//! elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const listInput = document.querySelector("#listInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];
let lists = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

//! add task and list
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  const list = listInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    favorite: false,
    date: Date.now(),
    list: list,
  };

  if (!lists.includes(newTask.list)) {
    lists.push(newTask.list);
  }
  tasks.push(newTask);

  renderTask(newTask);

  taskInput.value = "";
  listInput.value = "";
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

//! more button
function classMenuToggle(e) {
  const closestMoreElem = e.target.nextElementSibling;
  closestMoreElem.classList.toggle("show");
}

function moreBtn(e) {
  if (e.target.dataset.action !== "more") return;

  const moreElements = document.querySelectorAll(".moreElement");

  moreElements.forEach((elem) => {
    if (elem.id !== e.target.id) {
      elem.classList.remove("show");
    }
  });

  classMenuToggle(e);
}

tasksList.addEventListener("click", moreBtn);

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

//! favorite task
function favoriteTask(e) {
  if (e.target.dataset.action !== "star") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const taskObj = tasks.find((task) => task.id === +id);
  taskObj.favorite = !taskObj.favorite;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--star");

  saveToLocalStorage();
}

tasksList.addEventListener("click", favoriteTask);

//! show empty list
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHtml = `
      <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/no-tasks.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Все задачи выполнены</div>
        <div class="empty-list__subtitle">УРА!</div>
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
function renderTask(task) {
  let spanClass = "task-title";

  if (task.done && task.favorite) {
    spanClass = "task-title task-title--done task-title--star";
  } else if (task.done) {
    spanClass = "task-title task-title--done";
  } else if (task.favorite) {
    spanClass = "task-title task-title--star";
  }

  const taskHtml = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${spanClass}">${task.text}</span>
          <span class="task-title-list">${task.priority}</span>
          <span class="task-title-list">${task.list}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
            <div class="btn-group">
              <button data-action="more" class="btn-action" id="${task.id}" type="button">
                <img src="./img/more.svg" alt="More" width="18" height="18">
              </button>
              <div id="${task.id}" class="moreElement"> 
                <div class="moreElement_wrapper">
                  <div class="moreElement_item">Добавить подзадачу</div>
                  <div class="moreElement_item">Удалить</div>
                  <div class="moreElement_item">Сменить список</div>
                </div>
              </div>
            </div>
            <button class="btn-action" type="button" data-action="star">
              <img src="./img/star.svg" alt="Star" width="18" height="18">
            </button>
					</div>
				</li>
      `;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);
}
