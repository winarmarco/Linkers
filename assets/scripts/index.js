var currentEditting = {};

// sidebar javascripts

// const sideBarToggle = document.querySelector("#sidebar-toggle");
// const overlay = document.querySelector("#overlay");
// const sidebar = document.querySelector("#sidebar");

// sideBarToggle.addEventListener("click", function () {
//   sidebar.classList.add("show");
//   overlay.classList.add("show");
// });

// overlay.addEventListener("click", function () {
//   sidebar.classList.remove("show");
//   overlay.classList.remove("show");
// });

// search box javascript
const clearButton = document.querySelector("#clear-button");
const searchBox = document.querySelector("#search-box");
const inputBox = searchBox.querySelector("input[type=text]");

clearButton.addEventListener("mousedown", function (event) {
  inputBox.value = "";
  window.setTimeout(function () {
    inputBox.focus();
  }, 0);
  event.stopPropagation();
});

searchBox.addEventListener("click", function (event) {
  if (event.target.classList.contains("fa-times")) return;

  clearButton.classList.add("show");

  const currentValue = inputBox.value;
  inputBox.value = "";
  window.setTimeout(function () {
    inputBox.focus();
  }, 0);
  inputBox.value = currentValue;
});

inputBox.addEventListener("focus", function () {
  clearButton.classList.add("show");
});

inputBox.addEventListener("blur", function () {
  clearButton.classList.remove("show");
});

// scroll-to-top javascript
const scrollToTopButton = document.querySelector("#scroll-to-top");
const footer = document.querySelector('footer');

window.onscroll = function () {
  if (document.documentElement.scrollTop / document.body.scrollHeight > 0.2) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }

};

scrollToTopButton.addEventListener("click", function () {
  this.classList.remove("show");
  document.documentElement.scrollTop = 0;
});


// add new link form javascript

function newLinkInput (index) {
  const newLinkInput = document.createElement("div");

  $(newLinkInput).addClass("link-input-group");

  const label = document.createElement("label");
  const inputText = document.createElement("input");
  const inputWrapper = document.createElement("div");
  const removeLinkButton = document.createElement("span");
  const removeIcon = document.createElement("i");


  removeLinkButton.classList.add("remove-link-btn");
  removeIcon.classList.add("fas");
  removeIcon.classList.add("fa-times");

  removeLinkButton.appendChild(removeIcon);

  label.textContent = `${index}.`;

  $(inputWrapper).addClass("link-input-wrapper bg-light");
  inputText.setAttribute("placeholder", "https://url.com");
  inputText.setAttribute("type", "text");
  inputText.setAttribute("name", "link")

  inputWrapper.appendChild(label);
  inputWrapper.appendChild(inputText);


  newLinkInput.appendChild(inputWrapper);
  newLinkInput.appendChild(removeLinkButton);

  return newLinkInput;
}

$("button[name='add-new-link']").click( function (event) {
  event.preventDefault();    
  const linkInputGroup = $(this).parent()[0];

  $(newLinkInput(linkInputGroup.childElementCount - 1)).hide().insertBefore(linkInputGroup.querySelector("button")).slideDown("slow");

})

$(document).on("click", ".remove-link-btn", function () {
  $(this.parentElement).slideUp("normal", function () {$(this).remove()});
})


// $("#add-links").click(function () { 
//   $(".overlay").addClass("show");
//   $(".modal-wrapper").addClass("show");
//   $(document.body).addClass("lock");
// });


$(".modal-wrapper").click(function (event) {

  if (!event.target.classList.contains("modal-wrapper")) return;

  if (this.classList.contains("show") && this.id === "view-modal") {
    $(".overlay").removeClass("show");
    $(this)[0].scrollTop = 0;
    $(this).removeClass("show");
    $(document.body).removeClass("lock");

  }
})

$(".close-modal, .modal-wrapper").click(function (event) {


  if (!event.target.classList.contains("modal-wrapper") && !this.classList.contains("close-modal")) return;

  if (this.classList.contains("show") && this.id === "view-modal") return;

  const currentModal = $(".modal-wrapper.show");

  const form = $(`#${currentModal.attr("id")} form`)[0];


  var viewWarning = 1;


  if (currentModal.attr("id") === "edit-modal") {
    viewWarning = viewWarning && ($(form["title"]).val() === currentEditting["title"]);
    viewWarning = viewWarning && ($(form["description"]).val() == currentEditting["description"]);
    const temp = form["link"];
    $.map(temp, function(item, index) {
      viewWarning = viewWarning && ($(item).val() === currentEditting["links"][index])});

    console.log(viewWarning);
  }

  if (currentModal.attr("id") === "view-modal") {
    viewWarning = viewWarning && ($(form["title"]).val().length === 0);
    const temp = form["link"];
    $.map(temp, function(item){formIsEmpty = viewWarning && ($(item).val().length === 0)});
    viewWarning = viewWarning && ($(form["description"]).val().length === 0);
    viewWarning = viewWarning && ($(`#${currentModal.attr("id")} .link-input-group`).length === 2);

  }

  if (!viewWarning) {
    const confirmClose = confirm(`Cancel ${(currentModal.attr("id") === "edit-modal") ? "editing" : "creating"}\nChanges you made may not be saved`);

    if (confirmClose) {
      console.log(currentModal, currentModal.attr("id"));
      const form = $(`#${currentModal.attr("id")} form`)[0];
      $(form["title"]).val("");
      const temp = form["link"];
      $.map(temp, function(item){$(item).val("")});
      $(form["description"]).val("");
      
      $(".validate-error").removeClass("validate-error");
      $(".validate-error-warning").remove();
      $(`#${currentModal.attr("id")} .link-input-group`).remove();

      $(newLinkInput(1)).insertBefore(`#${currentModal.attr("id")} button[name=add-new-link]`);
      $(newLinkInput(2)).insertBefore(`#${currentModal.attr("id")} button[name=add-new-link]`);

    } else {
      return;
    }
  }

  $(".overlay").removeClass("show");
  $(`#${currentModal.attr("id")}`).removeClass("show");
  $(document.body).removeClass("lock");
})

