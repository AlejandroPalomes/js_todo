var date = new Date();
var day = date.getDate();
var year = date.getFullYear();
let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let weekDayArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var month = monthArray[date.getMonth()];
var weekDay = weekDayArray[date.getDay()-1];

var tasks = [];
var userLists = [];

var toRemove;
var toRemoveTasks;

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
document.addEventListener("keyup", keyListener);

function clickListener(event) {
    if (event.target.id == "addTask") document.querySelector("#modal").classList.toggle("hidden");
    if (event.target.id == "cancel_btn" || event.target.id == "modal") cancelForm();
    if (event.target.id == "save_btn") generateTask("modal");
    if (event.target.classList.contains("deleteTask")) removeTask(event.target.parentNode.querySelector("label:first-child"));
    if (event.target.classList.contains("importantInput")) {
        if (!event.target.parentNode.parentNode.querySelector(".importantInput").checked) {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "200";
        } else {
            event.target.parentNode.parentNode.querySelector(".taskLabel").style.fontWeight = "800";
        }
        updateTasks();
    }
    if (event.target.classList.contains("completedInput")){
        if(event.target.parentNode.parentNode.querySelector(".timeInput").checked){
            event.target.parentNode.parentNode.querySelector(".timeInput").click();
        }else{
            updateTasks();
        }
    }
    if (event.target.classList.contains("timeInput")) {
        updateTime(event.target.parentNode.parentNode);
        updateTasks();
    }
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
            event.target.parentNode.querySelector(".importantCheckMark").classList.toggle("hidden");
            event.target.parentNode.querySelector(".deleteTask").classList.toggle("hidden");
            event.target.parentNode.querySelector(".descriptionBox").classList.toggle("hidden");
            event.target.parentNode.querySelector(".timeCheckBox").classList.toggle("hidden");
            checkTime(event.target.parentNode);
        } else if (event.target.parentNode.parentNode.classList.contains("important-hover")) {
            event.target.parentNode.parentNode.querySelector(".importantCheckMark").classList.toggle("hidden");
            event.target.parentNode.parentNode.querySelector(".deleteTask").classList.toggle("hidden");
            event.target.parentNode.parentNode.querySelector(".descriptionBox").classList.toggle("hidden");
            event.target.parentNode.parentNode.querySelector(".timeCheckBox").classList.toggle("hidden");
            checkTime(event.target.parentNode.parentNode);
        };

        if(event.target.parentNode.classList.contains("userLists")){
            event.target.parentNode.querySelector(".deleteList").classList.toggle("hidden");
        };
    };
};

function reloadTasks(){
    var tasksJSON = JSON.parse(localStorage.getItem("tasksAll"));
    if (tasksJSON === null) {
        tasks = [];
    } else {
        tasks = tasksJSON;
    };
}

function reloadLists(){
    var listsJSON = JSON.parse(localStorage.getItem("userLists"));
    if (listsJSON === null) {
        userLists = [];
    } else {
        userLists = listsJSON;
    };
}

//! ---------------- LISTENERS SECTION ----------------------- !\\

function keyListener(event) {
    if(searchBar === document.activeElement){
        placeTask(searchBar.value);

        if(event.which === 27){
            searchBar.blur();
            searchBar.value = "";
            placeTask();
        }
        if(event.which === 13){
            searchBar.blur();
        }
    }
}

function cancelForm() {
    document.querySelector("#modal").classList.toggle("hidden");
    document.querySelector(".modal-content form").reset();
    document.querySelector("#taskTitle").style.borderColor = "rgb(53, 53, 59)";
    description = document.querySelector("#taskDescription").style.borderColor = "rgb(53, 53, 59)";
}

//! ---------------- TIME SECTION ----------------------- !\\

