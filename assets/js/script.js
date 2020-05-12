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
    console.log(event.target)
    if (event.target.id == "addTask") document.querySelector("#modal").classList.toggle("hidden");
    if (event.target.id == "cancel_btn" || event.target.id == "modal") cancelForm();
    if (event.target.id == "save_btn") generateTask("modal");
    //if (event.target.name == "main-category") changeCategory(event.target);
    if (event.target.classList.contains("deleteTask")) removeTask(event.target.parentNode.querySelector("label:first-child"));
    if (event.target.classList.contains("importantInput")) {
        if (!event.target.parentNode.parentNode.querySelector(".importantInput").checked) {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "200";
        } else {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "800";
        }
        updateTasks();
    }
    if (event.target.classList.contains("completedInput")) updateTasks();
    if (event.target.id == "addList") {
        document.querySelector("#listModal-container").classList.remove("hidden");
        document.querySelector("#listModal").focus();
    };
    if (event.target.id == "cancelList") listModalPopDown();
    if (event.target.id == "confirmList") saveList(event.target);
    if (event.target.name == "section") placeTask();
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
}

function generateTask(from) {
    var title = document.querySelector("#taskTitle").value;
    var description = document.querySelector("#taskDescription").value;
    var completedCheck = document.querySelector("#completedCheck").checked;
    var importantCheck = document.querySelector("#importantCheck").checked;
    var customList = document.querySelector("#customList").value;
    var color = document.querySelector("#taskColor").value;

    if (title && description) {
        var newTask = new Task(title, description, completedCheck, importantCheck, customList, color);

        tasks.push(newTask);
        console.log(tasks);

        storeTasks();
        updateTasks(from);
        placeTask();
        cancelForm();
    }
}


function placeTask() {

    console.log("placeTask executed")

    //? Obtain lists from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (listsJSON === null) { //? Check if there is no localStorage
        tasks = [];
    } else {
        tasks = listsJSON;
    };

    var oldEvents = document.querySelectorAll("#tasks li"); //? Select all li (tasks) currenty in display
    var tasksUl = document.querySelector("#tasksUl"); //? Select the "tasks display"

    var activeList;
    
    document.querySelectorAll("input[type='radio']").forEach(element => {
        if(element.checked){
            activeList = element.parentNode.textContent;
        }
    })

    var allInput = document.querySelector("#categoryAll");
    var importantInput = document.querySelector("#categoryImportant");
    var completedInput = document.querySelector("#categoryCompleted");

    changeCategory();

    if(allInput.checked){
        console.log("all selected");
        var tasksDisplay = tasks;
    }else if(importantInput.checked){
        console.log("important selected")
        var tasksDisplay = tasks.filter(task => task.important == true);
    }else if(completedInput.checked){
        console.log("completed selected")
        var tasksDisplay = tasks.filter(task => task.completed == true);
    }else{
        console.log("other selected");
        // var tasksDisplay = checkUserList();
        var tasksDisplay = tasks.filter(task => task.customList == activeList);
        console.log(activeList)
        console.log(tasksDisplay)
    }

    //? Set tasksDisplay as the localStorage tasks
    // var tasksDisplay = tasks;

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
        element.completed ? label.classList.add("lineThrough") : label.classList.remove("lineThrough");

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
    var currentCInput = document.querySelectorAll(".taskLabel");
    // var currentIInput = document.querySelectorAll(".importantCheckMark");

    //? Update tasks values with current values

    currentCInput.forEach(cInput =>{
        tasks.forEach(task => {
            console.log(task.title + " task.title");
            console.log(cInput.textContent + " cInput.textContent");
            if (task.title == cInput.textContent){
                var currentCompleted = cInput.querySelector(".completedInput");
                var currentImportant = cInput.parentNode.querySelector(".importantInput");
                console.log ("task.title = cInput");
                console.log (currentCompleted.checked);

                if(task.completed != currentCompleted.checked){
                    task.completed = currentCompleted.checked;

                }
                if(task.important != currentImportant.checked){
                    task.important = currentImportant.checked;
                }
            }
            console.log("--------------------")
        });
    });
    // for (let i = 0; i < tasks.length - modifier; i++) {
    //     if (tasks[i].completed != currentCInput[i].checked) {
    //         tasks[i].completed = currentCInput[i].checked;
    //     }
    //     if (tasks[i].important != currentIInput[i].checked) {
    //         tasks[i].important = currentIInput[i].checked;
    //     }
    // }


    //? Store new values to localStorage
    storeTasks();
    placeTask();
}

