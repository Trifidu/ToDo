//! elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const listInput = document.querySelector("#listInput");
const descrInput = document.querySelector("#descrInput");
const dateInput = document.querySelector("#dateInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");
const doneTasksBtn = document.querySelector("#doneTasks");
const doneTasksList = document.querySelector("#accordionDone");
const doneTasksCounter = document.querySelector("#doneTasksCounter");

let tasks = [];
let tasksDone = [];
let lists = ["Выполненные"];

let priority = "";

//! load render
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task, tasksList));
}

if (localStorage.getItem("tasksDone")) {
  tasksDone = JSON.parse(localStorage.getItem("tasksDone"));
  tasksDone.forEach((task) => renderTask(task, doneTasksList));
}

if (localStorage.getItem("lists")) {
  lists = JSON.parse(localStorage.getItem("lists"));
}

checkEmptyList();
doneTasksCounting();

//! add task and list
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  const descrText = descrInput.value;
  const dateText = dateInput.value;
  const list = listInput.value > 0 ? listInput.value : "Нет списка";

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    favorite: false,
    list: list,
    prevList: "",
    priority: "",
    descr: descrText,
    createDate: Date.now(),
    endDate: dateText,
  };

  priority.length > 0
    ? (newTask.priority = priority)
    : (newTask.priority = "medium");

  if (!lists.includes(newTask.list)) {
    lists.push(newTask.list);
  }
  tasks.push(newTask);

  renderTask(newTask, tasksList);

  taskInput.value = "";
  listInput.value = "";
  priority = "";
  descrInput.value = "";
  dateInput.value = "";
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

function removeTaskData(e) {
  if (e.target.dataset.action !== "delete") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const index = tasksDone.findIndex((task) => task.id === +id);
  tasksDone.splice(index, 1);

  parentNode.remove();

  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

doneTasksList.addEventListener("click", removeTaskData);

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
doneTasksList.addEventListener("click", moreBtn);

//! mark task as completed
function doneTask(e) {
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const taskObj = tasks.find((task) => task.id === +id);
  taskObj.done = !taskObj.done;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  checkDoneTask(taskObj, e);
  renderTask(taskObj, doneTasksList);

  const index = tasks.findIndex((task) => task.id === +id);
  tasksDone.push(tasks[index]);
  tasks.splice(index, 1);

  parentNode.remove();

  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

tasksList.addEventListener("click", doneTask);

//! mark task is uncompleted
function undoneTask(e) {
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const taskObj = tasksDone.find((task) => task.id === +id);
  taskObj.done = !taskObj.done;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  checkDoneTask(taskObj, e);
  renderTask(taskObj, tasksList);

  const index = tasksDone.findIndex((task) => task.id === +id);
  tasks.push(tasksDone[index]);
  tasksDone.splice(index, 1);

  parentNode.remove();

  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

doneTasksList.addEventListener("click", undoneTask);

//! check done task and change list
function checkDoneTask(task, e) {
  let currList = "";
  if (task.list !== "Выполненные") {
    task.prevList = task.list;
    task.list = "Выполненные";
    currList = task.list;
  } else {
    task.list = task.prevList;
    currList = task.list;
  }

  const parentNode = e.target.closest("li");
  const taskList = parentNode.querySelector(".task-title-list");
  taskList.textContent = `${currList}`;
  doneTasksCounting();
}

function doneTasksCounting() {
  const count = tasksDone.length;
  doneTasksCounter.textContent = `${count}`;
}

//! toggle done list
function toggleDoneList(e) {
  if (e.target !== doneTasksBtn) return;
  doneTasksBtn.classList.toggle("collapsed");
  doneTasksList.classList.toggle("none");
}

document.addEventListener("click", toggleDoneList);

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

//! favorite task in done list
function favoriteTaskDone(e) {
  if (e.target.dataset.action !== "star") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;
  const taskObj = tasksDone.find((task) => task.id === +id);
  taskObj.favorite = !taskObj.favorite;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--star");

  saveToLocalStorage();
}

doneTasksList.addEventListener("click", favoriteTaskDone);

//! add priority
function addPriority(e) {
  if (!e.target.dataset.priority) return;
  priority = e.target.dataset.priority;
  console.log(priority);
  return priority;
}

document.addEventListener("click", addPriority);

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
  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
}

//! render task
function renderTask(task, place) {
  let spanClass = "task-title";
  let priority = "";

  if (task.done && task.favorite) {
    spanClass = "task-title task-title--done task-title--star";
  } else if (task.done) {
    spanClass = "task-title task-title--done";
  } else if (task.favorite) {
    spanClass = "task-title task-title--star";
  }

  switch (task.priority) {
    case "lowest":
      priority =
        '<img src="./img/lowest.svg" alt="lowest" width="18" height="18">';
      break;
    case "low":
      priority = '<img src="./img/low.svg" alt="low" width="18" height="18">';
      break;
    case "high":
      priority = '<img src="./img/high.svg" alt="high" width="18" height="18">';
      break;
    case "highest":
      priority =
        '<img src="./img/highest.svg" alt="highest" width="18" height="18">';
      break;
    default:
      priority =
        '<img src="./img/medium.svg" alt="medium" width="18" height="18">';
      break;
  }

  const taskHtml = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${spanClass}">${task.text}</span>
            <span class="task-title-priority">${priority}</span>
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

  place.insertAdjacentHTML("beforeend", taskHtml);
}
