//! elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

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

  if (tasksList.children.length > 1) {
    emptyList.classList.add("none");
  }
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

  if (tasksList.children.length < 2) {
    emptyList.classList.remove("none");
  }
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
}

tasksList.addEventListener("click", doneTask);
