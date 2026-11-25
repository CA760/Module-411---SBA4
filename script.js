// call HTML elements

let taskInput = document.getElementById("taskInput");
let categoryInput = document.getElementById("categoryInput");
let deadlineInput = document.getElementById("deadlineInput");
let statusInput = document.getElementById("statusInput");

let addTaskButton = document.getElementById("addTaskButton");
let taskList = document.getElementById("taskList");

let filterStatus = document.getElementById("filterStatus");
let filterCategory = document.getElementById("filterCategory");


// Store tasks in an array

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Save tasks

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add a new task

addTaskButton.addEventListener("click", function() {

    let taskText = taskInput.value;

    if (taskText === "" || deadlineInput.value === "") {
        alert("Please enter a task and deadline!");
        return;
    }

    let task = {
        name: taskText,
        category: categoryInput.value,
        deadline: deadlineInput.value,
        status: statusInput.value
    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskInput.value = "";
    deadlineInput.value = "";

    taskInput.focus();

});


// Display tasks

function displayTasks() {

    taskList.innerHTML = "";

    let today = new Date().toLocaleDateString("en-CA");

    for (let i = 0; i < tasks.length; i++) {

        // Check overdue tasks

        if (tasks[i].status !== "Completed" &&
            tasks[i].deadline < today) {

            tasks[i].status = "Overdue";

        }

        // Apply filters

        if ((filterStatus.value === "All" ||
             tasks[i].status === filterStatus.value) &&

            (filterCategory.value === "All" ||
             tasks[i].category === filterCategory.value)) {

            let li = document.createElement("li");

            li.innerText =
                "Task: " + tasks[i].name +
                " | Category: " + tasks[i].category +
                " | Deadline: " + tasks[i].deadline +
                " | Status: " + tasks[i].status;


            // Complete button

            let completeBtn = document.createElement("button");

            completeBtn.classList.add("complete-btn");

            completeBtn.innerText = "Complete";


            // Remove button

            let removeBtn = document.createElement("button");

            removeBtn.classList.add("remove-btn");

            removeBtn.innerText = "Remove";


            li.append(completeBtn, removeBtn);

            taskList.append(li);

        }

    }

    saveTasks();

}


// Update and remove tasks

taskList.addEventListener("click", function(event) {

    if (event.target.classList.contains("complete-btn")) {

        let li = event.target.closest("li");

        let index = Array.from(taskList.children).indexOf(li);

        let taskName = li.innerText.split(" | ")[0].replace("Task: ", "");

        for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].name === taskName &&
                tasks[i].status !== "Completed") {

                tasks[i].status = "Completed";
                break;

            }

        }

        saveTasks();

        displayTasks();

    }


    if (event.target.classList.contains("remove-btn")) {

        let li = event.target.closest("li");

        let taskName = li.innerText.split(" | ")[0].replace("Task: ", "");

        for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].name === taskName) {

                tasks.splice(i, 1);
                break;

            }

        }

        saveTasks();

        li.remove();

    }

});


// Filter tasks

filterStatus.addEventListener("change", function() {
    displayTasks();
});

filterCategory.addEventListener("change", function() {
    displayTasks();
});


// Load saved tasks

displayTasks();