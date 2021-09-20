$('input').keyup(function () {
    if (this.value.length > 0) {
        $(this).addClass("inputted");
    }else if (this.value.length === 0) {
        $(this).removeClass("inputted");
    }
})