function removeTask(element) {

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

    storeTasks();
    placeTask();
}

function storeTasks() {
    var JSONTasks = JSON.stringify(tasks);
    localStorage.setItem("tasksAll", JSONTasks);
    console.log("tasks stored");
}

function changeCategory(category) {

    // var radial = document.querySelectorAll("input[type=radio]");
    var allSection = document.querySelector("#categoryAll").parentNode;
    var allInput = document.querySelector("#categoryAll");
    var importantSection = document.querySelector("#categoryImportant").parentNode;
    var importantInput = document.querySelector("#categoryImportant");
    var completedSection = document.querySelector("#categoryCompleted").parentNode;
    var completedInput = document.querySelector("#categoryCompleted");
    var allIMG = document.querySelector("#allIMG");
    var impIMG = document.querySelector("#impIMG");
    var comIMG = document.querySelector("#comIMG");


    if(allInput.checked){
        allSection.style.background = "rgb(253, 158, 43)";
        allIMG.src = "assets/img/archive2.svg";
    }else{
        allSection.style.background = "rgba(255, 255, 255, 0.15)";
        allIMG.src = "assets/img/archive.svg"
    }
    
    if(importantInput.checked){
        importantSection.style.background = "rgb(252, 71, 65)";
        impIMG.src = "assets/img/warning2.svg";
    }else{
        importantSection.style.background = "rgba(255, 255, 255, 0.15)";
        impIMG.src = "assets/img/warning.svg";
    }
    
    if(completedInput.checked){
        completedSection.style.background = "rgb(28, 135, 251)";
        comIMG.src = "assets/img/check2.svg"
    }else{
        completedSection.style.background = "rgba(255, 255, 255, 0.15)";
        comIMG.src = "assets/img/check.svg"
    }

}

function saveList(list) {
    var newList = (list.parentNode.parentNode.querySelector("input").value);

    userLists.push(newList);

    storeList();
    // updateList("modal");
    selectUserLists();
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
    var JSONLists = JSON.stringify(userLists);
    localStorage.setItem("userLists", JSONLists);
    console.log("lists stored");
    console.log(JSONLists);
}

function placeList() {

    // Obtain tasks from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("userLists"));

    if (listsJSON === null) { // Check if there is no localStorage
        userLists = [];
    } else {
        userLists = listsJSON;
    };

    var oldLists = document.querySelectorAll("#userLists-container li"); // Select all li (tasks) currenty in display
    var listsUl = document.querySelector("#userLists-container"); // Select the "tasks display"

    // Set tasksDisplay as the localStorage tasks
    var listsDisplay = userLists;

    // Remove old values in the tasks display
    oldLists.forEach(element => {
        element.remove();
    })

    // Place new updated tasks in display
    var idNumber = 0;
    var idNumber2 = 0;
    listsDisplay.forEach(element => {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var input = document.createElement("input");

        li.classList.add("userLists")
        label.innerHTML = element;
        input.type = "radio";
        input.name = "section";
        input.value = element;
        input.classList.add("testingRadio");

        label.appendChild(input);
        li.appendChild(label);
        listsUl.appendChild(li);
    });
}

function selectUserLists(){
    var listSelector = document.querySelector("#customList");
    var oldLists = listSelector.querySelectorAll("option"); //? Select all li (tasks) currenty in display

    //? Remove old values in the lists selector, except first one (default)
    for(var i = 1; i<oldLists.length; i++){
        oldLists[i].remove();
    }

    userLists.forEach(element=>{
        var option = document.createElement("option");
        option.value = element;
        option.textContent = element;

        listSelector.appendChild(option);
    })
}


placeTask();
placeList();
selectUserLists();