function checkTime(element){
    
    tasks.forEach(task=>{
        if(task.title == element.querySelector(".taskLabel").textContent){
            var hours;
            var minutes;
            var time = task.ellapsedTime;

            ((time/60)/60)<1 ? hours = "00" : hours = ((time/60)/60);
            (time/60)<1 ? minutes = "00" : minutes = (time/60);
            (time/60)<1 ? minutes = "00" : minutes = (time/60);
            (time/60)>60 ? minutes = (time/60)-(60*Math.floor((time/60)/60)) : minutes = (time/60);
            element.querySelector(".descriptionBox > span:nth-child(2)").textContent = ("Time elapsed: " + Math.floor(hours) + "h "+ Math.floor(minutes) +"min");
        };
    });
};

function updateTime(element){

    reloadTasks();

    tasks.forEach(task=>{
        if(task.title == element.querySelector(".taskLabel").textContent && element.querySelector(".timeInput").checked){
            task.startTime = new Date();
            task.startTime = (Date.parse(task.startTime)/1000);
        }else if(task.title == element.querySelector(".taskLabel").textContent && !element.querySelector(".timeInput").checked){
            var time = new Date();
            time = Date.parse(time)/1000;
            task.ellapsedTime += time-task.startTime;
        };
    });
}

//! ---------------- TIME SECTION ----------------------- !\\


//! ----------------------- TASKS SECTION ------------------------ !\\


function generateTask(from) {
    var title = document.querySelector("#taskTitle").value;
    var description = document.querySelector("#taskDescription").value;
    var completedCheck = document.querySelector("#completedCheck").checked;
    var importantCheck = document.querySelector("#importantCheck").checked;
    var customList = document.querySelector("#customList").value;
    var color = document.querySelector("#taskColor").value;
    var startTime = new Date;
    var tasksNames = []
    tasksNames = tasks.filter(task => task.title == title);
    if (tasksNames.length == 0) tasksNames = null;
    if (title && description && title.length > 2 && title.length < 51 && description.length < 501 && !tasksNames) {
        var newTask = new Task(title, description, completedCheck, importantCheck, customList, color, startTime);

        
        tasks.push(newTask);

        storeTasks();
        updateTasks(from);
        placeTask();
        cancelForm();
    }
    if(!title && !description){
        document.querySelector("#taskTitle").style.borderColor = "red";
        description = document.querySelector("#taskDescription").style.borderColor = "red";
    } else if(!title || title.length > 50 || title.length < 3){
        document.querySelector("#taskTitle").style.borderColor = "red";
    } else if(!description || description.length > 500){
        description = document.querySelector("#taskDescription").style.borderColor = "red";
    }
}

function placeTask(searchValue) {

    reloadTasks();

    var oldEvents = document.querySelectorAll("#tasks li");
    var tasksUl = document.querySelector("#tasksUl");
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
            var tasksDisplay = tasks;
            sectionTitle.textContent = "All Tasks";
        }else if(importantInput.checked){
            var tasksDisplay = tasks.filter(task => (task.important == true && task.completed == false));
            sectionTitle.textContent = "Important";
        }else if(completedInput.checked){
            var tasksDisplay = tasks.filter(task => task.completed == true);
            sectionTitle.textContent = "Completed";
        }else if(pendingInput.checked){
            var tasksDisplay = tasks.filter(task => task.completed == false && task.customList == "Select a custom list");
            sectionTitle.textContent = "Pending";
        }else{
            var tasksDisplay = tasks.filter(task => (task.customList == activeList && task.completed == false));
            sectionTitle.textContent = "List: " + activeList;
        };
    }else{
        if(searchValue.toLowerCase() != "active"){
            var tasksDisplay = tasks.filter(task => task.title.toLowerCase().includes(searchValue.toLowerCase()));
        }else{
            var tasksDisplay = tasks.filter(task => task.timeControl == true);
        }
        sectionTitle.textContent = "Search: " + searchValue;
    };

    oldEvents.forEach(element => {
        element.remove();
    });

    tasksDisplay.forEach(element => {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var span = document.createElement("span");
        var input = document.createElement("input");
        var ellapsed = document.createElement("span");
        var description = document.createElement("span");
        var uList = document.createElement("span");
        var infoContainer = document.createElement("div");
        var important = document.createElement("label");
        var importantCheckMark = document.createElement("span");
        var importantInput = document.createElement("input");
        var timeLabel = document.createElement("label");
        var timeCheckBox = document.createElement("span");
        var timeInput = document.createElement("input");
        var deleteTask = document.createElement("img");

        infoContainer.classList.add("descriptionBox");
        infoContainer.classList.add("hidden");
        element.customList == "Select a custom list" ? uList.textContent = "" : uList.textContent = element.customList;
        description.textContent = element.description;
        infoContainer.appendChild(uList);
        infoContainer.appendChild(ellapsed);
        infoContainer.appendChild(description);

        input.type = "checkbox";
        input.classList.add("completedInput")
        input.checked = element.completed;
        importantInput.type = "checkbox";
        importantInput.classList.add("importantInput")
        importantInput.checked = element.important;

        timeInput.type = "checkbox";
        timeInput.classList.add("timeInput")
        timeInput.checked = element.timeControl;

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
        important.innerHTML = "Important";
        importantCheckMark.classList.add("checkmark");

        timeLabel.classList.add("timeCheckBox");
        timeLabel.classList.add("container__custom__checkbox");
        timeLabel.classList.add("hidden");
        timeLabel.innerHTML = "Active";
        timeCheckBox.classList.add("checkmark");

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

        timeLabel.appendChild(timeInput);
        timeLabel.appendChild(timeCheckBox);

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        li.appendChild(timeLabel);
        li.appendChild(important);
        li.appendChild(deleteTask);
        li.appendChild(infoContainer);
        tasksUl.appendChild(li);
    })
}

