const express = require("express");
const router = express.Router();
const data = require("../data");
const courses = data.courses;
const users = data.users;
const xss = require('xss');

router.get("/", async (req, res) => {
    var arr=[];
    try{
        arr = await courses.getAllCourses();
        res.render("course/lcourse",{partial: "lcourse_script",
        "course": arr
        });
    }
    catch(err)
    {
        res.redirect("../error");
    }
});

router.get("/:id", async (req, res) => {
    let courseId = req.params.id;
    if(courseId === "userRegCourses" && req.cookies.AuthCookie) {
        if(req.cookies.CourseCookie) {
            let courseInfo = undefined;
            try{
                    courseInfo = await courses.getCourseByID(req.cookies.CourseCookie);
                } catch(err)
                {
                    res.render("course/coursedetial", {partial: "lcourse_script",
                                                "regErr": err/*,
                                                "courseName": courseInfo.courseName,
                                                "courseDes": courseInfo.courseDes,
                                                "courseTime": courseInfo.courseTime,
                                                "capacity": courseInfo.capacity,
                                                "availableSite": courseInfo.availableSite,
                                                "comment": courseInfo.comment*/});
        
                }
                try {
                    await users.registerCourse(req.cookies.AuthCookie,
                                            courseInfo._id,
                                            courseInfo.courseName,
                                            courseInfo.courseTime);
                    res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regSucc": "Register success!",
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
                    } catch (e) {
                        res.render("course/coursedetial", {partial: "lcourse_script",
                                                "regErr": e,
                                                "courseName": courseInfo.courseName,
                                                "courseDes": courseInfo.courseDes,
                                                "courseTime": courseInfo.courseTime,
                                                "capacity": courseInfo.capacity,
                                                "availableSite": courseInfo.availableSite,
                                                "comment": courseInfo.comment});
                    }
            
            //res.clearCookie("CourseCookie");
        }
        else {
            res.redirect("/course");
        }
    }
    else if (courseId === "dropCourses" && req.cookies.AuthCookie) {
        if(req.cookies.CourseCookie) {
            try{
                    let courseInfo = await courses.getCourseByID(req.cookies.CourseCookie);
                    let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                    let courseName = "";
                    for(let i=0; i<userInfo.course.length; i++) {
                        if(userInfo.course[i].cId === req.cookies.CourseCookie) {
                            courseName = userInfo.course[i].cName;
                        }
                    }
                    if(courseName) {
                    await users.withdrawCourse(req.cookies.AuthCookie,
                                            courseInfo._id,
                                            courseInfo.courseName,
                                            courseInfo.courseTime);
                    res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regSucc": "Drop success!",
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
                    }
                    else {
                        res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regErr": "You didn't register this course!",
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
                    }
            }
            catch(err)
            {
                res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regErr": err,
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
    
            }
        }
        else {
            res.redirect("/course");
        }
    }
    else if (courseId === "CourseComment" && req.cookies.AuthCookie) {
        if(req.cookies.CourseCookie) {
            try {
                let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                let courseName = "";
                for(let i=0; i<userInfo.course.length; i++) {
                    if(userInfo.course[i].cId === req.cookies.CourseCookie) {
                        courseName = userInfo.course[i].cName;
                    }
                }
                if(courseName) {
                    res.render("course/viewCourse", {partial: "lcourse_script",
                                                    "course": courseName});
                }
                else {
                    res.render("course/viewCourse", {partial: "lcourse_script",
                                                    "display": "hidden",
                                                    "commErr": "You can't comment this course because you haven't registered this course yet."});
                }
            } catch (e) {
                res.render("course/viewCourse", {partial: "lcourse_script",
                                                    "commErr": e});
            }
        }
        else {
            res.redirect("/course");
        }
    }
    else if ((courseId === "dropCourses" || courseId === "userRegCourses" || courseId === "CourseComment") && req.cookies.AuthCookie === undefined) {
        res.redirect("../login");
    }
    else {
        try {
            let courseInfo = await courses.getCourseByID(courseId);
            res.cookie("CourseCookie", courseId);
            res.render("course/coursedetial", {partial: "lcourse_script",
                                                "courseName": courseInfo.courseName,
                                                "courseDes": courseInfo.courseDes,
                                                "courseTime": courseInfo.courseTime,
                                                "capacity": courseInfo.capacity,
                                                "availableSite": courseInfo.availableSite,
                                                "comment": courseInfo.comment});
        } catch (e) {
            res.render("coach/errorOccurrance",{partial: "lcourse_script",
                                                "err": e});
        }
    }
});

router.post("/CourseComment", async (req, res) => {
    let comment = req.body;
    if(req.cookies.AuthCookie && xss(comment["coursecomm"]) !== "" && req.cookies.CourseCookie) {
        try{
                let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                courseInfo = await courses.getCourseByID(req.cookies.CourseCookie);
                await courses.commentCourse(req.cookies.CourseCookie,userInfo.name,xss(comment["coursecomm"]));
                res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regSucc": "Comment successful!",
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
        } catch (e) {
            res.render("course/coursedetial", {partial: "lcourse_script",
                                            "regSucc": e,
                                            "courseName": courseInfo.courseName,
                                            "courseDes": courseInfo.courseDes,
                                            "courseTime": courseInfo.courseTime,
                                            "capacity": courseInfo.capacity,
                                            "availableSite": courseInfo.availableSite,
                                            "comment": courseInfo.comment});
        }
    }
    else {
        res.redirect("/course");
    }
});


module.exports = router;