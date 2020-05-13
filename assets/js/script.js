var date = new Date();
var day = date.getDate();
var year = date.getFullYear();
let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let weekDayArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var month = monthArray[date.getMonth()];
var weekDay = weekDayArray[date.getDay()-1];

var tasks = [];
var userLists = [];
// var completedList = [];
// var importantList = [];
var toRemove;
var toRemoveTasks;
// var onHover = false;

document.querySelector("#todayDay").innerHTML = day;
document.querySelector("#todayMonth").innerHTML = month;
document.querySelector("#todayWeekday").innerHTML = weekDay;
document.querySelector("#todayYear").innerHTML = year;

var allSection = document.querySelector("#categoryAll").parentNode;
var allInput = document.querySelector("#categoryAll");
var importantSection = document.querySelector("#categoryImportant").parentNode;
var importantInput = document.querySelector("#categoryImportant");
var completedSection = document.querySelector("#categoryCompleted").parentNode;
var completedInput = document.querySelector("#categoryCompleted");
var pendingSection = document.querySelector("#categoryPending").parentNode;
var pendingInput = document.querySelector("#categoryPending");
var allIMG = document.querySelector("#allIMG");
var impIMG = document.querySelector("#impIMG");
var comIMG = document.querySelector("#comIMG");
var penIMG = document.querySelector("#penIMG");
var searchBar = document.querySelector("#searchBar");

document.addEventListener("click", clickListener);
document.addEventListener("mouseover", hoverListener);
document.addEventListener("mouseout", hoverListener);
document.addEventListener("keydown", keyListener);

function clickListener(event) {
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
    if (event.target.classList.contains("deleteList")) removeList(event.target.parentNode.querySelector("label"));

    if (event.target.id == "cancel_delete_btn" || event.target.id == "listRemoveAlert") document.querySelector("#listRemoveAlert").classList.toggle("hidden");
    if (event.target.id == "delete_btn") removeAll();
}

function hoverListener(event) {
    if(event.target != document.querySelector("body")){
        if (event.target.parentNode.classList.contains("important-hover")) {
            var buttonImportant = event.target.parentNode.querySelector(".importantCheckMark");
            var buttonDelete = event.target.parentNode.querySelector(".deleteTask");
            var description = event.target.parentNode.querySelector(".descriptionBox");
            buttonImportant.classList.toggle("hidden");
            buttonDelete.classList.toggle("hidden");
            description.classList.toggle("hidden");
        } else if (event.target.parentNode.parentNode.classList.contains("important-hover")) {
            var buttonImportant = event.target.parentNode.parentNode.querySelector(".importantCheckMark");
            var buttonDelete = event.target.parentNode.parentNode.querySelector(".deleteTask");
            var description = event.target.parentNode.parentNode.querySelector(".descriptionBox");
            buttonImportant.classList.toggle("hidden");
            buttonDelete.classList.toggle("hidden");
            description.classList.toggle("hidden");
        }

        if(event.target.parentNode.classList.contains("userLists")){
            event.target.parentNode.querySelector(".deleteList").classList.toggle("hidden");
        }
    }
}

function keyListener(event) {
    if(searchBar === document.activeElement && searchBar.value.length>0){
        placeTask(searchBar.value);
        console.log("search bar is active with value: " + searchBar.value);
    }
}

function cancelForm() {
    document.querySelector("#modal").classList.toggle("hidden");
    document.querySelector(".modal-content form").reset();
    document.querySelector("#taskTitle").style.borderColor = "rgb(53, 53, 59)";
    description = document.querySelector("#taskDescription").style.borderColor = "rgb(53, 53, 59)";
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
    if(!title && !description){
        document.querySelector("#taskTitle").style.borderColor = "red";
        description = document.querySelector("#taskDescription").style.borderColor = "red";
    } else if(!title){
        document.querySelector("#taskTitle").style.borderColor = "red";
    } else if(!description){
        description = document.querySelector("#taskDescription").style.borderColor = "red";
    };
}

