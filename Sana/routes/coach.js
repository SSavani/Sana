const express = require("express");
const router = express.Router();
const data = require("../data");
const coaches = data.coaches;
const users = data.users;
const xss = require("xss");

router.get("/", async (req, res) => {
    var arr=[];
    try{
        arr = await coaches.getAllCoaches();
        res.render("coach/lcoach",{partial: "lcoach_script",
        "coach": arr
    });
        }
        catch(err)
        {
            res.redirect("../error");
        }
});

router.get("/:id", async (req, res) => {
    let coachId = req.params.id;
    if(coachId === "userRegCoaches" && req.cookies.AuthCookie) {
        if(req.cookies.CoachCookie) {
            try{
                    let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
                    
                    res.render("coach/userRegCoaches", {partial: "lcoach_script",
                                            "time": coachInfo.availableTime,
                                            "url": "http://localhost:3000/coach/userRegCoaches"});
            }
            catch(err)
            {
                res.redirect("../error");
            }
        }
        else {
            res.redirect("/coach");
        }
    }
    else if (coachId === "dropCoaches" && req.cookies.AuthCookie) {
        if(req.cookies.CoachCookie) {
            try {
                let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                let registed = false;
                let i=0;
                for (; i<userInfo.coach.length; i++) {
                    if (userInfo.coach[i].cId === req.cookies.CoachCookie) {
                        registed = true;
                        break;
                    }
                }
                if(registed) {
                await users.withdrawCoach(req.cookies.AuthCookie, 
                                            req.cookies.CoachCookie, 
                                            userInfo.coach[i].cName,           
                                            userInfo.coach[i].cTime);
                let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
                res.render("coach/coachdetial", {partial: "lcoach_script",
                                            "regSucc": "Drop successful!",
                                            "coachName": coachInfo.coachName,
                                            "gender": coachInfo.gender,
                                            "profession": coachInfo.profession,
                                            "email": coachInfo.email,
                                            "availableTime": coachInfo.availableTime,
                                            "comment": coachInfo.comment});
                }
                else {
                    let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
                    res.render("coach/coachdetial", {partial: "lcoach_script",
                                            "regErr": "You didn't register this trainer!",
                                            "coachName": coachInfo.coachName,
                                            "gender": coachInfo.gender,
                                            "profession": coachInfo.profession,
                                            "email": coachInfo.email,
                                            "availableTime": coachInfo.availableTime,
                                            "comment": coachInfo.comment});
                }
            } catch (e) {
                res.redirect("../error");
            }
        }
        else {
            res.redirect("/coach/");
        }
        //res.clearCookie("CoachCookie");
    }
    else if (coachId === "CoachComment" && req.cookies.AuthCookie) {
        if(req.cookies.CoachCookie) {
            try {
                let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                let coachName = "";
                for(let i=0; i<userInfo.coach.length; i++) {
                    if(userInfo.coach[i].cId === req.cookies.CoachCookie) {
                        coachName = userInfo.coach[i].cName;
                    }
                }
                if(coachName) {
                    res.render("coach/viewCoach", {partial: "lcoach_script",
                                                    "coach": coachName});
                }
                else {
                    res.render("coach/viewCoach", {partial: "lcoach_script",
                                                    "display": "hidden",
                                                    "commErr": "You can't comment this trainer because you haven't registered this tranier yet."});
                }
            } catch (e) {
                res.render("coach/viewCoach", {partial: "lcoach_script",
                                                    "commErr": e});
            }
        }
        else {
            res.redirect("/coach/");
        }
    }
    else if ((coachId === "dropCoaches" || coachId === "userRegCoaches" || coachId === "CoachComment") && req.cookies.AuthCookie === undefined) {
        res.redirect("../login");
    }
    else {
        try {
            let coachInfo = await coaches.getCoachByID(coachId);
            res.cookie("CoachCookie", coachId);
            res.render("coach/coachdetial", {partial: "lcoach_script",
                                            "coachName": coachInfo.coachName,
                                            "gender": coachInfo.gender,
                                            "profession": coachInfo.profession,
                                            "email": coachInfo.email,
                                            "availableTime": coachInfo.availableTime,
                                            "comment": coachInfo.comment});
        } catch (e) {
            res.redirect("../error");
        }
    }
});

router.post("/userRegCoaches", async (req, res) => {
    let submitObj = req.body;
    let coachTime = [];
    if(typeof xss(submitObj["coachtime"]) === "string") {
        coachTime.push(xss(submitObj["coachtime"]));
    }
    if(xss(submitObj["coachtime"]) && req.cookies.CoachCookie && req.cookies.AuthCookie) {
        try {
            let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
            await users.registerCoach(req.cookies.AuthCookie, 
                                        req.cookies.CoachCookie, 
                                        coachInfo.coachName, 
                                        (coachTime.length>0)?coachTime:xss(submitObj["coachtime"]));
            res.render("coach/coachdetial", {partial: "lcoach_script",
                                        "regSucc": "Register successful!",
                                        "coachName": coachInfo.coachName,
                                        "gender": coachInfo.gender,
                                        "profession": coachInfo.profession,
                                        "email": coachInfo.email,
                                        "availableTime": coachInfo.availableTime,
                                        "comment": coachInfo.comment});
        } catch (e) {
            let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
            res.render("coach/userRegCoaches", {partial: "lcoach_script",
                                            "error": e,
                                            "time": coachInfo.availableTime,
                                            "url": "http://localhost:3000/coach/userRegCoaches"});
        }
    }
    else {
        res.redirect("/coach");
    }
    //res.clearCookie("CoachCookie");
});

router.post("/CoachComment", async(req,res)=>{
    let comment = req.body;
    if(req.cookies.AuthCookie && xss(comment["coachcomm"]) !== "" && req.cookies.CoachCookie) {
            try{
                    let userInfo = await users.getUserByID(req.cookies.AuthCookie);
                    let coachInfo = await coaches.getCoachByID(req.cookies.CoachCookie);
                    await coaches.commentCoach(req.cookies.CoachCookie, userInfo.name, xss(comment["coachcomm"]));
                    res.render("coach/coachdetial", {partial: "lcoach_script",
                                        "regSucc": "Comment successful!",
                                        "coachName": coachInfo.coachName,
                                        "gender": coachInfo.gender,
                                        "profession": coachInfo.profession,
                                        "email": coachInfo.email,
                                        "availableTime": coachInfo.availableTime,
                                        "comment": coachInfo.comment});
                } catch(err)
                {
                    res.render("coach/coachdetial", {partial: "lcoach_script",
                                        "regSucc": err,
                                        "coachName": coachInfo.coachName,
                                        "gender": coachInfo.gender,
                                        "profession": coachInfo.profession,
                                        "email": coachInfo.email,
                                        "availableTime": coachInfo.availableTime,
                                        "comment": coachInfo.comment});
                }
    }
    else {
        res.redirect("/coach");
    }
});

module.exports = router;