function updateTasks(from) {

    var currTasks = tasks;
    reloadTasks();

    //? Obtain current values for checkbox from completed, important and time
    var currentCInput = document.querySelectorAll(".taskLabel");

    //? Update tasks values with current values
    currentCInput.forEach(cInput =>{
        tasks.forEach(task => {
            if (task.title == cInput.textContent){
                var currentCompleted = cInput.querySelector(".completedInput");
                var currentImportant = cInput.parentNode.querySelector(".importantInput");
                var currentTime = cInput.parentNode.querySelector(".timeInput");

                if(task.completed != currentCompleted.checked){
                    task.completed = currentCompleted.checked;

                }
                if(task.important != currentImportant.checked){
                    task.important = currentImportant.checked;
                }

                if(task.timeControl != currentTime.checked){
                    task.timeControl = currentTime.checked;
                }
            }
        });
    });

    currTasks.forEach(currTask =>{
        tasks.forEach(oldTask =>{
            if (oldTask.title == currTask.title){
                if(oldTask.startTime != currTask.startTime){
                    oldTask.startTime = currTask.startTime;
                };
                if(oldTask.ellapsedTime != currTask.ellapsedTime){
                    oldTask.ellapsedTime = currTask.ellapsedTime;
                };
            };
        });
    });;


    //? Store new values to localStorage
    storeTasks();
    placeTask();
}

function removeTask(element) {

    updateTasks();
    reloadTasks();

    let index;
    tasks.forEach(task => {
        if (task.title == element.textContent) {
            index = tasks.indexOf(task);
        }
    });

    if (index > -1) {
        tasks.splice(index, 1);
    };

    storeTasks();
    placeTask();
}

function storeTasks() {
    var JSONTasks = JSON.stringify(tasks);
    localStorage.setItem("tasksAll", JSONTasks);
}

