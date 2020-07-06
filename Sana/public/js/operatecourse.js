// Remember, we're in a browser: prevent global variables from happening
// I am passing the jQuery variable into the IIFE so that
// I don't have to rely on global variable name changes in the future

(function($) {
    let addCourseSub = $("#courseAdd");
    let updateCourseSub = $("#courseUpdate");
    let deleteCourseSub = $("#courseDelete");

    addCourseSub.click(function () {
        let courseName = $("#courseName").val();
        let courseDes = $("#courseDes").val(); 
        let courseCap = document.getElementById("courseCapacity").value//$("courseCapacity").val();
        if(!courseName) {
            $("#Err").text("Course name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        } 
        if(!courseDes) {
            $("#Err").text("Course description shouldn't be empty!");
            $("#Succ").text("");
            return false;
        }
        if(!courseCap) {
            $("#Err").text("Course capacity is invalid!");
            $("#Succ").text("");
            return false;
        }
        if(document.getElementById("courseTime").value === "Option") {
            $("#Err").text("Course Time is invalid!");
            $("#Succ").text("");
            return false;
        }
    });

    updateCourseSub.click(function () {
        let courseName = $("#courseNameU").val();
        if(!courseName) {
            $("#Err").text("Course name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        } 
        
    });
    deleteCourseSub.click(function () {
        let courseName = $("#courseNameD").val();
        if(!courseName) {
            $("#Err").text("Course name shouldn't be empty!");
            $("#Succ").text("");
            return false;
        } 
        
    });
    //$("#operateForm").trigger('reset');
    //$('#courseNameD').focus();
    //$("#Err").html("");

})(jQuery); // jQuery is exported as $ and jQuery
  

