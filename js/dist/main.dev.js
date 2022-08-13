"use strict";

//! elements
var form = document.querySelector("#form");
var taskInput = document.querySelector("#taskInput");
var listInput = document.querySelector("#listInput");
var descrInput = document.querySelector("#descrInput");
var dateInput = document.querySelector("#dateInput");
var tasksList = document.querySelector("#tasksList");
var emptyList = document.querySelector("#emptyList");
var doneTasksBtn = document.querySelector("#doneTasks");
var doneTasksList = document.querySelector("#accordionDone");
var doneTasksCounter = document.querySelector("#doneTasksCounter");
var dropdownMenuButton = document.querySelector("#dropdownMenuButton");
var mainDropdownMenu = document.querySelector("#mainDropdownMenu");
var tasks = [];
var tasksDone = [];
var lists = ["Выполненные"];
var priority = ""; //! load render

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach(function (task) {
    return renderTask(task, tasksList);
  });
}

if (localStorage.getItem("tasksDone")) {
  tasksDone = JSON.parse(localStorage.getItem("tasksDone"));
  tasksDone.forEach(function (task) {
    return renderTask(task, doneTasksList);
  });
}

if (localStorage.getItem("lists")) {
  lists = JSON.parse(localStorage.getItem("lists"));
}

checkEmptyList();
doneTasksCounting(); //! add task and list

function addTask(e) {
  e.preventDefault();
  var taskText = taskInput.value;
  var descrText = descrInput.value;
  var dateText = dateInput.value;
  var list = listInput.value > 0 ? listInput.value : "Нет списка";
  var newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    favorite: false,
    list: list,
    prevList: "",
    priority: "",
    descr: descrText,
    createDate: Date.now(),
    endDate: dateText
  };
  priority.length > 0 ? newTask.priority = priority : newTask.priority = "medium";

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

form.addEventListener("submit", addTask); //! remove task

function removeTask(e) {
  if (e.target.dataset.action !== "delete") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var index = tasks.findIndex(function (task) {
    return task.id === +id;
  });
  tasks.splice(index, 1);
  parentNode.remove();
  checkEmptyList();
  saveToLocalStorage();
}

tasksList.addEventListener("click", removeTask);

