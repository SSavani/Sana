const express = require("express");
const router = express.Router();
const data = require("../data");
const courses = data.courses;
const coaches = data.coaches;
const diets=data.diets;
const xss = require("xss");

router.get("/displaycourse", async (req, res) => {
    try {
        let courseArr = await courses.getAllCourses();
        res.render("users/displaycourse", {partial: "operatecourse_script",
                                            "courseTableObjs": courseArr
        });
    } catch (e) {
        res.redirect("../error");
    }
});
router.get("/addcourse", async (req, res) =>  {
    try {
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/addcourse",
                                            "addCourseDiv": "visible",
                                            "updateCourseDiv": "hidden",
                                            "deleteCourseDiv": "hidden"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/addcourse", async (req, res) => {
    let submitObj = req.body;
    if(xss(submitObj["coursename"])) {
        let courseTime = [];
        let courseType =[];

        if(typeof xss(submitObj["coursetime"]) === "string") {
            courseTime.push(xss(submitObj["coursetime"]));
        }
        try {
            await courses.createCourse(xss(submitObj["coursename"]), 
                                        xss(submitObj["coursedes"]), 
                                        (courseTime.length>0)?courseTime:xss(submitObj["coursetime"]), 
                                        parseInt(xss(submitObj["coursecapacity"])),
                                        xss(submitObj["courseType"]));
            res.render("users/operatecourse", {partial: "operatecourse_script",
                                                "error": "",
                                                "success": "Add successfully",
                                                "url": "http://localhost:3000/admin/addcourse",
                                                "addCourseDiv": "visible",
                                                "updateCourseDiv": "hidden",
                                                "deleteCourseDiv": "hidden"});
        } catch (e) {
            res.render("users/operatecourse", {partial: "operatecourse_script",
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/addcourse",
                                                "addCourseDiv": "visible",
                                                "updateCourseDiv": "hidden",
                                                "deleteCourseDiv": "hidden"});
        }
    }
    else {
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                                "error": "Please input the course name!",
                                                "success": "",
                                                "url": "http://localhost:3000/admin/addcourse",
                                                "addCourseDiv": "visible",
                                                "updateCourseDiv": "hidden",
                                                "deleteCourseDiv": "hidden"});
    }
});

