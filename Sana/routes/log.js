const express = require("express");
const router = express.Router();
const users = require("../data/users");
const courses = require("../data/courses");
const sendEmail = require("./conmail");
const diets = require("../data/diets");
const xss = require("xss");

router.get("/", async (req, res) => {
    res.render("about", {
        partial: "about_script"
      });
});

router.get("/logout", async (req, res) => {
    res.clearCookie("AuthCookie");
    res.render("about", {
        partial: "about_script"
      });
});

router.get("/login", async (req, res) => {
    res.render("login", {
        partial: "login_script",
        "error": "", 
        "url":"http://localhost:3000/login"
    });
});
router.post("/login", async (req, res) => {
    let userObj = req.body;
    try {
        let userAuth = await users.checkPassword(xss(userObj["username"]), xss(userObj["password"]));
        if (userAuth) {
            res.cookie("AuthCookie", userAuth);
            res.redirect("users/private");
        }
        else {
            res.render("login", {
                partial: "login_script",
                "error":"username/passsword are not valid!", 
                "url":"http://localhost:3000/login"
            });
        }
    } catch (e) {
        res.render("login", {
            partial: "login_script",
            "error": e, 
            "url":"http://localhost:3000/login"});
    }
});

router.get("/createacc", async (req, res) => {
    res.render("createacc", {
        partial: "createacc_script",
        "url":"http://localhost:3000/createacc"});
});
router.get("/active", async (req, res) => {
    if(req.cookies.tempCookie) {
        try {
            await users.activeAccount(req.cookies.tempCookie);
            res.cookie("AuthCookie", req.cookies.tempCookie);
            res.clearCookie("tempCookie");
            res.redirect("http://localhost:3000/users/private");
        } catch (e) {
            res.render("confirmation", {partial: "about_script",
                                    "failed": "Activate account failed. Please click on the link to send confirmation email again.",
                                    "success": "",
                                    "url": "http://localhost:3000/sendconfirm"}); 
        }
    }
    else {
        res.redirect("/error");
    }
});
router.get("/sendconfirm", async (req, res) => {
    res.render("confirmmailadd", {partial: "about_script"});
});
router.post("/sendconfirm", async (req, res) => {
    let emailObj = req.body;
    if(req.cookies.tempCookie) {
        try {
            userInfo = await users.getUserByID(req.cookies.tempCookie);
            if(userInfo && userInfo.mail === xss(emailObj["emailadd"])) {
                await sendEmail.confirmEmail(userInfo.mail, userInfo.name, "http://localhost:3000/active");
                res.render("confirmation", {partial: "about_script",
                                            "failed": "",
                                            "success": "Send successful",
                                            });
            }
            else {
                res.render("confirmation", {partial: "about_script",
            "failed": "Fail to send confirmation email.",
            "success": "",
            "url": ""});
            }
        } catch (e) {
            res.render("confirmation", {partial: "about_script",
            "failed": "Fail to send confirmation email.",
            "success": "",
            "url": ""});
        }
    }
    else {
        res.redirect("/error");
    }
});
router.post("/createacc", async (req, res) => {
    let userObj = req.body;
    try {
        let userCre = await users.createUser(xss(userObj["username"]),
                                             xss(userObj["email"]),
                                             xss(userObj["password"]),
                                             xss(userObj["gender"]),
                                             xss(userObj["height"]),
                                             xss(userObj["weight"]), 
                                             false);
        if (userCre) {
            res.cookie("tempCookie", userCre._id, {maxAge: 600000});
            try {
                await sendEmail.confirmEmail(userCre.mail, userCre.name, "http://localhost:3000/active");
                //sendEmail.createTestAccount();
            } catch (e) {
                res.render("confirmation", {partial: "about_script",
                                    "failed": "Confirmation email send failed, create account failed.",
                                    "success": "",
                                    "url": ""});
            }
            res.render("confirmation", {partial: "about_script",
                                    "failed": "",
                                    "success": "We have sent you a confirmation email, please click on the link in the confirmation email to complete the registration.",
                                    "url": ""});
        }
        else {
            res.render("createacc", {
                partial: "createacc_script",
                "error": "Account create failed!", 
                "url":"http://localhost:3000/createacc"});
        }
    } catch (e) {
        res.render("createacc", {
            partial: "createacc_script",
            "error": e, 
            "url":"http://localhost:3000/createacc"});
    }
});
router.get("/about", async (req, res) => {
    res.render("about", {
        partial: "about_script"
      });
});

router.get("/account", async (req, res) => {
    res.redirect("/users/private");
});

