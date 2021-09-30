var currentEditting = {};

// NEW LINK INPUT GENERATOR
function newLinkInput() {
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

  label.textContent = "-";

  $(inputWrapper).addClass("link-input-wrapper bg-light");
  inputText.setAttribute("placeholder", "https://url.com");
  inputText.setAttribute("type", "url");
  inputText.setAttribute("name", "links");

  inputWrapper.appendChild(label);
  inputWrapper.appendChild(inputText);

  newLinkInput.appendChild(inputWrapper);
  newLinkInput.appendChild(removeLinkButton);

  return newLinkInput;
}


// TOGGLE NAV EXPAND
$("#user-icon").click(function () {
  $(".overlay").addClass("show");
  $("#nav-expand").addClass("show");
  $("body").addClass("lock");
  $("#nav-expand .nav-expand").addClass("expand");
});


// SCROLL TO TOP BUTTON
const scrollToTopButton = document.querySelector("#scroll-to-top");
const footer = $("footer");
const padding = 20;

$(window).scroll(function () {
  var distanceFromBottom = Math.floor(
    $(document).height() - $(document).scrollTop() - $(window).height()
  );

  if (distanceFromBottom <= footer.height()) {
    $("#scroll-to-top").css(
      "bottom",
      footer.height() - distanceFromBottom + 20
    );
  } else {
    $("#scroll-to-top").css("bottom", padding);
  }

  if (document.documentElement.scrollTop / document.body.scrollHeight > 0.2) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
});

scrollToTopButton.addEventListener("click", function () {
  this.classList.remove("show");
  document.documentElement.scrollTop = 0;
});


// ADD NEW LINK INPUT PLACEHOLDER
$("button[name='add-new-link']").click(function (event) {
  event.preventDefault();
  const linkInputGroup = $(this).parent()[0];
  const linkInputCount = $($(".modal-wrapper.show").find("form")[0]["links"]).length;

  $(newLinkInput())
    .hide()
    .insertBefore(linkInputGroup.querySelector("button"))
    .slideDown("slow");

  if (linkInputCount === 1) {
    $($(".modal-wrapper.show").find("form")[0]).find(".link-input-group .remove-link-btn").removeClass("disabled");
  }
});

// REMOVE LINK INPUT PLACEHOLDER
$(document).on("click", ".remove-link-btn", function () {
  const linkInputCount = $($(".modal-wrapper.show").find("form")[0]["links"]).length;
  if (linkInputCount > 1) {
    $(this.parentElement).slideUp("normal", function () {
      $(this).remove();
    });

    if (linkInputCount === 2) {
      $($(".modal-wrapper.show").find("form")[0]).find(".link-input-group .remove-link-btn").addClass("disabled");
    }
  }
});

// CLOSE VIEW MODAL
$(".modal-wrapper").click(function (event) {

  if (!event.target.classList.contains("modal-wrapper")) return;

  if (this.id === "nav-expand") {
    $(this).find(".nav-expand").removeClass("expand");
  }

  if (this.classList.contains("show") && this.id === "view-modal") {
    $(".overlay").removeClass("show");
    $(this)[0].scrollTop = 0;
    $(this).removeClass("show");
    $(document.body).removeClass("lock");
  }
});

// CLOSE EDIT OR CREATE MODAL
$(".close-modal, .modal-wrapper").click(function (event) {

  if ( !event.target.classList.contains("modal-wrapper") && !this.classList.contains("close-modal") ) return;

  if (this.classList.contains("show") && this.id === "view-modal") return;

  const currentModal = $(".modal-wrapper.show");

  const form = $(`#${currentModal.attr("id")} form`)[0];

  var viewWarning = 1;

  if (currentModal.attr("id") === "edit-modal") {
    viewWarning = viewWarning && $(form["title"]).val() === currentEditting["title"];
    viewWarning = viewWarning && $(form["description"]).val() == currentEditting["description"];

    const temp = $(form["links"]);
    var index = 0;

    $.map(temp, function (item) {
      viewWarning = viewWarning && $(item).val() === currentEditting["links"][index];
      index = (index + 1 < currentEditting["links"].length) ? index + 1 : index;
    });
  }

  if (currentModal.attr("id") === "create-modal") {
    viewWarning = viewWarning && $(form["title"]).val().length === 0;
    const temp = $(form["link"]);
    $.map(temp, function (item) {
      formIsEmpty = viewWarning && $(item).val().length === 0;
    });
    viewWarning = viewWarning && $(form["description"]).val().length === 0;
    viewWarning =
      viewWarning &&
      $(`#${currentModal.attr("id")} .link-input-group`).length === 2;
  }

  if (!viewWarning) {
    const confirmClose = confirm(`Cancel ${currentModal.attr("id") === "edit-modal" ? "editing" : "creating"}?\nChanges you made may not be saved`);

    if (confirmClose) {
      const form = $(`#${currentModal.attr("id")} form`)[0];
      $(form["title"]).val("");
      const temp = form["link"];
      $.map(temp, function (item) {
        $(item).val("");
      });
      $(form["description"]).val("");

      $(".validate-error").removeClass("validate-error");
      $(".validate-error-warning").remove();
      $(`#${currentModal.attr("id")} .link-input-group`).remove();

      $(newLinkInput()).insertBefore(
        `#${currentModal.attr("id")} button[name=add-new-link]`
      );
      $(newLinkInput()).insertBefore(
        `#${currentModal.attr("id")} button[name=add-new-link]`
      );
    } else {
      return;
    }
  }

  $(".overlay").removeClass("show");
  $(`#${currentModal.attr("id")}`).removeClass("show");
  $(document.body).removeClass("lock");
});