$("#add-links").click(function () {
  $(".overlay").addClass("show");
  $("#create-modal").addClass("show");
  $(document.body).addClass("lock");
})

$(".link-card").click(function () {
  $(".overlay").addClass("show");
  
  const title = $(this).find(".link-title").text();
  const linkList = $(this).find(".list").clone();
  const description = $(this).find(".desc").clone();
  const viewModal = $("#view-modal");
  

  viewModal.find(".content-heading").text(title);
  viewModal.find(".list").replaceWith(linkList);
  viewModal.find(".desc").replaceWith(description);



  $("#view-modal").addClass("show");
  $(document.body).addClass("lock");
});

// EDIT FUNCTION
$("#edit-link-button").click(function () {
  const currentLink = $("#view-modal");

  $("#view-modal").removeClass("show");

  const title = $(currentLink).find(".content-heading").text();
  const list = $(currentLink).find(".list ul").children().clone();
  const description = $(currentLink).find(".desc").text();


  $(".overlay").addClass("show");

  const editForm = $("#edit-modal");

  const linkInput = newLinkInput();

  $(editForm).find("input[name='title']").val(title);
  
  $(editForm).find(".link-input-group").remove();

  currentEditting["title"] = title;
  currentEditting["description"] = description;
  currentEditting["links"] = [];

  console.log(currentEditting);


  list.each(function (index) {
    const temp = $(linkInput).clone();
    temp.find("label").text(index+1);
    temp.find("input[type=text]").attr("value", $(this).find("a").text());
    $(temp).insertBefore($(editForm).find("button[name='add-new-link']")[0]);
    currentEditting["links"].push($(this).find("a").text());
  })

  $(editForm).find("textarea").val(description);
  

  $("#edit-modal").addClass("show");
  $(document.body).addClass("lock");
})


$("button[type=submit]").click(function(e) {
  const form = this.form;

  const title = $(form["title"]).val();
  const temp = form["link"];
  const link = $.map(temp, function(item){console.log(item); return $(item).val()})
  const description = $(form["description"]).val();

  console.log(title.length);
  console.log($(form["title"]).parent());

  var validated = 1;

  // validate-form

  if (title.length === 0) {
    $(form["title"]).addClass("validate-error");


    if($(form["title"]).parent().find(".validate-error-warning").length === 0){
      const span = document.createElement("span");
      $(span).text("This field is required");
      $(span).addClass("validate-error-warning");
      $(span).insertBefore($(form["title"]));
    }

    validated = 0;
  }

  $.map(temp, function (item) {
    if($(item).val().length === 0) {
      var linkInputGroup = $(item).parent();
      linkInputGroup.addClass("validate-error");

      if(linkInputGroup.find(".validate-error-warning").length === 0 ) {
        const span = document.createElement("span");
        $(span).text("This field is required");
        $(span).addClass("validate-error-warning");
        $(span).insertBefore($(linkInputGroup));
      }
      validated = 0;
    }
  });


  if (!validated) {
    e.preventDefault();
  }

})

$(".input , .link-input-group, textarea").click( function (e) {

  if (this.classList.contains("link-input-group")) {
    $(this.querySelector("input[type=text]")).focus();
  }
})

$(".input, .link-input-group").on("input", function () {

  if (this.classList.contains("link-input-group")) {
    if ($(this).find(".validate-error").length !== 0) {
      $(this).find(".validate-error").removeClass("validate-error")
    }
    
    if($(this).parent().find(".validate-error-warning").length !== 0) {
      $(this).parent().find(".validate-error-warning").remove();
    }
  } else {
    console.log($(this).parent()[0]);

    $(this).removeClass("validate-error");
    $(this).parent().find(".validate-error-warning").remove();
  }
})

$(".share-button").click(function() {
  const footerPopUp = $(".footer-popup");

  footerPopUp.addClass("show");

  window.setTimeout(function(){
    footerPopUp.removeClass("show");
  },1200);
})