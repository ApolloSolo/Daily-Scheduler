const container = document.querySelector(".container");
const startTime = 9;
const endOfDay = 17;
const hourInDay = endOfDay - startTime + 1;
const deletAll = document.querySelector("#delete-btn")


let tasks = [];

//Add time to header
setInterval(function () {
  let currentDateTime = moment().format("MMMM Do YYYY, h:mm:ss a");
  $("#currentDay").text(currentDateTime);
}, 1000);

//Need to set a data attribute to time block to make time association - date-time-9, 10, 11...
const saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//create time blocks
const createTimeBlock = function (setTime, attributeTime, taskData) {
  const hourBlock = $("<div>").addClass("hour-block");
  hourBlock.attr("data-hour", `${attributeTime}`);
  const hour = $("<div>").addClass("hour");
  const hourSpan = $("<span>");

  hour.append(hourSpan);
  hourSpan.text(setTime);
  hourBlock.append(hour);

  const taskContent = $("<div>").addClass("hour-content");
  const pEl = $("<p>").addClass("task");
  pEl.attr("data-hour", `${attributeTime}`);
  pEl.text(taskData);
  const tabEl = $("<div>").addClass("tab");
  let icon = $("<i>").addClass("fa-solid fa-floppy-disk");
  tabEl.append(icon);
  taskContent.append(pEl);
  hourBlock.append(taskContent);
  hourBlock.append(tabEl);

  $(".container").append(hourBlock);
};

//Set hours

  for (let i = startTime; i <= endOfDay; i++) {
    let time = moment().set({ hour: i, minute: 0 });
    createTimeBlock(time.format("LT"), i, "No Events Scheduled");
  }



//Click on p tag and edit by changing into text area
$(".hour-content").on("click", ".task", function () {
  let text = $(this).text().trim();
  let att = $(this).attr("data-hour");

  let textInput = $("<textarea>").addClass("form-control").val(text);
  textInput.attr("data-hour", att);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

//Change back into p tag after saving edit
$(".container").on("blur", "textarea", function () {
  let text = $(this).val().trim();
  let att = $(this).attr("data-hour");
  let textP = $("<p>").addClass("task").text(text);
  textP.attr("data-hour", att);

  //Maintian text in box
  if (text === "") {
    textP.text("No Events Scheduled");
  }

  $(this).replaceWith(textP);

  let newTask = {
    task: text,
    time: att,
  };

  if (newTask.task === "") {
    newTask.task = "No Events Scheduled";
  }

  if (tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      if (newTask.time == tasks[i].time) {
        tasks.splice(i, 1);
      }
    }
  }

  tasks.push(newTask);
  //saveTasks();
});

const auditTask = function (taskEl) {
  // get the date from span
  let time = $(taskEl).find("span").text().trim();
  let date = moment().format("l");
  let dateTime = moment(date + " " + time);

  //console.log(dateTime);

  // remove any old classes from element
  //$(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  if (moment().isAfter(dateTime.add(1, "hours"))) {
    $(taskEl).next().addClass("red");
  } 
  // else if(moment().isAfter(dateTime.add(1, "hours"))){
  
  // }
  else if (Math.abs(moment().diff(dateTime, "hour")) === 0) {
    $(taskEl).next().addClass("green");
  }
};
var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = [];
  }
  let elArray = [];
  // loop over object properties
  for (let i = 0; i < hourInDay; i++) {
    let hours = $(".hour-block");
    elArray.push(hours[i]);
  }

  for (let i = 0; i < hourInDay; i++) {
    let timeVal = elArray[i].getAttribute("data-hour");
    let taskPtag = elArray[i].querySelector(".task");
    for (let j = 0; j < hourInDay; j++) {
      if (tasks[j]) {
        if (timeVal == tasks[j].time) {
          taskPtag.textContent = tasks[j].task;
        }
      }
    }
  }
};

//Auto update task audit
setInterval(function () {
  $(".hour").each(function (index, el) {
    auditTask(el);
  });
}, 1000);

//Save tasks when icon clicked
container.addEventListener("click", (e) => {
  if(e.target.classList =="fa-solid fa-floppy-disk"){
    saveTasks();
    alert("Your tasks have been saved");
  }
})

// clear local storage on click
deletAll.addEventListener("click", () => {
  tasks = []
  saveTasks();
  alert("Successfully deleted all scheduled events")
  location.reload(true);
})

loadTasks();