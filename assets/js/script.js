var date = new Date();
var day = date.getDate();
var year = date.getFullYear();
let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let weekDayArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var month = monthArray[date.getMonth()];
var weekDay = weekDayArray[date.getDay()];

var tasks = [];
var userLists = [];
// var completedList = [];
// var importantList = [];

document.querySelector("#todayDay").innerHTML = day;
document.querySelector("#todayMonth").innerHTML = month;
document.querySelector("#todayWeekday").innerHTML = weekDay;
document.querySelector("#todayYear").innerHTML = year;


document.addEventListener("click", clickListener);
document.addEventListener("mouseover", hoverListener);
document.addEventListener("mouseout", hoverListener);

function clickListener(event) {
    if (event.target.id == "addTask") document.querySelector("#modal").classList.toggle("hidden");
    if (event.target.id == "cancel_btn" || event.target.id == "modal") cancelForm();
    if (event.target.id == "save_btn") generateTask("modal");
    if (event.target.name == "main-category") changeCategory(event.target);
    if (event.target.classList.contains("deleteTask")) removeTask(event.target.parentNode.querySelector("label:first-child"));
    if (event.target.parentNode.parentNode.querySelector(".importantCheckMark")) {
        if (!event.target.parentNode.parentNode.querySelector(".importantInput").checked) {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "200"
        } else {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "800"
        }
        updateTasks();
    }
    if (event.target.id == "addList") {
        document.querySelector("#listModal-container").classList.remove("hidden");
        document.querySelector("#listModal").focus();
    };
    if (event.target.id == "cancelList") listModalPopDown();
    if (event.target.id == "confirmList") saveList(event.target);
}

function hoverListener(event) {
    if (event.target.parentNode.classList.contains("important-hover")) {
        var buttonImportant = event.target.parentNode.querySelector(".importantCheckMark");
        var buttonDelete = event.target.parentNode.querySelector(".deleteTask");
        buttonImportant.classList.toggle("hidden");
        buttonDelete.classList.toggle("hidden");
    } else if (event.target.parentNode.parentNode.classList.contains("important-hover")) {
        var buttonImportant = event.target.parentNode.parentNode.querySelector(".importantCheckMark");
        var buttonDelete = event.target.parentNode.parentNode.querySelector(".deleteTask");
        buttonImportant.classList.toggle("hidden");
        buttonDelete.classList.toggle("hidden");
    }
}

function cancelForm() {
    document.querySelector("#modal").classList.toggle("hidden");
    document.querySelector(".modal-content form").reset();
    // document.querySelector("#completedCheck").checked = false;
    // document.querySelector("#importantCheck").checked = false;
}

function generateTask(from) {
    var title = document.querySelector("#taskTitle").value;
    var description = document.querySelector("#taskDescription").value;
    var completedCheck = document.querySelector("#completedCheck").checked;
    var importantCheck = document.querySelector("#importantCheck").checked;
    var customList = document.querySelector("#customList").selected;
    var color = document.querySelector("#taskColor").selected;

    if (title && description) {
        var newTask = new Task(title, description, completedCheck, importantCheck, customList, color);

        tasks.push(newTask);
        console.log(tasks);

        // if (completedCheck) {
        //     completedList.push(newTask);
        // }
        // if (importantCheck) {
        //     completedList.push(newTask);
        // }
        storeTasks();
        updateTasks(from);
        placeTask();
        cancelForm();
    }
}


