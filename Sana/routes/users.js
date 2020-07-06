
const express = require("express");
const router = express.Router();
const data = require("../data");
const users = data.users;
const xss = require("xss");

const checkAuth = (req, res, next) => {
  if(req.cookies.AuthCookie) {
      next();
  }
  else {
      res.redirect("../login");
  }
};
router.get("/private", checkAuth, async (req, res) => {
  let userInfo = undefined;
  try {
      userInfo = await users.getUserByID(req.cookies.AuthCookie);
  } catch (e) {
      res.redirect("../login");
  }
  if(userInfo.isAdmin) {
      res.render("users/admin", {
          partial: "admin_script"
      });
  }
  else {
      res.render("users/private", {
                        partial: "private_script",
                        "userName": userInfo.name, 
                         "Email": userInfo.mail,
                         "gender": userInfo.gender,
                         "course": userInfo.course,
                         "coach": userInfo.coach,
                         "profilepic": userInfo.profilepic,
                         "heights" : userInfo.heights,
                         "weights": userInfo.weights});
  }
}); 
router.post("/private", async (req, res) => {
  res.redirect("/users/private");
});

router.get("/inforupdate", checkAuth, async (req, res) => {
    res.render("users/updateuser", {partial: "private_script"});
});
router.post("/inforupdate",checkAuth, async (req, res) => {
    let changeInfo = req.body;
    try {
        let newInfo = {};
        if(xss(changeInfo["username"])) {
            newInfo.name = xss(changeInfo["username"]);
        }
        if(xss(changeInfo["email"])) {
            newInfo.mail = xss(changeInfo["email"]);
        }
        if(xss(changeInfo["gender"]) && xss(changeInfo["gender"]) !== "Option") {
            newInfo.gender = xss(changeInfo["gender"]);
        }
        if(xss(changeInfo["height"])) {
            newInfo.heights = xss(changeInfo["height"]);
        }
        if(xss(changeInfo["weight"])) {
            newInfo.weights = xss(changeInfo["weight"]);
        }
        await users.updateUser(req.cookies.AuthCookie, newInfo);
        res.redirect("/users/private");
        
    } catch (e) {
        res.redirect("../error");
    }
});

router.get("/changepassword", checkAuth, async (req, res) => {
    res.render("users/changepassword", {partial: "private_script"});
});
router.post("/changepassword", checkAuth, async (req, res) => {
    let changePassword = req.body;
    if(xss(changePassword["oldpassword"]) && xss(changePassword["newpassword"]) && xss(changePassword["commpassword"])) {
        if(xss(changePassword["newpassword"]) !== xss(changePassword["commpassword"])) {
            res.render("users/changepassword", {partial: "private_script",
                                            "changePErr": "Confirm password is incorrect!"});
        }
        try {
            let isPassword = await users.confirmPassword(req.cookies.AuthCookie, xss(changePassword["oldpassword"]));
            if(isPassword !== true) {
                res.render("users/changepassword", {partial: "private_script",
                                            "changePErr": "Old password is incorrect!"});
            }
            else {
                let newPassword = {};
                newPassword.password = xss(changePassword["newpassword"]);
                await users.updateUser(req.cookies.AuthCookie, newPassword);
                res.redirect("../login");
            }
        } catch (e) {
            res.redirect("../error");
        }
    }
    else {
        res.render("users/changepassword", {partial: "private_script",
                                            "changePErr": "Please input the old and new password and confirm the new password!"});
    }
});

module.exports = router;