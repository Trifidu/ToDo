//! elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

//! add task
function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  const taskHtml = `
        <li class="list-group-item d-flex justify-content-between task-item">
					<span class="task-title">${taskText}</span>
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
  if (e.target.dataset.action === "delete") {
    e.preventDefault();
    const parentNode = e.target.closest("li");
    parentNode.remove();
  }

  if (tasksList.children.length < 2) {
    emptyList.classList.remove("none");
  }
}

tasksList.addEventListener("click", removeTask);