// CLEAR FORM AFTER POSTING LINKS TO SERVER
$("#add-links").click(function () {
  $(".overlay").addClass("show");
  $("#create-modal").addClass("show");
  $(document.body).addClass("lock");
});

$(".link-card").click(function () {
  $(".overlay").addClass("show");

  const title = $(this).find(".link-title").text();
  const linkList = $(this).find(".list").clone();
  const description = $(this).find(".desc").clone();
  const viewModal = $("#view-modal");

  viewModal.find(".content-heading").text(title);
  viewModal.find(".list").replaceWith(linkList);
  viewModal.find(".desc").replaceWith(description);
  viewModal.find(".remove-button").val($(this).attr("value"));
  viewModal.find(".edit-button").val($(this).attr("value"));

  $("#view-modal").addClass("show");
  $(document.body).addClass("lock");
});


// PASSING LINK TO EDIT FORM
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
  currentEditting["description"] = ($(currentLink).find(".desc").attr("data-desc") == "none") ? "" : description;
  currentEditting["links"] = [];

  list.each(function (index) {
    const temp = $(linkInput).clone();
    temp.find("label").text("-");
    temp.find("input[type=url]").attr("value", $(this).find("a").text());

    if (list.length === 1) {
      temp.find(".remove-link-btn").addClass("disabled");
    }

    $(temp).insertBefore($(editForm).find("button[name='add-new-link']")[0]);
    currentEditting["links"].push($(this).find("a").text());
  });

  $(editForm).find("textarea").val(currentEditting["description"]);
  $(editForm).find(".btn").val($(this).attr("value"));

  $("#edit-modal").addClass("show");
  $(document.body).addClass("lock");
});


// VALIDATE FORM
$("button[type=submit]").click(function (e) {
  const form = this.form;

  const title = $(form["title"]).val();
  const temp = form["links"];
  const link = $.map(temp, function (item) {
    return $(item).val();
  });
  const description = $(form["description"]).val();

  var validated = 1;

  if (title.length === 0) {
    $(form["title"]).addClass("validate-error");

    if ($(form["title"]).parent().find(".validate-error-warning").length === 0) {
      const span = document.createElement("span");
      $(span).text("This field is required");
      $(span).addClass("validate-error-warning");
      $(span).insertBefore($(form["title"]));
    }

    validated = 0;
  }

  $.map(temp, function (item) {
    if ($(item).val().length === 0) {
      var linkInputGroup = $(item).parent();
      linkInputGroup.addClass("validate-error");

      if (linkInputGroup.find(".validate-error-warning").length === 0) {
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
});

// FOCUS LISTENER
$(".input , .link-input-group, textarea").click(function (e) {
  if (this.classList.contains("link-input-group")) {
    $(this.querySelector("input[type=text]")).focus();
  }
});


// INPUT LISTENER
$(".input, .link-input-group").on("input", function () {
  if (this.classList.contains("link-input-group")) {
    if ($(this).find(".validate-error").length !== 0) {
      $(this).find(".validate-error").removeClass("validate-error");
    }

    if ($(this).parent().find(".validate-error-warning").length !== 0) {
      $(this).parent().find(".validate-error-warning").remove();
    }
  } else {
    $(this).removeClass("validate-error");
    $(this).parent().find(".validate-error-warning").remove();
  }
});

// COPY LINK TO USER'S CLIPBOARD
$(".share-button").click(function (e) {

  e.stopPropagation();

  const footerPopUp = $(".footer-popup");
  const textArea = $("textarea");

  footerPopUp.addClass("show");

  window.setTimeout(function () {
    footerPopUp.removeClass("show");
  }, 1200);

  var card;

  if ($("#view-modal .share-button")[0] == this) {
    card = $(this).closest(".modal");
  } else {
    card = $(this).closest(".link-card");
  }

  var text = "";

  text = text.concat($(card).find(".link-title").text()) || text.concat($(card).find(".content-heading").text());

  text = text.concat("\n__________________________________\n\nLinks :\n");

  $.map($(card).find("ul li"), function (item) {
    text = text.concat(`- ${$(item).find("a").text()}\n`);
  });

  text = text.concat("\nDescription:\n");
  text = text.concat($(card).find("pre").text());

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function () {
      console.log("Async : Copying to clipboard was successful!")
    }, function(err) {
      console.error("Async : Could not copy text", err)
    })
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999999px";
    textArea.style.top = "-9999999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    return new Promise((res,rej) => {
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    })
  }
});