function changeCategory(category) {

    if(allInput.checked){
        allSection.style.background = "rgb(253, 158, 43)";
        allIMG.src = "assets/img/archive2.svg";
    }else{
        allSection.style.background = "rgba(255, 255, 255, 0.15)";
        allIMG.src = "assets/img/archive.svg"
    };

    if(importantInput.checked){
        importantSection.style.background = "rgb(252, 71, 65)";
        impIMG.src = "assets/img/warning2.svg";
    }else{
        importantSection.style.background = "rgba(255, 255, 255, 0.15)";
        impIMG.src = "assets/img/warning.svg";
    };

    if(completedInput.checked){
        completedSection.style.background = "rgb(28, 135, 251)";
        comIMG.src = "assets/img/check2.svg"
    }else{
        completedSection.style.background = "rgba(255, 255, 255, 0.15)";
        comIMG.src = "assets/img/check.svg"
    };

    if(pendingInput.checked){
        pendingSection.style.background = "rgb(114, 126, 135)";
        penIMG.src = "assets/img/clock2.svg"
    }else{
        pendingSection.style.background = "rgba(255, 255, 255, 0.15)";
        penIMG.src = "assets/img/clock.svg"
    };

    document.querySelectorAll("input[type='radio']").forEach(element => {
        if(element.checked){
            element.parentNode.style.color = "rgb(180, 180, 180)";
        }else{
            element.parentNode.style.color = "white";
        }
    });
};


//! ---------------------- LIST SECTION --------------------------- !\\


function saveList(list) {
    var newList = (list.parentNode.parentNode.querySelector("input").value);

    if(!userLists.includes(newList)){
        userLists.push(newList);
    
        storeList();
        selectUserLists();
        placeList();
        listModalPopDown();
    }
};

function listModalPopUp() {
    document.querySelector("#listModal-container").classList.remove("hidden");
    document.querySelector("#listModal").focus();
};

function listModalPopDown() {
    document.querySelector("#listModal-container").classList.add("hidden");
    document.querySelector("#listModal").value = "";
};

function storeList() {
    var JSONLists = JSON.stringify(userLists);
    localStorage.setItem("userLists", JSONLists);
};

function placeList() {

    reloadLists();

    var oldLists = document.querySelectorAll("#userLists-container li");
    var listsUl = document.querySelector("#userLists-container");

    // Set tasksDisplay as the localStorage tasks
    var listsDisplay = userLists;

    // Remove old values in the tasks display
    oldLists.forEach(element => {
        element.remove();
    });

    // Place new updated tasks in display
    listsDisplay.forEach(element => {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var input = document.createElement("input");
        var deleteList = document.createElement("img");

        li.classList.add("userLists")
        label.innerHTML = element;
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
    };

    userLists.forEach(element=>{
        var option = document.createElement("option");
        option.value = element;
        option.textContent = element;

        listSelector.appendChild(option);
    });
};

function removeList(element) {
    toRemove = element.textContent;
    reloadLists();

    // var listTasks = tasks.filter(task => task.customList == element.textContent);
    //I had to use the following line because there's a bug, if you place a list wirh "<" without space after, it detects it
    //as som HTML element and places in the list only the text before that sign. With value, we obtain everything
    //But there's still a bug when deleting a list that has some tasks, it deletes the tasks but not the list, you have to repeat
    //the process twice to delete both elements.

    var listTasks = tasks.filter(task => task.customList == element.querySelector("input").value);

    if(listTasks.length > 0){
        document.querySelector("#listRemoveAlert").classList.toggle("hidden");
        document.querySelector("#remainingItems").textContent = listTasks.length;
        toRemoveTasks = listTasks;
    }else{
        let index;
        userLists.forEach(list => {
            if (list == element.querySelector("input").value) {
                index = userLists.indexOf(list);
            };
        });

        if (index > -1) {
            userLists.splice(index, 1);
        };

        storeList();
        placeList();
        document.querySelector("#categoryPending").click();
    }
}

function removeAll(){

    reloadTasks();

    toRemoveTasks.forEach(rTask=>{
        let index;
        tasks.forEach(task => {
            if (task.customList == rTask.customList) {
                index = tasks.indexOf(task);
            };
        });

        if (index > -1) {
            tasks.splice(index, 1);
        };
    });

    storeTasks();
    placeTask();

    //Remove List
    reloadLists();

    let index;
    userLists.forEach(list => {
        if (list == toRemove) {
            index = userLists.indexOf(list);
        };
    });

    if (index > -1) {
        userLists.splice(index, 1);
    };

    storeList();
    placeList();
    document.querySelector("#listRemoveAlert").classList.toggle("hidden");
    document.querySelector("#categoryPending").click();
}

placeTask();
placeList();
selectUserLists();