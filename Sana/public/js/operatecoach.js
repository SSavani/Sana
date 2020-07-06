// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future

(function($) {
    let addCoachSub = $("#coachAdd");
    let updateCoachSub = $("#coachUpdate");
    let deleteCoachSub = $("#coachDelete");

    addCoachSub.click(function () {
       
        let coachName = $("#coachName").val();
        let coachDes = $("#coachDes").val(); 
        let coachGen = $("#coachGender").val();
        let coachMail = $("#coachMail").val();

        if(!coachName) {
            $("#Err").text("Coach name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        if(!coachDes) {
            $("#Err").text("Coach description shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        if(!coachGen) {
            $("#Err").text("Coach gender shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        if(!coachMail) {
            $("#Err").text("Coach email shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        if(document.getElementById("coachTime").value === "Option") {
            $("#Err").text("Coach time is invalid!");
            $("#Succ").text("");
            return false;
        }
        
    } );
    
    updateCoachSub.click(function () {
        let coachName = $("#coachNameU").val();
        if(!coachName) {
            $("#Err").text("Coach name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
    });
    deleteCoachSub.click(function () {
        let coachName = $("#coachNameD").val();
        if(!coachName) {
            $("#Err").text("Coach name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        
    });
//    $("#coachOperateForm").trigger('reset');
//    $('#coachName').focus();
//    $("#Err").html("");

})(jQuery); // jQuery is exported as $ and jQuery
  