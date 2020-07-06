// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future
(function($) {

    $("#buttonSub").click( function () {
        if($("#userName").val() === "") {
            $("#Err").text("Please input the username!");
            return false;
        }
        if($("#emailAdd").val() === "") {
            $("#Err").text("Please input the email address!");
            return false;
        }
        //$("#findPassword").trigger('reset');
        //$('#userName').focus();
        //$("#Err") = "";
    });
    //$("#findPassword").trigger('reset');
    //$('#userName').focus();
    //$("#Err").html("");

    $("#passwordSub").click( function () {
        if(!$("#password").val()) {
            $("#setErr").text("Please input the new password!");
            return false;
        }
        if(!$("#conPassword").val()) {
            $("#setErr").text("Please input the confirm password!");
            return false;
        }
        if($("#password").val() !== $("#conPassword").val()) {
            $("#setErr").text("Confirm password is wrong!");
            return false;
        }
        
    });
    //$("#setPasswordForm").trigger('reset');
    //$('#password').focus();
    //$("#setErr").html("");

})(jQuery); // jQuery is exported as $ and jQuery
  