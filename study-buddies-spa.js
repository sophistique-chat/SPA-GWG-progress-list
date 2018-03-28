$(function(){
  $(".state-buttons").html($(".state-buttons").attr("data-start-state-text"));
  $(".tabs-nav li:first-child a").click();
});


$(".state-buttons").on("click",function(){
  if($(this).attr("state") === "0") {
    $(this).addClass("waiting");
    $(this).html($(this).attr("data-first-state-text"));
    $(this).attr("state", "1")
  } else if($(this).attr("state") === "1") {
    $(this).addClass("success");
    $(this).removeClass("waiting");
    $(this).html($(this).attr("data-second-state-text"));
    $(this).attr("state", "2")
  } else if($(this).attr("state") === "2") {
    $(this).removeClass("success");
    $(this).html($(this).attr("data-start-state-text"));
    $(this).attr("state", "0")
  }
});


$(".tabs-nav a").on("click",function(){
  let toggle = $(this).attr("data-toggle");
  $(".tab-panel .panels").removeClass("active");
  $("#panel-" + toggle).addClass("active");
  $(".tabs-nav a").removeClass("active");
  $(this).addClass("active");
  $(".tabs-nav").css("border-bottom-color",$(this).css("background-color"));
  $(".progress[data-panel-ref]").attr("class", "progress");
  $(".progress[data-panel-ref=" + toggle + "]").addClass($(this).attr("data-class-ref"));
});


$("input[id*=lesson]").on("click", function(){
  let parent = $(this).parents(".lesson-title");
  if(parent.find(":checkbox").prop("checked")) {
    parent.find(":checkbox").prop( "checked", true );
    parent.find("span").addClass("active");
  }
  else {
    parent.find(":checkbox").prop( "checked", false );
    parent.find("span").removeClass("active");
  } });

$("input[id*=-]").on("click", function(){
  let parent = $(this).parents(".exercise-list");
  let lessonNumber = $(this).attr("id").split("-");
  if(parent.find(":checked").length === parent.find("[type=checkbox]").length) {
    $("#lesson" + lessonNumber[0]).prop("checked", true);
    $(this).parents(".lesson-title").find("span").addClass("active");
  } else {
    $("#lesson" + lessonNumber[0]).prop("checked", false);
    $(this).parents(".lesson-title").find("span").removeClass("active");
  }
  
  
   
  
  
});

$("[data-trigger=collapse]").on("click",function(){
  $("#" + $(this).attr("data-toggle")).toggleClass("active");
  if($("#" + $(this).attr("data-toggle")).hasClass("active")) {
    $(this).find("i").removeClass("fa-plus");
    $(this).find("i").addClass("fa-minus");
    $(this).removeClass($(this).attr("data-button-class"));
  } else {
    $(this).find("i").removeClass("fa-minus");
    $(this).find("i").addClass("fa-plus");
    $(this).addClass($(this).attr("data-button-class"));
  }
});




// bar selectors
const $overallBar = $(".default");
const $htmlBar = $("[data-panel-ref='html']");
const $cssBar = $("[data-panel-ref='css']");
const $javascriptBar = $("[data-panel-ref='javascript']");
const $jqueryBar = $("[data-panel-ref='jquery']");
const $projectBar = $("[data-panel-ref='projects']");


// update progress when checkbox status changes
$("input").change(function() {
  const category = getCheckboxCategory($(this))
  const bar = $("[data-panel-ref='"+category+"']");
  updateBar(bar);
  updateBar($overallBar)
});


// return sanitized category values
function getCheckboxCategory(checkbox) {
  console.log(checkbox.attr("data-category-type"));
  if (checkbox.attr("data-category-type") ===  "project") {
    return "projects"
  }
  else {
    return checkbox.attr("data-category-type")
  }
}


// initial page load
function updateBars() {
  const bars = [
    $overallBar, 
    $htmlBar, 
    $cssBar,
    $javascriptBar, 
    $jqueryBar, 
    $projectBar
  ]

  for (let i=0; i<bars.length; i++) {
    updateBar(bars[i]);
  }
}
updateBars();


function updateBar(bar) {
  const progress = getProgress();
  let width = 0; // bar progress
  const time = setInterval(fillBar, 0); // set animation speed
  const percent = getPercent(bar,progress); // get category percent
  
  // initial bar size
  bar.css("width", width + "%") ;
  bar.text(percent.toFixed(1) + "%");

  function fillBar() {
    if (width >= percent) {
      clearInterval(time); // stop interval
    } 
    else {
      width++; 
      bar.css("width", width + "%") ; // increase bar
      bar.text(percent.toFixed(1) + "%")
    }
  }
}


// return user progress properties
function getProgress() {
  return progress = {
    overall: {
      "checkedBoxes": $(".exercise-list input:checked").length, 
      "totalBoxes": $(".exercise-list input").length
    },
    html: {
      "checkedBoxes": $(".exercise-list input[data-category-type='html']:checked").length,
      "totalBoxes": $(".exercise-list input[data-category-type='html']").length
    },
    css: {
      "checkedBoxes": $(".exercise-list input[data-category-type='css']:checked").length,
      "totalBoxes": $(".exercise-list input[data-category-type='css']").length
    },
    javascript: {
      "checkedBoxes": $(".exercise-list input[data-category-type='javascript']:checked").length,
      "totalBoxes": $(".exercise-list input[data-category-type='javascript']").length
    },
    jquery: {
      "checkedBoxes": $(".exercise-list input[data-category-type='jquery']:checked").length,
      "totalBoxes": $(".exercise-list input[data-category-type='jquery']").length
    },
    projects: {
      "checkedBoxes": $(".exercise-list input[data-category-type='project']:checked").length,
      "totalBoxes": $(".exercise-list input[data-category-type='project']").length
    }
  }
}


function getPercent(bar,progress) { 
  if (bar.attr("class") === "progress default") {
    return (progress.overall.checkedBoxes / progress.overall.totalBoxes) * 100;
  }
  else {
    const category = bar.attr("data-panel-ref");
    return (progress[category].checkedBoxes / progress[category].totalBoxes) * 100;
  }
}




