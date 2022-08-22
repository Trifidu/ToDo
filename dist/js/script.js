/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/elements */ "./src/js/modules/elements.js");

window.addEventListener("DOMContentLoaded", () => {
  //! load render
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(task => renderTask(task, tasksList));
  }

  if (localStorage.getItem("tasksDone")) {
    tasksDone = JSON.parse(localStorage.getItem("tasksDone"));
    tasksDone.forEach(task => renderTask(task, doneTasksList));
  }

  if (localStorage.getItem("lists")) {
    lists = JSON.parse(localStorage.getItem("lists"));
  }

  checkEmptyList();
  doneTasksCounting(); //! add task and list

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
      endDate: dateText
    };
    priority.length > 0 ? newTask.priority = priority : newTask.priority = "medium";

    if (!_modules_elements__WEBPACK_IMPORTED_MODULE_0__["lists"].includes(newTask.list)) {
      _modules_elements__WEBPACK_IMPORTED_MODULE_0__["lists"].push(newTask.list);
    }

    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].push(newTask);
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
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const index = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].findIndex(task => task.id === +id);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].splice(index, 1);
    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
  }

  tasksList.addEventListener("click", removeTask);

  function removeTaskData(e) {
    if (e.target.dataset.action !== "delete") return;
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const index = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].findIndex(task => task.id === +id);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].splice(index, 1);
    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
    doneTasksCounting();
  }

  doneTasksList.addEventListener("click", removeTaskData); //! more button

  function classMenuToggle(e) {
    const closestMoreElem = e.target.nextElementSibling;
    closestMoreElem.classList.toggle("show");
  }

  function moreBtn(e) {
    if (e.target.dataset.action !== "more") return;
    const moreElements = document.querySelectorAll(".moreElement");
    moreElements.forEach(elem => {
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
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const taskObj = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].find(task => task.id === +id);
    taskObj.done = !taskObj.done;
    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
    checkDoneTask(taskObj, e);
    renderTask(taskObj, doneTasksList);
    const index = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].findIndex(task => task.id === +id);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].push(_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"][index]);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].splice(index, 1);
    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
    doneTasksCounting();
  }

  tasksList.addEventListener("click", doneTask); //! mark task is uncompleted

  function undoneTask(e) {
    if (e.target.dataset.action !== "done") return;
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const taskObj = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].find(task => task.id === +id);
    taskObj.done = !taskObj.done;
    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
    checkDoneTask(taskObj, e);
    renderTask(taskObj, tasksList);
    const index = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].findIndex(task => task.id === +id);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].push(_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"][index]);
    _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].splice(index, 1);
    parentNode.remove();
    checkEmptyList();
    saveToLocalStorage();
    doneTasksCounting();
  }

  doneTasksList.addEventListener("click", undoneTask); //! check done task and change list

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
    const count = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].length;
    doneTasksCounter.textContent = `${count}`;
  } //! toggle done list


  function toggleDoneList(e) {
    if (e.target !== doneTasksBtn) return;
    doneTasksBtn.classList.toggle("collapsed");
    doneTasksList.classList.toggle("none");
  }

  document.addEventListener("click", toggleDoneList); //! favorite task

  function favoriteTask(e) {
    if (e.target.dataset.action !== "star") return;
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const taskObj = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].find(task => task.id === +id);
    taskObj.favorite = !taskObj.favorite;
    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--star");
    saveToLocalStorage();
  }

  tasksList.addEventListener("click", favoriteTask); //! favorite task in done list

  function favoriteTaskDone(e) {
    if (e.target.dataset.action !== "star") return;
    const parentNode = e.target.closest("li");
    const id = parentNode.id;
    const taskObj = _modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"].find(task => task.id === +id);
    taskObj.favorite = !taskObj.favorite;
    const taskTitle = parentNode.querySelector(".task-title");
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
    if (_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].length === 0) {
      const emptyListHtml = `
      <li id="emptyList" class="list-group-item empty-list">
        <img src="./img/no-tasks.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Все задачи выполнены</div>
        <div class="empty-list__subtitle">УРА!</div>
      </li>
    `;
      tasksList.insertAdjacentHTML("afterbegin", emptyListHtml);
    }

    if (_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"].length > 0) {
      const emptyListElement = document.querySelector("#emptyList");
      emptyListElement ? emptyListElement.remove() : null;
    }
  } //! save to local storage


  function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasks"]));
    localStorage.setItem("lists", JSON.stringify(_modules_elements__WEBPACK_IMPORTED_MODULE_0__["lists"]));
    localStorage.setItem("tasksDone", JSON.stringify(_modules_elements__WEBPACK_IMPORTED_MODULE_0__["tasksDone"]));
  } //! open main menu


  function openMainMenu(e) {
    mainDropdownMenu.classList.toggle("show");
  }

  dropdownMenuButton.addEventListener("click", openMainMenu); //! render task

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
});

/***/ }),

/***/ "./src/js/modules/elements.js":
/*!************************************!*\
  !*** ./src/js/modules/elements.js ***!
  \************************************/
/*! exports provided: form, taskInput, listInput, descrInput, dateInput, tasksList, emptyList, doneTasksBtn, doneTasksList, doneTasksCounter, dropdownMenuButton, mainDropdownMenu, tasks, tasksDone, lists, priority */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "form", function() { return form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "taskInput", function() { return taskInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listInput", function() { return listInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "descrInput", function() { return descrInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateInput", function() { return dateInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tasksList", function() { return tasksList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emptyList", function() { return emptyList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doneTasksBtn", function() { return doneTasksBtn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doneTasksList", function() { return doneTasksList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doneTasksCounter", function() { return doneTasksCounter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dropdownMenuButton", function() { return dropdownMenuButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mainDropdownMenu", function() { return mainDropdownMenu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tasks", function() { return tasks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tasksDone", function() { return tasksDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lists", function() { return lists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "priority", function() { return priority; });
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
const dropdownMenuButton = document.querySelector("#dropdownMenuButton");
const mainDropdownMenu = document.querySelector("#mainDropdownMenu");
let tasks = [];
let tasksDone = [];
let lists = ["Выполненные"];
let priority = ""; // export let arrays = {
//   tasks: [],
//   tasksDone: [],
//   lists: ["Выполненные"],
// };

/***/ })

/******/ });
//# sourceMappingURL=script.js.map