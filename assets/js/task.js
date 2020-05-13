function Task(title, description, completedCheck, importantCheck, customList, color, time){
    this.title = title;
    this.description = description;
    this.completed = completedCheck;
    this.important = importantCheck;
    this.customList = customList;
    this.color = color;
    this.startTime = time;
}