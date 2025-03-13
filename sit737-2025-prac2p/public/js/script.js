document.addEventListener("DOMContentLoaded", ()=>{
    loadTasks();
});

const addTask = ()=> {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") return;

    let taskList = document.getElementById("taskList");

    let li = document.createElement("li");
    li.innerHTML = `<span onclick="toggleTask(this)">${taskText}</span>
                    <button class="delete-btn" onclick="removeTask(this)">X</button>`;

    taskList.appendChild(li);
    saveTasks();

    input.value = "";
}

const toggleTask = (task)=> {
    task.classList.toggle("completed");
    saveTasks();
}

const removeTask = (task) =>{
    task.parentElement.remove();
    saveTasks();
}

const saveTasks = ()=> {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.querySelector("span").classList.contains("completed"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const loadTasks = ()=> {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");

    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `<span onclick="toggleTask(this)" class="${task.completed ? 'completed' : ''}">${task.text}</span>
                        <button class="delete-btn" onclick="removeTask(this)">X</button>`;
        taskList.appendChild(li);
    });
}
