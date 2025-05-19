document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // clear
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span onclick="toggleTask('${task._id}')" class="${task.completed ? 'completed' : ''}">
        ${task.text}
      </span>
      <button class="delete-btn" onclick="removeTask('${task._id}')">X</button>
    `;
    taskList.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  loadTasks();
}

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "PATCH" });
  loadTasks();
}

async function removeTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}