function removeTaskData(e) {
  if (e.target.dataset.action !== "delete") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var index = tasksDone.findIndex(function (task) {
    return task.id === +id;
  });
  tasksDone.splice(index, 1);
  parentNode.remove();
  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

doneTasksList.addEventListener("click", removeTaskData); //! more button

function classMenuToggle(e) {
  var closestMoreElem = e.target.nextElementSibling;
  closestMoreElem.classList.toggle("show");
}

function moreBtn(e) {
  if (e.target.dataset.action !== "more") return;
  var moreElements = document.querySelectorAll(".moreElement");
  moreElements.forEach(function (elem) {
    if (elem.id !== e.target.id) {
      elem.classList.remove("show");
    }
  });
  classMenuToggle(e);
}

tasksList.addEventListener("click", moreBtn);
doneTasksList.addEventListener("click", moreBtn); //! mark task as completed

function doneTask(e) {
  if (e.target.dataset.action !== "done") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var taskObj = tasks.find(function (task) {
    return task.id === +id;
  });
  taskObj.done = !taskObj.done;
  var taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
  checkDoneTask(taskObj, e);
  renderTask(taskObj, doneTasksList);
  var index = tasks.findIndex(function (task) {
    return task.id === +id;
  });
  tasksDone.push(tasks[index]);
  tasks.splice(index, 1);
  parentNode.remove();
  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

tasksList.addEventListener("click", doneTask); //! mark task is uncompleted

function undoneTask(e) {
  if (e.target.dataset.action !== "done") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var taskObj = tasksDone.find(function (task) {
    return task.id === +id;
  });
  taskObj.done = !taskObj.done;
  var taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
  checkDoneTask(taskObj, e);
  renderTask(taskObj, tasksList);
  var index = tasksDone.findIndex(function (task) {
    return task.id === +id;
  });
  tasks.push(tasksDone[index]);
  tasksDone.splice(index, 1);
  parentNode.remove();
  checkEmptyList();
  saveToLocalStorage();
  doneTasksCounting();
}

doneTasksList.addEventListener("click", undoneTask); //! check done task and change list

function checkDoneTask(task, e) {
  var currList = "";

  if (task.list !== "Выполненные") {
    task.prevList = task.list;
    task.list = "Выполненные";
    currList = task.list;
  } else {
    task.list = task.prevList;
    currList = task.list;
  }

  var parentNode = e.target.closest("li");
  var taskList = parentNode.querySelector(".task-title-list");
  taskList.textContent = "".concat(currList);
  doneTasksCounting();
}

function doneTasksCounting() {
  var count = tasksDone.length;
  doneTasksCounter.textContent = "".concat(count);
} //! toggle done list


function toggleDoneList(e) {
  if (e.target !== doneTasksBtn) return;
  doneTasksBtn.classList.toggle("collapsed");
  doneTasksList.classList.toggle("none");
}

document.addEventListener("click", toggleDoneList); //! favorite task

function favoriteTask(e) {
  if (e.target.dataset.action !== "star") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var taskObj = tasks.find(function (task) {
    return task.id === +id;
  });
  taskObj.favorite = !taskObj.favorite;
  var taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--star");
  saveToLocalStorage();
}

tasksList.addEventListener("click", favoriteTask); //! favorite task in done list

function favoriteTaskDone(e) {
  if (e.target.dataset.action !== "star") return;
  var parentNode = e.target.closest("li");
  var id = parentNode.id;
  var taskObj = tasksDone.find(function (task) {
    return task.id === +id;
  });
  taskObj.favorite = !taskObj.favorite;
  var taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--star");
  saveToLocalStorage();
}

doneTasksList.addEventListener("click", favoriteTaskDone); //! add priority

function addPriority(e) {
  if (!e.target.dataset.priority) return;
  priority = e.target.dataset.priority;
  console.log(priority);
  return priority;
}

document.addEventListener("click", addPriority); //! show empty list

function checkEmptyList() {
  if (tasks.length === 0) {
    var emptyListHtml = "\n      <li id=\"emptyList\" class=\"list-group-item empty-list\">\n        <img src=\"./img/no-tasks.svg\" alt=\"Empty\" width=\"48\" class=\"mt-3\">\n        <div class=\"empty-list__title\">\u0412\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B</div>\n        <div class=\"empty-list__subtitle\">\u0423\u0420\u0410!</div>\n      </li>\n    ";
    tasksList.insertAdjacentHTML("afterbegin", emptyListHtml);
  }

  if (tasks.length > 0) {
    var emptyListElement = document.querySelector("#emptyList");
    emptyListElement ? emptyListElement.remove() : null;
  }
} //! save to local storage


function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
} //! open main menu


function openMainMenu(e) {
  mainDropdownMenu.classList.toggle("show");
}

dropdownMenuButton.addEventListener("click", openMainMenu); //! render task

function renderTask(task, place) {
  var spanClass = "task-title";
  var priority = "";

  if (task.done && task.favorite) {
    spanClass = "task-title task-title--done task-title--star";
  } else if (task.done) {
    spanClass = "task-title task-title--done";
  } else if (task.favorite) {
    spanClass = "task-title task-title--star";
  }

  switch (task.priority) {
    case "lowest":
      priority = '<img src="./img/lowest.svg" alt="lowest" width="18" height="18">';
      break;

    case "low":
      priority = '<img src="./img/low.svg" alt="low" width="18" height="18">';
      break;

    case "high":
      priority = '<img src="./img/high.svg" alt="high" width="18" height="18">';
      break;

    case "highest":
      priority = '<img src="./img/highest.svg" alt="highest" width="18" height="18">';
      break;

    default:
      priority = '<img src="./img/medium.svg" alt="medium" width="18" height="18">';
      break;
  }

  var taskHtml = "\n        <li id=\"".concat(task.id, "\" class=\"list-group-item d-flex justify-content-between task-item\">\n\t\t\t\t\t<span class=\"").concat(spanClass, "\">").concat(task.text, "</span>\n            <span class=\"task-title-priority\">").concat(priority, "</span>\n            <span class=\"task-title-list\">").concat(task.list, "</span>\n\t\t\t\t\t<div class=\"task-item__buttons\">\n\t\t\t\t\t\t<button type=\"button\" data-action=\"done\" class=\"btn-action\">\n\t\t\t\t\t\t\t<img src=\"./img/tick.svg\" alt=\"Done\" width=\"18\" height=\"18\">\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" data-action=\"delete\" class=\"btn-action\">\n\t\t\t\t\t\t\t<img src=\"./img/cross.svg\" alt=\"Done\" width=\"18\" height=\"18\">\n\t\t\t\t\t\t</button>\n            <div class=\"btn-group\">\n              <button data-action=\"more\" class=\"btn-action\" id=\"").concat(task.id, "\" type=\"button\">\n                <img src=\"./img/more.svg\" alt=\"More\" width=\"18\" height=\"18\">\n              </button>\n              <div id=\"").concat(task.id, "\" class=\"moreElement\"> \n                <div class=\"moreElement_wrapper\">\n                  <div class=\"moreElement_item\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u0434\u0437\u0430\u0434\u0430\u0447\u0443</div>\n                  <div class=\"moreElement_item\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C</div>\n                  <div class=\"moreElement_item\">\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A</div>\n                </div>\n              </div>\n            </div>\n            <button class=\"btn-action\" type=\"button\" data-action=\"star\">\n              <img src=\"./img/star.svg\" alt=\"Star\" width=\"18\" height=\"18\">\n            </button>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n      ");
  place.insertAdjacentHTML("beforeend", taskHtml);
}