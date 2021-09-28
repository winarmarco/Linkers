$("input").keyup(function () {
  if (this.value.length > 0) {
    $(this).addClass("inputted");
  } else if (this.value.length === 0) {
    $(this).removeClass("inputted");
  }
});

$(".password-toggle").click(function () {
  if (this.classList.contains("fa-eye")) {
    $(this).removeClass("fa-eye fas");
    $(this).addClass("far fa-eye-slash");
    $(this).parent().find("input").attr("type", "password");
  } else {
    $(this).removeClass("far fa-eye-slash");
    $(this).addClass("fa-eye fas");
    $(this).parent().find("input").attr("type", "text");
  }
});
