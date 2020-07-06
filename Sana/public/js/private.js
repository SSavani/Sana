// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future
(function($) {
  $("#changePSub").click(function () {
    if($("#oldPassword").val() === "") {
      $("#changePErr").text("Old Password is empty!");
      return false;
    }
    else if($("#newPassword").val() === "") {
      $("#changePErr").text("New Password is empty!");
      return false;
    }
    else if($("#commPassword").val() === "") {
      $("#changePErr").text("Confirm Password is empty!");
      return false;
    }
  });
  $("#buttonSub").click(function () {
    if($("#userName").val() === "" 
       && $("#Email").val() === "" 
       && document.getElementById("Gender").value === "Option" && 
       $("#Height").val() === "" 
       && $("#Weight").val() === "") {
        $("#changeUserErr").text("No information inputted!");
        return false;
       }
  });
  })(jQuery); // jQuery is exported as $ and jQuery
  