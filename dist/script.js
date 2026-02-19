"use strict";
class TaskManager {
    constructor() {
        this.key = "tasks";
        this.tasks = TasksStorageManager.load(this.key);
    }
    addTask(task) {
        this.tasks.push({ task, status: false, isExtended: false });
        TasksStorageManager.store(this.key, this.tasks);
    }
    deleteTask(index) {
        if (index > -1)
            this.tasks.splice(index, 1);
        TasksStorageManager.store(this.key, this.tasks);
    }
    toggleStatus(index) {
        if (index > -1)
            this.tasks[index].status = !this.tasks[index].status;
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    }
    toggleExtended(index) {
        if (index > -1)
            this.tasks[index].isExtended = !this.tasks[index].isExtended;
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    }
    getTasks() {
        return this.tasks;
    }
    clearCompleted() {
        console.log(this.tasks);
        this.tasks = this.tasks.filter((task) => !task.status);
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    }
    clearAll() {
        this.tasks = [];
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    }
}
class TasksStorageManager {
    constructor() { }
    static store(key, tasks) {
        localStorage.setItem(key, JSON.stringify(tasks));
    }
    static load(key) {
        return JSON.parse(localStorage.getItem(key) ?? JSON.stringify([]));
    }
}
let taskManager = new TaskManager();
document.getElementById("TaskForm").onsubmit =
    handleSubmit;
function contentGenrator(index, task, status, isExtended) {
    if (task.length > 20 && !isExtended)
        return (task.slice(0, 20) +
            "..." +
            `<span class="expandButton" onClick="taskManager.toggleExtended(${index})">show more</span>`);
    if (task.length > 20 && isExtended)
        return (task +
            `<span class="expandButton" onClick="taskManager.toggleExtended(${index})">show less</span>`);
    return task;
}
function CreateTaskCard(index, { task, status, isExtended }) {
    return `<li class="TaskCard scalingHover">
          <input type="checkbox" name="" ${status ? "checked" : ""} id="" onChange="taskManager.toggleStatus(${index})" /><p  class=${status ? "done" : ""}>${contentGenrator(index, task, status, isExtended)}</p>
          <button class="deleteButton" onClick="handleDelete(${index})"></button> 
        </li>`;
}
function handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
    const task = document.getElementById("taskInput").value;
    if (task.trim().length > 0)
        taskManager.addTask(task);
    document.getElementById("taskInput").value = "";
    buildTaskList();
}
function handleDelete(index) {
    taskManager.deleteTask(index);
    buildTaskList();
}
function buildTaskList() {
    let i = 0;
    const tasks = taskManager.getTasks();
    document.getElementById("TaskList").innerHTML =
        tasks.length
            ? tasks.map((task) => CreateTaskCard(i++, task)).join("\n")
            : "<p class='mutedMessage'>no tasks</p>";
}
buildTaskList();
document.getElementById("clearCompletedBtn").onclick =
    () => taskManager.clearCompleted();
document.getElementById("clearAllBtn").onclick = () => taskManager.clearAll();
