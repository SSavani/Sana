var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'welcome.sana2018@gmail.com',
    pass: '/*gwss*/'
    }
});

const sendEmail = async function sendEmail(emailAdd, subject, content) {
    let mailOptions = {
        from: 'welcome.sana2018@gmail.com',
        to: emailAdd,
        subject: subject,
        text: content
      };
      transporter.sendMail(mailOptions, function (e, info) {
        if (e) {
            console.log(e);
        }
        else {
            console.log(e);
        }
      });
}

const confirmEmail = async function confirmEmail (emailAdd, username, url) {
    let subject = "Create New Sana Account";
    let content = "Hi " + username + 
                    ": \nWelcome to Sana!\nPlease click on the link below to finish your registration.\n"
                    + url + "\nEnjoy Sana and enjoy your life!"
    let mailOptions = {
        from: "welcome.sana2018@gmail.com",
        to: emailAdd,
        subject: subject,
        text: content
    };
        transporter.sendMail(mailOptions, function (e, info) {
            if (e) {
                console.log(e);
            }
            else {
                console.log(e);
            }
      });
}

const changePasswordEmail = async function changePasswordEmail (emailAdd, username, url) {
    let subject = "Change Password";
    let content = "Hi " + username + 
                    ": \nPlease click on the link below to set your new password.\n"
                    + url + ".\n"
    let mailOptions = {
        from: "welcome.sana2018@gmail.com",
        to: emailAdd,
        subject: subject,
        text: content
    };
    transporter.sendMail(mailOptions, function (e, info) {
        if (e) {
            console.log(e);
        }
        else {
            console.log(e);
        }
      });
}


module.exports = {
    sendEmail,
    confirmEmail,
    changePasswordEmail
};
