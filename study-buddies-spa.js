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
$(function(){
  $(".state-buttons").html($(".state-buttons").attr("data-start-state-text"));
  $(".tabs-nav li:first-child a").click();
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