router.get("/deletecourse", async (req, res) => {
    try {
        let courseArr = await courses.getAllCourses();
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "course": courseArr,
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/deletecourse",
                                            "addCourseDiv": "hidden",
                                            "updateCourseDiv": "hidden",
                                            "deleteCourseDiv": "visible"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/deletecourse", async (req, res) => {
    let submitObj = req.body;
    let courseArr = undefined;
    try {
            let courseInfo = await courses.findCourseByName(xss(submitObj["coursenamed"]));
            if(courseInfo) {
                await courses.removeCourse(courseInfo._id);
                courseArr = await courses.getAllCourses();
                res.render("users/operatecourse", {partial: "operatecourse_script",
                                                    "course": courseArr,
                                                    "error": "",
                                                    "success": "Delete successfully",
                                                    "url": "http://localhost:3000/admin/deletecourse",
                                                    "addCourseDiv": "hidden",
                                                    "updateCourseDiv": "hidden",
                                                    "deleteCourseDiv": "visible"});
            }
            else {
                courseArr = await courses.getAllCourses();
                res.render("users/operatecourse", {partial: "operatecourse_script",
                                                    "course": courseArr,
                                                    "error": "Course doesn't exist!",
                                                    "success": "",
                                                    "url": "http://localhost:3000/admin/deletecourse",
                                                    "addCourseDiv": "hidden",
                                                    "updateCourseDiv": "hidden",
                                                    "deleteCourseDiv": "visible"});
            }
    } catch (e) {
        courseArr = await courses.getAllCourses();
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                                "course": courseArr,
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/deletecourse",
                                                "addCourseDiv": "hidden",
                                                "updateCourseDiv": "hidden",
                                                "deleteCourseDiv": "visible"});
    }
});
router.get("/updatecourse", async (req, res) => {
    try {
        let courseArr = await courses.getAllCourses();
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "course": courseArr,
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatecourse",
                                            "addCourseDiv": "hidden",
                                            "updateCourseDiv": "visible",
                                            "deleteCourseDiv": "hidden"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/updatecourse", async (req, res) => {
    let submitObj = req.body;
    try {
        let courseInfo = await courses.findCourseByName(xss(submitObj["coursenameu"]));
        if(courseInfo) {
            res.render("users/updatecourse", {partial: "updatecourseinfo_script",
                                        "error": "",
                                        "success": "",
                                        "courseid": courseInfo._id,
                                        "coursename": courseInfo.courseName,
                                        "coursedes": courseInfo.courseDes,
                                        "coursecap": courseInfo.capacity});
        }
        else {
            let courseArr = await courses.getAllCourses();
            res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "course": courseArr,
                                            "error": "Course doesn't exist!",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatecourse",
                                            "addCourseDiv": "hidden",
                                            "updateCourseDiv": "visible",
                                            "deleteCourseDiv": "hidden"});
        }
    } catch (e) {
        res.render("users/updatecourse", {partial: "updatecourseinfo_script",
                                        "error": e,
                                        "success": "",
                                        "courseid": courseInfo._id,
                                        "coursename": courseInfo.courseName,
                                        "coursedes": courseInfo.courseDes,
                                        "coursecap": courseInfo.capacity});
    }
});
router.post("/updatecourseinfo", async (req, res) => {
    let submitObj = req.body;
    let courseArr = undefined;
    try {
        let newCourseInfo = {};
        if(xss(submitObj["coursename"])) {
            newCourseInfo.courseName = xss(submitObj["coursename"]);
        }
        if(xss(submitObj["coursedes"])) {
            newCourseInfo.courseDes = xss(submitObj["coursedes"]);
        }
        if(xss(submitObj["coursecapacity"])) {
            newCourseInfo.capacity =  parseInt(xss(submitObj["coursecapacity"]));
        }
        if(xss(submitObj["coursetime"])) {
            let courseTime = [];
            if(typeof xss(submitObj["coursetime"]) === "string") {
            courseTime.push(xss(submitObj["coursetime"]));
            newCourseInfo.courseTime = courseTime;
            }
            else {
                newCourseInfo.courseTime = xss(submitObj["coursetime"]);
            }
        }
        await courses.updateCourse(xss(submitObj["courseid"]), newCourseInfo);
        courseArr = await courses.getAllCourses();
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "course": courseArr,
                                            "error": "",
                                            "success": "Update successfully",
                                            "url": "http://localhost:3000/admin/updatecourse",
                                            "addCourseDiv": "hidden",
                                            "updateCourseDiv": "visible",
                                            "deleteCourseDiv": "hidden"});
    } catch (e) {
        courseArr = await courses.getAllCourses();
        res.render("users/operatecourse", {partial: "operatecourse_script",
                                            "course": courseArr,
                                            "error": e,
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatecourse",
                                            "addCourseDiv": "hidden",
                                            "updateCourseDiv": "visible",
                                            "deleteCourseDiv": "hidden"});
    }
});

