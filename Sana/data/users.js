const mongoCollections = require("../config/mongoCollections");
const course = require("./courses");
const coach = require("./coaches");
const uuid = require("uuid/v4");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 16;

module.exports = {
async createUser(userName, mail, password, gender, heights, weights, isAdmin) {
    if (!userName || typeof userName !== "string") 
        throw "User name is not valid!";
    if (!password || typeof password !== "string") 
        throw "Password is not valid";
    if (!mail || typeof mail !== "string") 
        throw "Email is not valid";
    if (!isAdmin) //Not admin by default
        isAdmin = false;
    const checkUserName = await this.findUserByName(userName);
    if(checkUserName) {
        throw "Username has exist!";
    }
    const userCollection = await users();
    const checkEmail = await userCollection.findOne({ mail: mail });
    if(checkEmail) {
        throw "Email has been registered";
    }

    let hash = await bcrypt.hash(password, saltRounds)
    try {
        let newInfo = {
            _id: uuid(),
            name: userName,
            password: hash,
            mail: mail, //account
            gender: gender,
            course: [],
            coach: [],
            profilepic: "", //which way should we use to store pic
            heights: heights,
            weights: weights,
            isAdmin: isAdmin,
            status: false //true: actived, false: nonactivated
        };

        
        const insertInfo = await userCollection.insertOne(newInfo);

        if (insertInfo.insertedCount === 0)
            throw "Could not add user info";

        const thisUser = await this.getUserByID(newInfo._id);
        return thisUser;
    } catch (err) {
        throw err;
    }
},

async getAllUsers() {
    try {
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    }  catch (err) {
        throw err;
    }
},

async getUserByID(id) {

    if (!id)
        throw "You must provide an id to search for";

    try {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });

        if (!user)
            throw "No user found with this id"

        return user;
    } catch (err) {
        throw err;
    }

},

async findUserByName(username) { //
    if (!username)
        throw "You must provide an username";
        let userInfo;
    try {
        const userCollection = await users();
        userInfo = await userCollection.findOne({ name: username });
    } catch (err) {
        throw err;
    }
    return userInfo;
},

//
async updateUser(id,updatedUser) {
    if (!id){
        throw "You must provide a user Id to search for"
    }

    const userCollection = await users();
    let userInfo = await this.getUserByID(id);
    let updatedUserData = {};
    if(userInfo) {
        try {
            if(updatedUser.name){
                if (typeof updatedUser.name !== "string"){
                    throw "You must provide username as string!";
                }
                updatedUserData.name = updatedUser.name;
            }
            if(updatedUser.mail) {
                if(typeof updatedUser.mail !== "string") {
                    throw "You must provide email address as string";
                }
                updatedUserData.mail = updatedUser.mail;
            }
    
            if(updatedUser.password){
                if (typeof updatedUser.password !== "string"){
                    throw "You must provide password as string!";
                }
                let hash = await bcrypt.hash(updatedUser.password, saltRounds)
                updatedUserData.password = hash;
            }
    
            if(updatedUser.gender){
                if (typeof updatedUser.gender !== "string"){
                    throw "You must provide gender as string!";
                }
                updatedUserData.gender = updatedUser.gender;
            }
    
            if(updatedUser.heights){
                if (typeof updatedUser.heights !== "string"){
                    throw "You must provide height as string!";
                }
                updatedUserData.heights = updatedUser.heights;
            }
    
            if(updatedUser.weights){
                if (typeof updatedUser.weights !== "string"){
                    throw "You must provide weight as string!";
                }
                updatedUserData.weights = updatedUser.weights;
            }
            
            await userCollection.updateOne({_id:id},{$set:updatedUserData});
            return await this.getUserByID(id);
        } catch (err) {
            throw err;
        }
    }
    else {
        throw "User not found!";
    }
},

async removeUser(id) {

    if (!id)
        throw "You must provide an id to search for"

    try {

        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0)
            throw `Could not delete user with id of ${id}`;

        return true;
    } catch (err) {
        throw err;
    }
},

//same as finduserbyname
async getExistingUser(username) {
    if (!username) throw "No destination name provided";
    const userCollection = await users();
    return await userCollection.findOne({ name: username });
},

