// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future
(function($) {
    let closeButton = $("#buttonSub");
    closeButton.click(function () {
    if($("#userName").val() === "" ) {
        $("#createAErr").text("Username shouldn't be empty!");
        return false;
    }
    if(($("#userName").val()).startsWith(" ") || ($("#userName").val()).endsWith(" ")) {
        $("#createAErr").text("Username shouldn't begin or end with space!");
        return false;
    }
    if($("#passWord").val() === "") {
        $("#createAErr").text("Password shouldn't be empty!");
        return false;
    }
    if($("#Email").val() === "") {
        $("#createAErr").text("Email shouldn't be empty!");
        return false;
    }
});

})(jQuery); // jQuery is exported as $ and jQuery
  