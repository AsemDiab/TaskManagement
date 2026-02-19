var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.key = "tasks";
        this.tasks = TasksStorageManager.load(this.key);
    }
    TaskManager.prototype.addTask = function (task) {
        this.tasks.push({ task: task, status: false });
        TasksStorageManager.store(this.key, this.tasks);
    };
    TaskManager.prototype.deleteTask = function (index) {
        if (index > -1)
            this.tasks.splice(index, 1);
        TasksStorageManager.store(this.key, this.tasks);
    };
    TaskManager.prototype.toggleStatus = function (index) {
        if (index > -1)
            this.tasks[index].status = !this.tasks[index].status;
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    };
    TaskManager.prototype.getTasks = function () {
        return this.tasks;
    };
    TaskManager.prototype.clearCompleted = function () {
        console.log(this.tasks);
        this.tasks = this.tasks.filter(function (task) { return !task.status; });
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    };
    TaskManager.prototype.clearAll = function () {
        this.tasks = [];
        TasksStorageManager.store(this.key, this.tasks);
        buildTaskList();
    };
    return TaskManager;
}());
var TasksStorageManager = /** @class */ (function () {
    function TasksStorageManager() {
    }
    TasksStorageManager.store = function (key, tasks) {
        localStorage.setItem(key, JSON.stringify(tasks));
    };
    TasksStorageManager.load = function (key) {
        var _a;
        return JSON.parse((_a = localStorage.getItem(key)) !== null && _a !== void 0 ? _a : JSON.stringify([]));
    };
    return TasksStorageManager;
}());
document.getElementById("TaskForm").onsubmit =
    handleSubmit;
var taskManager = new TaskManager();
function CreateTaskCard(index, _a) {
    var task = _a.task, status = _a.status;
    console.log(index, { task: task, status: status });
    return "<li class=\"TaskCard scalingHover\">\n          <input type=\"checkbox\" name=\"\" ".concat(status ? "checked" : "", " id=\"\" onChange=\"taskManager.toggleStatus(").concat(index, ")\" /><p class=").concat(status ? "done" : "", ">").concat(task, "</p>\n          <button class=\"deleteButton\" onClick=\"handleDelete(").concat(index, ")\"></button> \n        </li>");
}
function handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
    var task = document.getElementById("taskInput").value;
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
    var i = 0;
    var tasks = taskManager.getTasks();
    document.getElementById("TaskList").innerHTML =
        tasks.length
            ? tasks.map(function (task) { return CreateTaskCard(i++, task); }).join("\n")
            : "<p class='mutedMessage'>no tasks</p>";
}
buildTaskList();
document.getElementById("clearCompletedBtn").onclick =
    function () { return taskManager.clearCompleted(); };
document.getElementById("clearAllBtn").onclick = function () {
    return taskManager.clearAll();
};