async checkPassword(username, password) {
    if(!username || !password) {
        throw "Please input username/password!";
    }
    try {
        var user = await this.getExistingUser(username);
    } catch (e) {
        throw e;
    }
    if (user) {
        try {
            let res = await bcrypt.compare(password, user.password);
            if (res) {
                return user._id;
            }
            return false;
        } catch (e) {
            throw e;
        }
    } 
},

async checkTimeConflict(id, newTime) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }
    if(!newTime || !Array.isArray(newTime)) {
        throw "New time not valid";
    }
    const userInfo = await this.getUserByID(id);

    let newWeek = "";
    let newBegin = 0;
    let newEnd = 0;
    let oldWeek = "";
    let oldBegin = 0;
    let oldEnd = 0;
    for(let i=0; i<newTime.length; i++) {
        for(let j=0; j<userInfo.course.length; j++) {
            for(let k=0; k<userInfo.course[j].cTime.length; k++) {
                newWeek = newTime[i].substring(0, 2);
                newBegin = parseInt(newTime[i].substring(3, 4));
                newEnd = parseInt(newTime[i].substring(5, 6));
                oldWeek = userInfo.course[j].cTime[k].substring(0, 2);
                oldBegin = parseInt(userInfo.course[j].cTime[k].substring(3, 4));
                oldEnd = parseInt(userInfo.course[j].cTime[k].substring(5, 6));
                if(newWeek === oldWeek && 
                    ((newBegin >= oldBegin && newBegin <= oldEnd) ||
                    (newEnd >= oldBegin && newEnd <= oldEnd) ||
                    (oldBegin >= newBegin && oldBegin <= newEnd) ||
                    (oldEnd >= newBegin && oldEnd <= newEnd))) {
                        throw "Time conflict!";
                    }
            }
        }
    }
    for(let i=0; i<newTime.length; i++) {
        for(let j=0; j<userInfo.coach.length; j++) {
            for(let k=0; k<userInfo.coach[j].cTime.length; k++) {
                newWeek = newTime[i].substring(0, 2);
                newBegin = parseInt(newTime[i].substring(3, 4));
                newEnd = parseInt(newTime[i].substring(5, 6));
                oldWeek = userInfo.coach[j].cTime[k].substring(0, 2);
                oldBegin = parseInt(userInfo.coach[j].cTime[k].substring(3, 4));
                oldEnd = parseInt(userInfo.coach[j].cTime[k].substring(5, 6));
                if(newWeek === oldWeek && 
                    ((newBegin >= oldBegin && newBegin <= oldEnd) ||
                    (newEnd >= oldBegin && newEnd <= oldEnd) ||
                    (oldBegin >= newBegin && oldBegin <= newEnd) ||
                    (oldEnd >= newBegin && oldEnd <= newEnd))) {
                        throw "Time conflict!";
                    }
            }
        }
    }
    return true;
},

async registerCourse(id, courseId, courseName, courseTime) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }
    if(!courseId || typeof courseId !== "string") {
        throw "Please provide a valid course id!";
    }
    if(!courseName || typeof courseName !== "string") {
        throw "Course name or course time not valid";
    }
    if(!courseTime || !Array.isArray(courseTime)) {
        throw "Course name or course time not valid";
    }
    try {
        await this.checkTimeConflict(id, courseTime);
    } catch (e) {
        throw e;
    }
    try { //update available site first
        await course.updateAvaiSite(courseId, true);
    } catch (e) {
        throw e;
    }
    let courseObj = {cId: courseId, cName: courseName, cTime: courseTime};
    try {
        const userCollection = await users();
        const addCourse = await userCollection.updateOne({_id:id},{$push: {"course": courseObj}});
        if(addCourse.updateCount === 0) {
            try {//change back
                await course.updateAvaiSite(courseId, false);
            } catch (e) {
                throw e;
            }
            throw "Can't add course!";
        }
    } catch (e) {
        try {//change back
            await course.updateAvaiSite(courseId, false);
        } catch (e) {
            throw e;
        }
        throw e;
    }
    return true;
},

