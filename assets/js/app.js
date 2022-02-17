const startTime = 9;
const endOfDay = 23;

let tasks = {};

//Add time to header
setInterval(function (){
    let currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    $("#currentDay").text(currentDateTime)
}, 1000);

//Need to set a data attribute to time block to make time association - date-time-9, 10, 11...

//create time blocks
const createTimeBlock = function(setTime, attributeTime){
    const hourBlock = $("<div>").addClass("hour-block");
    const hour = $("<div>").addClass("hour");
    const hourSpan = $("<span>");
    hourSpan.attr("data-hour", `${attributeTime}`);

     hour.append(hourSpan);
     hourSpan.text(setTime);
     hourBlock.append(hour);

     const taskContent = $("<div>").addClass("hour-content");
     const pEl = $("<p>").addClass("task");
     pEl.text("No Event Scheduled");
     const tabEl = $("<div>").addClass("tab");
     taskContent.append(pEl);
     hourBlock.append(taskContent);
     tabEl.text("TAB");
     hourBlock.append(tabEl);

     $(".container").append(hourBlock);
}



//Set hours
for(let i = startTime; i <= endOfDay; i++){
    let time = moment().set({'hour': i, 'minute': 0});
    createTimeBlock(time.format('LT'), i);
}





//Click on p tag and edit by changing into text area
$(".hour-content").on("click", ".task", function(){
    let text = $(this).text().trim();
    
    let textInput = $("<textarea>").addClass("form-control").val(text);

    $(this).replaceWith(textInput);
    textInput.trigger("focus");
})

//Change back into p tag after saving edit 
$(".container").on("blur", "textarea", function () {
    let text = $(this).val().trim();
    let textP = $("<p>").addClass("m-1").text(text);
    $(this).replaceWith(textP);
})

const auditTask = function(taskEl){
    // get the date from span
    let time = $(taskEl).find("span").text().trim();
    let date = moment().format('l');
    let dateTime = moment(date + ' ' + time);
    
    //console.log(dateTime);

  // remove any old classes from element
  //$(taskEl).removeClass("list-group-item-warning list-group-item-danger");
  
   if(moment().isAfter(dateTime)){
    $(taskEl).next().addClass("red");
   
   }
   else if(Math.abs(moment().diff(dateTime, "hour")) === 0){
     $(taskEl).next().addClass("green");
   }
}

//Auto update task audit 
  setInterval(function(){
      $(".hour").each(function(index, el){
        auditTask(el);
      });
    }, 1000);

    //to reset code on a 24 hour basis, on load, look at local storage date and reset based on differance in current time.