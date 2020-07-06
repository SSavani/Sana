//This script aims to create a Administrator account
const users = require("./users");
const courses = require("./courses");
const coaches = require("./coaches");
const connection = require("../config/mongoConnection");
const uuid = require("uuid/v4");

/*async function createUser(userName, mail, password, gender, height, weight) {
    try {
        await users.createUser(userName, mail, password, gender, height, weight, false);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

createUser("NewUser", "test@stevens.edu", "123456", "male", 180, 70).catch(e => {
    console.log(e);
});*/

async function createCourse(courseName, courseDes, courseTime, capacity) {
    try {
        await courses.createCourse(courseName, courseDes, courseTime, capacity);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

createCourse("slimnastics", "Best to help you keep slim", ["Ths1415", "Fri2022"], 30).catch(e => {
    console.log(e);
});

/*async function createCoach(coachName, gender, availableTime, email, profession) {
    try {
        await coaches.createCoach(coachName, gender, availableTime, email, profession);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

createCoach("Peak Joy", "male", ["Ths1415", "Mon0608", "Wen2022"], "example@email.com", "swim").catch(e => {
    console.log(e);
});*/

/*async function addCourse(userId, courseId, courseName, courseTime) {
    try {
        await users.registerCourse(userId, courseId, courseName, courseTime);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

addCourse("5184c9e6-0473-41d9-8c98-3ef7ae63deb9", "1a2460fd-3345-459f-9ac6-a96fb6527c27", "slimnastics", ["Ths1415", "Fri2022"]).catch(e => {
    console.log(e);
});*/

/*async function dropCourse(userId, courseId, courseName, courseTime) {
    try {
        await users.withdrawCourse(userId, courseId, courseName, courseTime);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

dropCourse("5184c9e6-0473-41d9-8c98-3ef7ae63deb9", "1a2460fd-3345-459f-9ac6-a96fb6527c27", "slimnastics", ["Ths1415", "Fri2022"]).catch(e => {
    console.log(e);
});*/

/*async function addCoach(userId, coachId, coachName, coachTime) {
    try {
        await users.registerCoach(userId, coachId, coachName, coachTime);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

addCoach("5184c9e6-0473-41d9-8c98-3ef7ae63deb9","6b13e1f7-1e31-488f-8387-345abab7ad76","Peak Joy", ["Mon0608", "Wen2022"]).catch(e => {
    console.log(e);
});*/

/*async function dropCoach(id, coachId, coachName, coachTime) {
    try {
        await users.withdrawCoach(id, coachId, coachName, coachTime);
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

dropCoach("5184c9e6-0473-41d9-8c98-3ef7ae63deb9","6b13e1f7-1e31-488f-8387-345abab7ad76", "Peak Joy", ["Mon0608", "Wen2022"]).catch(e => {
    console.log(e);
});*/

/*async function commentCourse(courseId, commentInfo) {
    try {
        await courses.commentCourse(courseId, commentInfo);
    } catch  (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

let commentInfo = {commentDes: "Very good!",
                    commentId: "userId",
                    commentTime: Date.now()};

commentCourse("1a2460fd-3345-459f-9ac6-a96fb6527c27", commentInfo).catch(e => {
    console.log(e);
});

async function commentCoach(coachId, commentInfo) {
    try {
        await coaches.commentCoach(coachId, commentInfo);
    } catch  (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();

    console.log("Done!");
}

commentCoach("6b13e1f7-1e31-488f-8387-345abab7ad76", commentInfo).catch(e => {
    console.log(e);
});*/
