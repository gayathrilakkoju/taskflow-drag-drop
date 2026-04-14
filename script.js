let draggedTask = null;

// Load on start
window.onload = function () {
    loadTasks();
    updateEmptyState();
};

// Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") return;

    let task = createTask(taskText);
    document.getElementById("todo").appendChild(task);

    saveTasks();
    updateEmptyState();

    input.value = "";
}

// Create Task
function createTask(text) {
    let task = document.createElement("div");
    task.className = "task";
    task.draggable = true;

    task.id = "task-" + Date.now();

    task.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;

    task.ondragstart = drag;
    task.ondragend = () => draggedTask = null;

    return task;
}

// Delete
function deleteTask(btn) {
    btn.parentElement.remove();
    saveTasks();
    updateEmptyState();
}

// Enter key
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

// Drag
function drag(event) {
    draggedTask = event.target;
    event.dataTransfer.setData("text", event.target.id);
}

// Allow drop
function allowDrop(event) {
    event.preventDefault();
}

// Drop + Merge
function drop(event) {
    event.preventDefault();

    let target = event.currentTarget;

    if (event.target.classList.contains("task")) {
        let targetText = event.target.querySelector("span").innerText;
        let draggedText = draggedTask.querySelector("span").innerText;

        event.target.querySelector("span").innerText =
            targetText + " + " + draggedText;

        draggedTask.remove();
    } else {
        target.appendChild(draggedTask);
    }

    saveTasks();
    updateEmptyState();
}

// Save
function saveTasks() {
    let columns = document.querySelectorAll(".column");
    let data = [];

    columns.forEach(col => {
        let colTasks = [];
        col.querySelectorAll(".task span").forEach(t => {
            colTasks.push(t.innerText);
        });
        data.push(colTasks);
    });

    localStorage.setItem("tasks", JSON.stringify(data));
}

// Load
function loadTasks() {
    let data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;

    let columns = document.querySelectorAll(".column");

    data.forEach((colTasks, index) => {
        colTasks.forEach(text => {
            let task = createTask(text);
            columns[index].appendChild(task);
        });
    });
}

// Empty state
function updateEmptyState() {
    let columns = document.querySelectorAll(".column");

    columns.forEach(col => {
        let existingMsg = col.querySelector(".empty-msg");

        if (col.querySelectorAll(".task").length === 0) {
            if (!existingMsg) {
                let msg = document.createElement("p");
                msg.innerText = "No tasks yet";
                msg.className = "empty-msg";
                col.appendChild(msg);
            }
        } else {
            if (existingMsg) existingMsg.remove();
        }
    });
}