async withdrawCourse(id, courseId, courseName, courseTime) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }
    if(!courseId || typeof courseId !== "string") {
        throw "Please provide a valid course id!";
    }
    if(!courseName || typeof courseName !== "string") {
        throw "Course name or course time not valid";
    }
    if(!courseTime || !Array.isArray(courseTime)) {
        throw "Course name or course time not valid";
    }
    try {
        await course.updateAvaiSite(courseId, false);
    } catch (e) {
        throw e;
    }
    let courseObj = {cId: courseId, cName: courseName, cTime: courseTime};
    try {
        const userCollection = await users();
        const withdraw = await userCollection.updateOne({_id:id},{$pull: {"course": courseObj}});
        if(withdraw.updateCount === 0) {
            try {
                await course.updateAvaiSite(courseId, true);
            } catch (e) {
                throw e;
            }
            throw "Can't withdraw course!";
        }
    } catch (e) {
        try {
            await course.updateAvaiSite(courseId, true);
        } catch (e) {
            throw e;
        }
        throw e;
    }
    
    return true;
},

async registerCoach(id, coachId, coachName, coachTime) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }
    if(!coachId || typeof coachId !== "string") {
        throw "Please provide a valid coach id!";
    }
    if(!coachName || typeof coachName !== "string") {
        throw "Coach name is not valid";
    }
    if(!coachTime || !Array.isArray(coachTime)) {
        throw "Coach time is not valid";
    }
    try {
        await this.checkTimeConflict(id, coachTime);
    } catch (e) {
        throw e;
    }
    try {
        await coach.updateAvaiTime(coachId, coachTime, true);
    } catch (e) {
        throw e;
    }
    let coachObj = {cId: coachId, cName: coachName, cTime: coachTime};
    try {
        const userCollection = await users();
        const addCoach = await userCollection.updateOne({_id:id},{$push: {"coach": coachObj}});
        if(addCoach.updateCount === 0) {
            try {
                await coach.updateAvaiTime(coachId, coachTime, false);
            } catch (e) {
                throw e;
            }
            throw "Can't add coach!";
        }
    } catch (e) {
        try {
            await coach.updateAvaiTime(coachId, coachTime, false);
        } catch (e) {
            throw e;
        }
        throw e;
    }
    
    return true;
},
async withdrawCoach(id, coachId, coachName, coachTime) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }
    if(!coachId || typeof coachId !== "string") {
        throw "Please provide a valid coach id!";
    }
    if(!coachName || typeof coachName !== "string") {
        throw "Coach name is not valid";
    }
    if(!coachTime || !Array.isArray(coachTime)) {
        throw "Coach time is not valid";
    }
    try { //update available first
        await coach.updateAvaiTime(coachId, coachTime, false);
    } catch (e) {
        throw e;
    }
    let coachObj = {cId: coachId, cName: coachName, cTime: coachTime};
    try {
        const userCollection = await users();
        const delCoach = await userCollection.updateOne({_id:id},{$pull: {"coach": coachObj}});
        if(delCoach.updateCount === 0) {
            try { //change back
                await coach.updateAvaiTime(coachId, coachTime, true);
            } catch (e) {
                throw e;
            }
            throw "Can't withdraw coach!";
        }
    } catch (e) {
        try { //change back
            await coach.updateAvaiTime(coachId, coachTime, true);
        } catch (e) {
            throw e;
        }
        throw e;
    }
    
    return true;
},

async activeAccount(id) {
    if(!id || typeof id !== "string") {
        throw "Please provide a valid user id!";
    }

    const userInfo = await this.getUserByID(id);
    if(userInfo) {
        try {
            const userCollection = await users();
            await userCollection.updateOne({_id:id},{$set:{status: true}});
        } catch (e) {
            throw e;
        }
        return true;
    }
    else {
        throw "User not found!";
    }
},

async confirmPassword(id, password) {
    if(!id || !password) {
        throw "Please input userId and password!";
    }
    let user;
    try {
        user = await this.getUserByID(id);
    } catch (e) {
        throw e;
    }
    if (user) {
        try {
            let res = await bcrypt.compare(password, user.password);
            return res;
        } catch (e) {
            throw e;
        }
    } 
}
};
