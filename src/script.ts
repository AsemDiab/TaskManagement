type Task = { task: string; status: boolean };
class TaskManager {
  private tasks: Task[];
  private key: string = "tasks";
  constructor() {
    this.tasks = TasksStorageManager.load(this.key);
  }
  addTask(task: string) {
    this.tasks.push({ task, status: false });
    TasksStorageManager.store(this.key, this.tasks);
  }

  deleteTask(index: number) {
    if (index > -1) this.tasks.splice(index, 1);
    TasksStorageManager.store(this.key, this.tasks);
  }

  toggleStatus(index: number) {
    if (index > -1) this.tasks[index].status = !this.tasks[index].status;
    TasksStorageManager.store(this.key, this.tasks);
    buildTaskList();
  }

  getTasks(): Task[] {
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
  constructor() {}

  static store(key: string, tasks: Task[]) {
    localStorage.setItem(key, JSON.stringify(tasks));
  }
  static load(key: string): Task[] {
    return JSON.parse(
      (localStorage.getItem(key) as string) ?? JSON.stringify([]),
    ) as Task[];
  }
}
let taskManager = new TaskManager();

(document.getElementById("TaskForm") as HTMLFormElement).onsubmit =
  handleSubmit;

function CreateTaskCard(index: number, { task, status }: Task) {
  console.log(index, { task, status });

  return `<li class="TaskCard scalingHover">
          <input type="checkbox" name="" ${status ? "checked" : ""} id="" onChange="taskManager.toggleStatus(${index})" /><p class=${status ? "done" : ""}>${task}</p>
          <button class="deleteButton" onClick="handleDelete(${index})"></button> 
        </li>`;
}

function handleSubmit(e: Event) {
  e.preventDefault();
  console.log("submit");
  const task = (document.getElementById("taskInput") as HTMLInputElement).value;
  if (task.trim().length > 0) taskManager.addTask(task);
  (document.getElementById("taskInput") as HTMLInputElement).value = "";
  buildTaskList();
}

function handleDelete(index: number) {
  taskManager.deleteTask(index);

  buildTaskList();
}

function buildTaskList() {
  let i = 0;
  const tasks = taskManager.getTasks();
  (document.getElementById("TaskList") as HTMLUListElement).innerHTML =
    tasks.length
      ? tasks.map((task) => CreateTaskCard(i++, task)).join("\n")
      : "<p class='mutedMessage'>no tasks</p>";
}
buildTaskList();

(document.getElementById("clearCompletedBtn") as HTMLButtonElement).onclick =
  () => taskManager.clearCompleted();

(document.getElementById("clearAllBtn") as HTMLButtonElement).onclick = () =>
  taskManager.clearAll();