router.get("/displaycoach", async (req, res) => {
    try {
        let coachArr = await coaches.getAllCoaches();
        res.render("users/displaycoach", {partial: "operatecoach_script",
                                            "coachTableObjs": coachArr
        });
    } catch (e) {
        res.redirect("../error");
    }
});
router.get("/addcoach", async (req, res) =>  {
    try {
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/addcoach",
                                            "addCoachDiv": "visible",
                                            "updateCoachDiv": "hidden",
                                            "deleteCoachDiv": "hidden"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/addcoach", async (req, res) => {
    let submitObj = req.body;
    if(xss(submitObj["coachname"])) {
        let coachTime = [];
        if(typeof xss(submitObj["coachtime"]) === "string") {
            coachTime.push(xss(submitObj["coachtime"]));
        }
        try {
            await coaches.createCoach(xss(submitObj["coachname"]), 
                                        xss(submitObj["coachgender"]), 
                                        (coachTime.length>0)?coachTime:xss(submitObj["coachtime"]), 
                                        xss(submitObj["coachmail"]),
                                        xss(submitObj["coachdes"]));
            res.render("users/operatecoach", {partial: "operatecoach_script",
                                                "error": "",
                                                "success": "Add successfully",
                                                "url": "http://localhost:3000/admin/addcoach",
                                                "addCoachDiv": "visible",
                                                "updateCoachDiv": "hidden",
                                                "deleteCoachDiv": "hidden"});
        } catch (e) {
            res.render("users/operatecoach", {partial: "operatecoach_script",
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/addcoach",
                                                "addCoachDiv": "visible",
                                                "updateCoachDiv": "hidden",
                                                "deleteCoachDiv": "hidden"});
        }
    }
    else {
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                                "error": "Please input coach name!",
                                                "success": "",
                                                "url": "http://localhost:3000/admin/addcoach",
                                                "addCoachDiv": "visible",
                                                "updateCoachDiv": "hidden",
                                                "deleteCoachDiv": "hidden"});
    }
});
router.get("/deletecoach", async (req, res) => {
    try {
        let coachArr = await coaches.getAllCoaches();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "coach": coachArr,
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/deletecoach",
                                            "addCoachDiv": "hidden",
                                            "updateCoachDiv": "hidden",
                                            "deleteCoachDiv": "visible"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/deletecoach", async (req, res) => {
    let submitObj = req.body;
    let coachArr = undefined;
    try {
            let coachInfo = await coaches.findCoachByName(xss(submitObj["coachnamed"]));
            if(coachInfo) {
                await coaches.removeCoach(coachInfo._id);
                coachArr = await coaches.getAllCoaches();
                res.render("users/operatecoach", {partial: "operatecoach_script",
                                                    "coach": coachArr,
                                                    "error": "",
                                                    "success": "Delete successfully",
                                                    "url": "http://localhost:3000/admin/deletecoach",
                                                    "addCoachDiv": "hidden",
                                                    "updateCoachDiv": "hidden",
                                                    "deleteCoachDiv": "visible"});
            }
            else {
                coachArr = await coaches.getAllCoaches();
                res.render("users/operatecoach", {partial: "operatecoach_script",
                                                    "coach": coachArr,
                                                    "error": "Coach doesn't exist!",
                                                    "success": "",
                                                    "url": "http://localhost:3000/admin/deletecoach",
                                                    "addCoachDiv": "hidden",
                                                    "updateCoachDiv": "hidden",
                                                    "deleteCoachDiv": "visible"});
            }
    } catch (e) {
        coachArr = await coaches.getAllCoaches();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                                "coach": coachArr,
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/deletecoach",
                                                "addCoachDiv": "hidden",
                                                "updateCoachDiv": "hidden",
                                                "deleteCoachDiv": "visible"});
    }
});
router.get("/updatacoach", async (req, res) => {
    try {
        let coachArr = await coaches.getAllCoaches();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "coach": coachArr,
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatacoach",
                                            "addCoachDiv": "hidden",
                                            "updateCoachDiv": "visible",
                                            "deleteCoachDiv": "hidden"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/updatacoach", async (req, res) => {
    let submitObj = req.body;
    try {
        let coachInfo = await coaches.findCoachByName(xss(submitObj["coachnameu"]));
        if(coachInfo) {
        res.render("users/updatecoach", {partial: "updatecoachinfo_script",
                                        "error": "",
                                        "success": "",
                                        "coachid": coachInfo._id,
                                        "coachname": coachInfo.coachName,
                                        "coachmail": coachInfo.email,
                                        "coachdes": coachInfo.profession});
        }
        else {
            let coachArr = await coaches.getAllCoaches();
            res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "coach": coachArr,
                                            "error": "Coach doesn't exist!",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatacoach",
                                            "addCoachDiv": "hidden",
                                            "updateCoachDiv": "visible",
                                            "deleteCoachDiv": "hidden"});
        }
    } catch (e) {
        res.render("users/updatecoach", {partial: "updatecoachinfo_script",
                                        "error": e,
                                        "success": "",
                                        });
    }
});
router.post("/updatecoachinfo", async (req, res) => {
    let submitObj = req.body;
    let coachArr = undefined;
    try {
        let newCoachInfo = {};
        if(xss(submitObj["coachname"])) {
            newCoachInfo.coachName = xss(submitObj["coachname"]);
        }
        if(xss(submitObj["coachgender"])) {
            newCoachInfo.gender = xss(submitObj["coachgender"]);
        }
        if(xss(submitObj["coachmail"])) {
            newCoachInfo.email =  xss(submitObj["coachmail"]);
        }
        if(xss(submitObj["coachdes"])) {
            newCoachInfo.profession =  xss(submitObj["coachdes"]);
        }
        if(xss(submitObj["coachtime"])) {
            let coachTime = [];
            if(typeof xss(submitObj["coachtime"]) === "string") {
            coachTime.push(xss(submitObj["coachtime"]));
            newCoachInfo.availableTime = coachTime;
            }
            else {
                newCoachInfo.availableTime = xss(submitObj["coachtime"]);
            }
        }
        await coaches.updateCoach(xss(submitObj["coachid"]), newCoachInfo);
        coachArr = await coaches.getAllCoaches();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "coach": coachArr,
                                            "error": "",
                                            "success": "Update successfully",
                                            "url": "http://localhost:3000/admin/updatacoach",
                                            "addCoachDiv": "hidden",
                                            "updateCoachDiv": "visible",
                                            "deleteCoachDiv": "hidden"});
    } catch (e) {
        coachArr = await coaches.getAllCoaches();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                            "coach": coachArr,
                                            "error": e,
                                            "success": "",
                                            "url": "http://localhost:3000/admin/updatacoach",
                                            "addCoachDiv": "hidden",
                                            "updateCoachDiv": "visible",
                                            "deleteCoachDiv": "hidden"});
    }
});