function placeTask() {

    //? Obtain lists from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (listsJSON === null) { //? Check if there is no localStorage
        tasks = [];
    } else {
        tasks = listsJSON;
    };

    var oldEvents = document.querySelectorAll("#tasks li"); //? Select all li (tasks) currenty in display
    var tasksUl = document.querySelector("#tasksUl"); //? Select the "tasks display"

    //? Set tasksDisplay as the localStorage tasks
    var tasksDisplay = tasks;

    //? Remove old values in the tasks display
    oldEvents.forEach(element => {
        element.remove();
    })

    //? Place new updated tasks in display
    var idNumber = 0;
    var idNumber2 = 0;
    tasksDisplay.forEach(element => {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var span = document.createElement("span");
        var input = document.createElement("input");
        var important = document.createElement("label");
        var importantCheckMark = document.createElement("span");
        var importantInput = document.createElement("input");
        var deleteTask = document.createElement("img");

        input.type = "checkbox";
        input.id = "completed" + element.title + idNumber++;
        input.classList.add("completedInput")
        input.checked = element.completed;
        importantInput.type = "checkbox";
        importantInput.id = "important" + element.title + idNumber2++;
        importantInput.classList.add("importantInput")
        importantInput.checked = element.important;

        li.classList.add("important-hover");
        li.classList.add("tasksLi");
        label.classList.add("container__custom__checkbox");
        label.classList.add("taskLabel");
        label.innerHTML = element.title;
        span.classList.add("checkmark");

        deleteTask.src = "assets/img/clear.svg";
        deleteTask.classList.add("deleteTask");
        deleteTask.classList.add("hidden");
        deleteTask.height = "15";
        deleteTask.width = "15";

        important.classList.add("importantCheckMark");
        important.classList.add("container__custom__checkbox");
        important.classList.add("hidden");
        var innerHt = document.createElement("span");
        innerHt.textContent = "Important";
        innerHt.classList.add("testeo-importante");
        important.innerHTML = "Important";
        importantCheckMark.classList.add("checkmark");

        if (element.important) {
            label.style.fontWeight = "800"
        } else {
            label.style.fontWeight = "200"
        }

        important.appendChild(importantInput);
        important.appendChild(importantCheckMark);

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        li.appendChild(important);
        li.appendChild(deleteTask);
        tasksUl.appendChild(li);

    })
}

function updateTasks(from) {

    //? Update localStorage with new values
    var tasksJSON = JSON.parse(localStorage.getItem("tasksAll"));
    if (tasksJSON === null) {
        tasks = [];
    } else {
        tasks = tasksJSON;
    };

    var modifier = 0;

    from == "modal" ? modifier = 1 : modifier = 0;

    //? Obtain current values for checkbox from completed and important
    var currentCInput = document.querySelectorAll("#tasks .completedInput");
    var currentIInput = document.querySelectorAll("#tasks .importantInput");

    //? Update tasks values with current values
    for (let i = 0; i < tasks.length - modifier; i++) {
        if (tasks[i].completed != currentCInput[i].checked) {
            tasks[i].completed = currentCInput[i].checked;
        }
        if (tasks[i].important != currentIInput[i].checked) {
            tasks[i].important = currentIInput[i].checked;
        }
    }


    //? Store new values to localStorage
    storeTasks();
}

function removeTask(element) {

    console.log(tasks);
    updateTasks();

    var tasksJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (tasksJSON === null) {
        tasks = [];
    } else {
        tasks = tasksJSON;
    };

    let index;
    tasks.forEach(task => {
        if (task.title == element.textContent) {
            index = tasks.indexOf(task);
        }
    })

    if (index > -1) {
        tasks.splice(index, 1);
    }

    // array = [2, 9]
    console.log(tasks);

    storeTasks();
    placeTask();
}

function storeTasks() {
    var JSONTasks = JSON.stringify(tasks);
    localStorage.setItem("tasksAll", JSONTasks);
    console.log("tasks stored");
}

function changeCategory(category) {

    var allCategory = document.querySelector("#categoryAll");
    var importantCategory = document.querySelector("#categoryImportant");
    var completedCategory = document.querySelector("#categoryCompleted");
    var allIMG = document.querySelector("#allIMG");
    var impIMG = document.querySelector("#impIMG");
    var comIMG = document.querySelector("#comIMG");

    var allContainer = allCategory.parentElement;
    var importantContainer = importantCategory.parentElement;
    var completedContainer = completedCategory.parentElement;

    if (category.id == "categoryAll") {
        allContainer.style.background = "rgb(253, 158, 43)";
        allIMG.src = "assets/img/archive2.svg"
        importantContainer.style.background = "rgba(255, 255, 255, 0.15)";
        impIMG.src = "assets/img/warning.svg"
        completedContainer.style.background = "rgba(255, 255, 255, 0.15)";
        comIMG.src = "assets/img/check.svg"
    } else if (category.id == "categoryImportant") {
        allContainer.style.background = "rgba(255, 255, 255, 0.15)";
        allIMG.src = "assets/img/archive.svg"
        importantContainer.style.background = "rgb(252, 71, 65)";
        impIMG.src = "assets/img/warning2.svg"
        completedContainer.style.background = "rgba(255, 255, 255, 0.15)";
        comIMG.src = "assets/img/check.svg"
    } else if (category.id == "categoryCompleted") {
        allContainer.style.background = "rgba(255, 255, 255, 0.15)";
        allIMG.src = "assets/img/archive.svg"
        importantContainer.style.background = "rgba(255, 255, 255, 0.15)";
        impIMG.src = "assets/img/warning.svg"
        completedContainer.style.background = "rgb(28, 135, 251)";
        comIMG.src = "assets/img/check2.svg"
    }
}