function placeTask(searchValue) {

    console.log("placeTask executed");

    //? Obtain lists from localStorage
    var listsJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (listsJSON === null) { //? Check if there is no localStorage
        tasks = [];
    } else {
        tasks = listsJSON;
    };

    var oldEvents = document.querySelectorAll("#tasks li"); //? Select all li (tasks) currenty in display
    var tasksUl = document.querySelector("#tasksUl"); //? Select the "tasks display"

    var sectionTitle = document.querySelector("#sectionTitle");

    var activeList;
    
    document.querySelectorAll("input[type='radio']").forEach(element => {
        if(element.checked){
            activeList = element.parentNode.textContent;
        }
    })

    changeCategory();

    if(!searchValue){
        if(allInput.checked){
            console.log("all selected");
            var tasksDisplay = tasks;
            sectionTitle.textContent = "All Tasks";
        }else if(importantInput.checked){
            console.log("important selected")
            var tasksDisplay = tasks.filter(task => (task.important == true && task.completed == false));
            sectionTitle.textContent = "Important";
        }else if(completedInput.checked){
            console.log("completed selected")
            var tasksDisplay = tasks.filter(task => task.completed == true);
            sectionTitle.textContent = "Completed";
        }else if(pendingInput.checked){
            console.log("completed selected")
            var tasksDisplay = tasks.filter(task => task.completed == false);
            sectionTitle.textContent = "Pending";
        }else{
            console.log("other selected");
            var tasksDisplay = tasks.filter(task => task.customList == activeList);
            sectionTitle.textContent = "List: " + activeList;
        }
    }else{
        console.log("search selected");
        var tasksDisplay = tasks.filter(task => task.title.includes(searchValue));
        sectionTitle.textContent = "List: " + searchValue;
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
        var description = document.createElement("span");
        var input = document.createElement("input");
        var important = document.createElement("label");
        var importantCheckMark = document.createElement("span");
        var importantInput = document.createElement("input");
        var deleteTask = document.createElement("img");

        description.classList.add("descriptionBox");
        description.classList.add("hidden");
        description.textContent = element.description;

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

        switch(element.color){
            case "purple":
                label.style.color = "rgb(95, 97, 227)"
                break;
            case "green":
                label.style.color = "rgb(59, 207, 97)"
                break;
            case "yellow":
                label.style.color = "rgb(254, 213, 51)"
                break;
            case "orange":
                label.style.color = "rgb(253, 158, 43)"
                break;
            case "grey":
                label.style.color = "rgb(114, 126, 135)"
                break;
            case "pink":
                label.style.color = "rgb(212, 131, 242)"
                break;
            case "blue":
                label.style.color = "rgb(28, 135, 251)"
                break;
            default:
        }

        important.appendChild(importantInput);
        important.appendChild(importantCheckMark);

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        li.appendChild(important);
        li.appendChild(deleteTask);
        li.appendChild(description);
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

    //? Obtain current values for checkbox from completed and important
    var currentCInput = document.querySelectorAll(".taskLabel");
    // var currentIInput = document.querySelectorAll(".importantCheckMark");

    //? Update tasks values with current values

    currentCInput.forEach(cInput =>{
        tasks.forEach(task => {
            // console.log(task.title + " task.title");
            // console.log(cInput.textContent + " cInput.textContent");
            if (task.title == cInput.textContent){
                var currentCompleted = cInput.querySelector(".completedInput");
                var currentImportant = cInput.parentNode.querySelector(".importantInput");
                // console.log ("task.title = cInput");
                // console.log (currentCompleted.checked);

                if(task.completed != currentCompleted.checked){
                    task.completed = currentCompleted.checked;

                }
                if(task.important != currentImportant.checked){
                    task.important = currentImportant.checked;
                }
            }
            // console.log("--------------------");
        });
    });


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

    storeTasks();
    placeTask();
}

function storeTasks() {
    var JSONTasks = JSON.stringify(tasks);
    localStorage.setItem("tasksAll", JSONTasks);
    console.log("tasks stored");
}

function changeCategory(category) {

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

    if(pendingInput.checked){
        pendingSection.style.background = "rgb(114, 126, 135)";
        penIMG.src = "assets/img/clock2.svg"
    }else{
        pendingSection.style.background = "rgba(255, 255, 255, 0.15)";
        penIMG.src = "assets/img/clock.svg"
    }

}

// function showDescription(event){
//     while (event.classList.contains("important-hover")) {
//         console.log(event.clientX, event.clientY);
//         // var timeout = setTimeout(showDescription, 500);
//     }
// }

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
        var deleteList = document.createElement("img");

        li.classList.add("userLists")
        label.innerHTML = element;
        // label.classList.add("listLabel")
        input.type = "radio";
        input.name = "section";
        input.value = element;
        input.classList.add("testingRadio");
        
        deleteList.src = "assets/img/clear.svg";
        deleteList.classList.add("deleteList");
        deleteList.classList.add("hidden");
        deleteList.height = "12";
        deleteList.width = "12";

        label.appendChild(input);
        li.appendChild(label);
        li.appendChild(deleteList)
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

function removeList(element) {

    var listsJSON = JSON.parse(localStorage.getItem("userLists"));
    toRemove = element.textContent;

    if (listsJSON === null) {
        userLists = [];
    } else {
        userLists = listsJSON;
    };

    var listTasks = tasks.filter(task => task.customList == element.textContent);

    if(listTasks.length > 0){
        document.querySelector("#listRemoveAlert").classList.toggle("hidden");
        document.querySelector("#remainingItems").textContent = listTasks.length;
        toRemoveTasks = listTasks;
        console.log(listTasks);
    }else{
        let index;
        userLists.forEach(list => {
            if (list == element.textContent) {
                index = userLists.indexOf(list);
            }
        })
    
        if (index > -1) {
            userLists.splice(index, 1);
        }
    
        storeList();
        placeList();
    }
}

function removeAll(){
    //remove all tasks in List
    var tasksJSON = JSON.parse(localStorage.getItem("tasksAll"));

    if (tasksJSON === null) {
        tasks = [];
    } else {
        tasks = tasksJSON;
    };
    toRemoveTasks.forEach(rTask=>{
        let index;
        tasks.forEach(task => {
            if (task.customList == rTask.customList) {
                index = tasks.indexOf(task);
            }
        })
    
        if (index > -1) {
            tasks.splice(index, 1);
        }
    })

    storeTasks();
    placeTask();

    //Remove List
    var listsJSON = JSON.parse(localStorage.getItem("userLists"));

    if (listsJSON === null) {
        userLists = [];
    } else {
        userLists = listsJSON;
    };

    let index;
    userLists.forEach(list => {
        if (list == toRemove) {
            index = userLists.indexOf(list);
        }
    })

    if (index > -1) {
        userLists.splice(index, 1);
    }

    storeList();
    placeList();
    document.querySelector("#listRemoveAlert").classList.toggle("hidden");
    document.querySelector("#categoryPending").click();
    
}



placeTask();
placeList();
selectUserLists();