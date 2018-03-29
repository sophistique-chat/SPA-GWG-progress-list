/*
  * Copyright 2018 Study Buddies
  *  Notes [Sachin-3/22/2018]
  *  @Node class is used to represent checklist node
  *  Code is divided into different namespaces.
  *  SBP.Enums - stores fixed enums.
  *  SBP.Consts - stores constants.
  *  SBP.Data - stores common data required for page.
  *  SBP.UI - code for top level UI related calls. <try-catch layer>
  *  SBP.UIHelper - helper code for UI layer. Only called from SBP.UI
  *  SBP.Events - code to bind events and handle callbacks. <try-catch layer>
  *  SBP.EventsHelper - helper code for Event layer.  Only called from SBP.Events
  *  SBP.Helper - Generic helper code which do not belong to UI and Events layer
  *  localStorage api's are used for client side storage.
 */

SBP = {};

let Node = function (parent, isChecked) {
    let privateMembers = {
        parent: parent,
        children: [],
        isChecked: isChecked,
        group: SBP.Enums.Groups.NONE,
        status: SBP.Enums.Status.NOTCOMPLETED
    }

    return {
        get: function (property) {
            if (privateMembers.hasOwnProperty(property)) {
                return privateMembers[property];
            }
        },

        set: function (property, value) {
            if (privateMembers.hasOwnProperty(property)) {
                privateMembers[property] = value;
            }
        }
    }
};

SBP.Enums = {
    Groups: Object.freeze({
        NONE: 'none',
        HTML: 'html',
        CSS: 'css',
        JAVASCRIPT: 'javascript',
        JQUERY: 'jquery',
        PROJECTS: 'projects'
    }),
    Status: Object.freeze({
        NOTCOMPLETED: 0,
        PENDING: 1,
        COMPLETED: 2
    })

};

SBP.Consts = {
    DATA_ATTR_CATEGORY: 'data-category-type',
    ATTR_CATEGORY: 'category-type',
    LAST_PAGE_STATE: 'study-buddies-project-progress'

}

SBP.Data = {
    checkListMap: new Object()
}

SBP.UI = {
    bindPage: function () {
        try {
            SBP.UIHelper.loadData();
            $('#main-container').find('li input').each(function () {
                let id = $(this).attr("id");
                if (SBP.Data.checkListMap[id]) {
                    let isChecked = SBP.Data.checkListMap[id].isChecked;
                    $(this).prop('checked', isChecked);
                }
            });
            // Update Progress Bars
            updateBars();
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    refreshPage: function () {
        try {
            // Update progress bars and other UI changes.
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    savePage: function () {
        try {
            localStorage[SBP.Consts.LAST_PAGE_STATE] = JSON.stringify(SBP.Data.checkListMap);
        }
        catch (ex) {
            console.log(ex.message);
        }
    },

    showError: function (error) {
        if (error.message) {
            console.log(ex.message);
        } else {
            console.log(error);
        }
    }
};

SBP.UIHelper = {
    loadData: function () {
        let data = localStorage[SBP.Consts.LAST_PAGE_STATE];
        if (data) {
            let checkListMap = JSON.parse(data);
            if (checkListMap) {
                SBP.Data.checkListMap = checkListMap;
            }
        }
    },

    fillNode: function (target, node) {
        let category = target.attr(SBP.Consts.DATA_ATTR_CATEGORY);
        node.group = category;
        let isChecked = target.is(':checked');
        node.isChecked = isChecked;
    }
};

SBP.Events = {
    bindEvents: function () {
        try {
            $('#main-container').on("click", "li input", function (e) {
                SBP.Events.onListItemClicked($(e.target));
            });
        }
        catch (ex) {
            SBP.UI.showError(ex);
        }
    },

    onListItemClicked: function (target) {
        try {
            // Create node and store in map
            let id = target.attr("id");
            SBP.Helpers.updateCheckListMap(id, target);
            var grandParent = target.parent().parent();
            if (grandParent.hasClass('lesson-title')) {
                grandParent.find('li input').each(function () {
                    let childId = $(this).attr("id");
                    SBP.Helpers.updateCheckListMap(childId, $(this));
                });
            }

            // Refresh Page
            SBP.UI.refreshPage();
            // Save Page
            SBP.UI.savePage();
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
};

SBP.EventsHelper = {

};

SBP.Helpers = {
    updateCheckListMap: function (id, target) {
        let node = null;
        if (!SBP.Data.checkListMap[id]) {
            node = new Node(null, false);
            if (node) {
                SBP.Data.checkListMap[id] = node;
            }
        } else {
            node = SBP.Data.checkListMap[id];
        }
        SBP.UIHelper.fillNode(target, node);
        return node;
    }
};

$(function () {
    try {
        SBP.UI.bindPage();
        SBP.Events.bindEvents();
    }
    catch (ex) {
        console.log(ex.message);
    }
});





/*Angel & Steve*/
$(function () {
  $(".tabs-nav li:first-child a").click();
  $(".lesson-title").each(function() {
    if($(this).find(".exercise-list input").length === $(this).find(".exercise-list input:checked").length) {
      $(this).find(".check-box-label input").first().prop("checked", true);
      $(this).find(".check-box-label .muted").addClass("active");
    } else {
      $(this).find(".check-box-label input").first().prop("checked", false);
      $(this).find(".check-box-label .muted").removeClass("active");
    }
  });
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

$("[data-toggle=dropdown]").on("click",function(e){
  e.stopPropagation();
  let toggleRef = "#" + $(this).attr("data-toggle-ref");
  $(toggleRef).toggleClass("active");
  $(toggleRef).css({
    "right": 20,
    "top" : 0,
  });
  $(".user-avatar img").toggleClass("zoom");
});
$(".dropdown li:first-child").on("click", function(e){
  e.stopPropagation();
});
$(document).on("click", function() {
  $(".dropdown").removeClass("active");
  $(".user-avatar img.zoom").removeClass("zoom");
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