function saveList(list) {
    var newList = (list.parentNode.parentNode.querySelector("input").value);

    userLists.push(newList);
    
    // storeTasks();
    // updateTasks(from);
    // placeTask();
    // cancelForm();

    // storeList();
    // updateList("modal");
    placeList();
    listModalPopDown();


}

function listModalPopUp() {
    document.querySelector("#listModal-container").classList.remove("hidden");
    document.querySelector("#listModal").focus();
}

function listModalPopDown() {
    document.querySelector("#listModal-container").classList.add("hidden");
    document.querySelector("#listModal").value = "";
}

function storeList() {
    var JSONTasks = JSON.stringify(userLists);
    localStorage.setItem("userLists", JSONTasks);
    console.log("lists stored");
}
/*
function placeList() {

    //? Obtain tasks from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("userLists"));

    if (listsJSON === null) { //? Check if there is no localStorage
        userLists = [];
    } else {
        userLists = listsJSON;
    };

    var oldLists = document.querySelectorAll("#userLists-container li"); //? Select all li (tasks) currenty in display
    var listsUl = document.querySelector("#userLists-container"); //? Select the "tasks display"

    //? Set tasksDisplay as the localStorage tasks
    var listsDisplay = userLists;

    //? Remove old values in the tasks display
    oldLists.forEach(element => {
        element.remove();
    })

    //? Place new updated tasks in display
    var idNumber = 0;
    var idNumber2 = 0;
    listsDisplay.forEach(element => {
function placeList() {

    //? Obtain lists from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (listsJSON === null) { //? Check if there is no localStorage
        tasks = [];
    } else {
        tasks = listsJSON;
    };

    var oldEvents = document.querySelectorAll("#tasks li"); //? Select all li (tasks) currenty in display
    var tasksUl = document.querySelector("#tasksUl"); //? Select the "tasks display"

    //? Set tasksDisplay as the localStorage tasks
    var tasksDisplay = tasks;

    //? Remove old values in the tasks display
    oldEvents.forEach(element => {
        element.remove();
    })

    //? Place new updated tasks in display
    var idNumber = 0;
    var idNumber2 = 0;
    tasksDisplay.forEach(element => {
        var li = document.createElement("li");
        var l
*/
// function updateList(from) {

//     //? Update localStorage with new values
//     var listsJSON = JSON.parse(localStorage.getItem("userLists"));
//     if (listsJSON === null) {
//         userLists = [];
//     } else {
//         userLists = listsJSON;
//     };

//     var modifier = 0;

//     from == "modal" ? modifier = 1 : modifier = 0;

//     // //? Obtain current values for checkbox from completed and important
//     // var currentCInput = document.querySelectorAll("#tasks .completedInput");
//     // var currentIInput = document.querySelectorAll("#tasks .importantInput");

//     //? Update tasks values with current values
//     for (let i = 0; i < tasks.length - modifier; i++) {
//         if (tasks[i].completed != currentCInput[i].checked) {
//             tasks[i].completed = currentCInput[i].checked;
//         }
//         if (tasks[i].important != currentIInput[i].checked) {
//             tasks[i].important = currentIInput[i].checked;
//         }
//     }


//     //? Store new values to localStorage
//     storeTasks();
// }

placeTask();