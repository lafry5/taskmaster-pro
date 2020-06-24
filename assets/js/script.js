var tasks = [];


var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {  //creates a for loop through each item in array & creates a task variable for each to tie to a screen
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() { //stores to local storage (setItem, getItem)
  console.log('executed save tasks')
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function() { // when clicked, creates a jQuery item that has white space trimmed 
  var text = $(this)
    .text()
    .trim();
  var textInput = $("<textarea>") // taking text from one area
  .addClass("form-control") //gives it bootstrap form control styling
  .val(text);
  $(this).replaceWith(textInput); // and dropping it on another area
  textInput.trigger("focus");
});


$(".list-group").on("blur", "textarea", function() {
  console.log('executed on function')
  // get the textarea's current value/text
    var text = $(this)
      .val()
      .trim();
    console.log('Text'+text);

    // get the parent ul's id attribute
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", ""); 
      console.log('Status'+status);

    // get the task's position in the list of other li elements
    var index = $(this)
      .closest(".list-group-item")
      .index();
    console.log('Index'+index);

    // recreate p element     // What does this do?
    var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
    console.log('TaskP'+taskP);  // This displays TaskP[object Object]

    // replace textarea with p element
    $(this).replaceWith(taskP);  //what does this do?

     tasks[status][index].text = text; //problem area; text is undefined
      saveTasks();
});


// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text() // chained function
    .trim(); // semi-colon is the period at the end

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  // get current text
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date; //problem area; date is undefined
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});


$(".card .list-group").sortable({
  connectWith: $(".card .list-group"), //this was the original line of code minus the comma
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  //update: function(event) {
  //  console.log("update", this);
  update: function(event) {
  //array to store the task data in
  var tempArr = [];
  
  // loop over current set of children in sortable list
  $(this).children().each(function() { //original line of code
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

  //add task data to the temp array as an object
  tempArr.push({  
    text: text,
    date: date
 
  }); // tempArr
}); //each function
 } // keep?
}); // update function

// console.log(tempArr);

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();