///Diet PArt
router.get("/displaydiet", async (req, res) => {
    try {
        let dietArr = await diets.getAllDiets();
        res.render("users/displaydiet", {partial: "operatediet_script",
                                            "dietTableObjs": dietArr
        });
    } catch (e) {
        res.redirect("../error");
    }
});
router.get("/adddiet", async (req, res) =>  {
    try {
        res.render("users/operatediet", {partial: "operatediet_script",
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/adddiet",
                                            "addDietDiv": "visible",
                                            "deleteDietDiv": "hidden"});
    } catch (e) {
        res.redirect("../error");
    }
});
//here
router.post("/adddiet", async (req, res) => {
    let submitObj = req.body; 
    let serv = parseInt(xss(submitObj["mealserving"])) ;
    let cal = parseInt(xss(submitObj["mealcal"]));
   
    if(xss(submitObj["mealname"])) {
    
        try {

            await diets.createDiet(xss(submitObj["mealname"]), 
                                        serv, 
                                        cal, 
                                        xss(submitObj["mealtype"]));
            res.render("users/operatediet", {partial: "operatediet_script",
                                                "error": "",
                                                "success": "Add successfully",
                                                "url": "http://localhost:3000/admin/adddiet",
                                                "addDietDiv": "visible",
                                                "deleteDietDiv": "hidden"});
        } catch (e) {
            res.render("users/operatediet", {partial: "operatediet_script",
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/adddiet",
                                                "addDietDiv": "visible",
                                                "deleteDietDiv": "hidden"});
        }
    }
});
router.get("/deletediet", async (req, res) => {
    try {
        let dietArr = await diets.getAllDiets();
        res.render("users/operatediet", {partial: "operatediet_script",
                                            "diet": dietArr,
                                            "error": "",
                                            "success": "",
                                            "url": "http://localhost:3000/admin/deletediet",
                                            "addDietDiv": "hidden",
                                            "deleteDietDiv": "visible"});
    } catch (e) {
        res.redirect("../error");
    }
});
router.post("/deletediet", async (req, res) => {
    let submitObj = req.body;
    let dietArr = undefined;
    try {
            let dietObj = await diets.findDietByName(xss(submitObj["dietnamed"]));
            if(dietObj) {
                await diets.removeDiet(dietObj._id);
                dietArr = await diets.getAllDiets();
                res.render("users/operatediet", {partial: "operatecoach_script",
                                                    "diet": dietArr,
                                                    "error": "",
                                                    "success": "Delete successfully",
                                                    "url": "http://localhost:3000/admin/deletecoach",
                                                    "addDietDiv": "hidden",
                                                "deleteDietDiv": "visible"});
            }
            else {
                dietArr = await diets.getAllDiets();
                res.render("users/operatediet", {partial: "operatecoach_script",
                                                "diet": dietArr,
                                                "error": "Diet doesn't exist!",
                                                "success": "",
                                                "url": "http://localhost:3000/admin/deletecoach",
                                                "addDietDiv": "hidden",
                                            "deleteDietDiv": "visible"});
            }
    } catch (e) {
        dietArr = await diets.getAllDiets();
        res.render("users/operatecoach", {partial: "operatecoach_script",
                                                "diet": dietArr,
                                                "error": e,
                                                "success": "",
                                                "url": "http://localhost:3000/admin/deletecoach",
                                                "addDietDiv": "hidden",
                                            "deleteDietDiv": "visible"});
    }
});

module.exports = router;