router.get("/findpassword", async (req, res) => {
    res.render("findpassword", {
        partial: "findpassword_script"
    });
});
router.post("/findpassword", async (req, res) => {
    let userObj = req.body;
    if(xss(userObj["emailadd"]) && xss(userObj["username"])) {
        try {
            let userInfo = await users.findUserByName(xss(userObj["username"]));
            if(userInfo.mail === xss(userObj["emailadd"])) {
                await sendEmail.changePasswordEmail(xss(userObj["emailadd"]), 
                                                xss(userObj["username"]), 
                                                "http://localhost:3000/setpassword");
                res.cookie("changePCookie", userInfo._id, {maxAge: 600000});
                res.render("findpassword", {
                                        partial: "findpassword_script",
                                        "error": "Please open the link in the email to change your password."
                });
            }
            else {
                res.render("findpassword", {
                    partial: "findpassword_script",
                    "error": "Username or email address is wrong!"
                });
            }
        } catch (e) {
            res.redirect("/error");
        }
    }
    else {
        res.render("findpassword", {
            partial: "findpassword_script",
            "error": "Please input username and email!"
        });
    }
});
router.get("/setpassword", async (req, res) => {
    if(req.cookies.changePCookie) {
        res.render("setpassword", {partial: "findpassword_script",
                                "setErr": ""});
    }
    else {
        res.redirect("/error");
    }
});
router.post("/setpassword", async (req, res) => {
    if(req.cookies.changePCookie) {
        let userObj = req.body;
        try {
            if(xss(userObj["password"]) === xss(userObj["conpassword"])) {
                let newPassword = {};
                newPassword.password = xss(userObj["password"]);
                await users.updateUser(req.cookies.changePCookie, newPassword);
                res.render("login", {
                    partial: "login_script",
                    "error": "", 
                    "url":"http://localhost:3000/login"});
            }
        } catch (e) {
            res.render("setpassword", {partial: "findpassword_script",
                                "setErr": "Change password failed!"});
        }
    }
    else {
        res.redirect("/error");
    }
});


const checkAuth = (req, res, next) => {
    if(req.cookies.AuthCookie) {
        next();
    }
    else {
        res.redirect("../login");
    }
  };


  //recomend COurses

router.get("/CourseRecomendation",checkAuth, async(req,res)=>{
    try {
        userInfo = await users.getUserByID(req.cookies.AuthCookie);
        let vaar = parseFloat(userInfo.heights);
        let vaar2 = parseFloat(userInfo.weights);
        let BMI = 703*(vaar2/(vaar*vaar));

        var cours = await courses.getAllCourses();
        let types=[];
        let CourName = [];

        for(let i = 0; i <cours.length; i++)
        {
            types[i]= cours[i].type;
            CourName[i]=cours[i].courseName;
        }

        let returnstuff=[];
        if(BMI >=1 && BMI <=18.5)
        {
            for(let i = 0; i< types.length; i++)
            {
                if(types[i]=="Strength")
                {
                    returnstuff.push(await courses.findCourseByName(CourName[i]));
                }

            }
            res.render("course/recomendations", {
                partial: "about_script",
                "course": returnstuff,
                "BMI":BMI
            });
            //moderate thinness
        }
        else if(BMI >=18.5 && BMI <=25)
        {
            for(let i = 0; i< types.length; i++)
            {
                if(types[i]=="Composite")
                {
                    returnstuff.push(await courses.findCourseByName(CourName[i]));
                }

            }
            res.render("course/recomendations", {
                partial: "about_script",
                "course": returnstuff,
                "BMI":BMI
            });
        }
        else 
        {
            for(let i = 0; i< types.length; i++)
            {
                if(types[i]=="Cardio")
                {
                    returnstuff.push(await courses.findCourseByName(CourName[i]));
                }

            }
            res.render("course/recomendations", {
                partial: "about_script",
                "course": returnstuff,
                "BMI":BMI
            });
            //Morbidly Obese 
        }
    } catch (e) {
        res.redirect("/error");
    }
} );

router.get("/error", async (req, res) => {
    res.render("error", {
        partial: "about_script",
        "error": "Some error happend, please try again.",
      });
});


///Diet Recommendations

router.get("/dietRecomendation",checkAuth, async(req,res)=>{

    userInfo = await users.getUserByID(req.cookies.AuthCookie);
    let height = parseFloat(userInfo.heights);
    let weight = parseFloat(userInfo.weights);
    let BMI = 703*(weight/(height*height));

    console.log(BMI);

    let alldiets = await diets.getAllDiets();
    let allD=[];
    let CourName = [];
   
    for(let i = 0; i <alldiets.length; i++)
    {
        allD[i]= alldiets[i];
    }

    let returnstuff=[];
    let cal;
    if(BMI >=1 && BMI <=18.5) // thin
    {
        cal =2500;
        for(let i = 0; i< allD.length; i++)
        {
            if(allD[i].mealType == "Fat" || allD[i].mealType =="Carbs" || allD[i].mealType =="Protein")
            {
                returnstuff.push(allD[i]);
            }

        }
        res.render("diet/dietRecommend", {
            partial: "about_script",
            "cal": cal,
            "BMI":BMI,
            "dietTableObjs":returnstuff
          });
        
    }
    else if(BMI >=18.5 && BMI <=25) ///Optimal BMI
    {
        cal =2100;
        for(let i = 0; i< allD.length; i++)
        {
            if(allD[i].mealType == "Protein" || allD[i].mealType =="Carbs")
            {
                returnstuff.push(allD[i]);
            }

        }
        res.render("diet/dietRecommend", {
            partial: "about_script",
            "cal": cal,
            "BMI":BMI,
            "dietTableObjs":returnstuff
          });
    }
    else 
    {
        cal =1800;
        for(let i = 0; i< allD.length; i++) //Morbidly Obese     
        {
            if(allD[i].mealType == "Protein" || allD[i].mealType =="Carbs")
            {
                returnstuff.push(allD[i]);
            }

        }
        res.render("diet/dietRecommend", {
            partial: "about_script",
            "cal": cal,
            "BMI":BMI,
            "dietTableObjs":returnstuff
          });
        
    }


} );
module.exports = router;