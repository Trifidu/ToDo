export const form = document.querySelector("#form");
export const taskInput = document.querySelector("#taskInput");
export const listInput = document.querySelector("#listInput");
export const descrInput = document.querySelector("#descrInput");
export const dateInput = document.querySelector("#dateInput");
export const tasksList = document.querySelector("#tasksList");
export const emptyList = document.querySelector("#emptyList");
export const doneTasksBtn = document.querySelector("#doneTasks");
export const doneTasksList = document.querySelector("#accordionDone");
export const doneTasksCounter = document.querySelector("#doneTasksCounter");
export const dropdownMenuButton = document.querySelector("#dropdownMenuButton");
export const mainDropdownMenu = document.querySelector("#mainDropdownMenu");

export let tasks = [];
export let tasksDone = [];
export let lists = ["Выполненные"];

export let priority = "";

// export let arrays = {
//   tasks: [],
//   tasksDone: [],
//   lists: ["Выполненные"],
// };
