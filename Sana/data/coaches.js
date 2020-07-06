const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid/v4");
const coaches = mongoCollections.coaches;


const createCoach= async function createCoach(coachName, gender, availableTime, email, profession){
    if(!coachName || typeof coachName !== "string") {
        throw "Coach name is invalid!";
    }
    if(!gender || typeof gender !== "string") {
        throw "Coach gender is invalid!";
    }
    if(!availableTime || !Array.isArray(availableTime)) {
        throw "Coach available time is invalid!";
    }
    if(!email || typeof email !== "string") {
        throw "Coach email is invalid!";
    }
    if(profession && typeof profession !== "string") { // not required information
        throw "Coach profession is invalid!";
    }
    try {
        let newInfo = {
            _id: uuid(),//uuid or set number
            coachName: coachName,
            gender: gender,
            availableTime: availableTime,
            email: email,
            profession: profession,
            comment: []
        };

        const coachCollection = await coaches();
        const insertInfo = await  coachCollection.insertOne(newInfo);

        if (insertInfo.insertedCount === 0)
            throw "Could not add course info";

        const thiscoach = await this.getCoachByID(newInfo._id);
        return thiscoach;
    } catch (err) {
        throw err;
    }

}

const getAllCoaches = async function getAllCoaches() {
    try {
        const coachCollection = await coaches();
        const allCoaches = await coachCollection.find({}).toArray();
        return allCoaches;
    } catch (err) {
        throw err;
    }
}

const getCoachByID = async function getCoachByID(id) {

    if (!id)
        throw "You must provide an id to search for";

    try {
        const coachCollection = await coaches();
        const coach = await coachCollection.findOne({ _id: id });

        if (!coach)
            throw "No coach found with this id"

        return coach;
    } catch (err) {
        throw err;
    }

}

const findCoachByName = async function findCoachByName(coachName) { 
    if (!coachName)
        throw "You must provide an coach name";
    try {
        const coachCollection = await coaches();
        return await coachCollection.findOne({coachName: coachName});
        //return await coachCollection.find({coachName: coachName}).toArray(); // maybe more than one
    } catch (err) {
        throw err;
    }
}

//passwordchange?
const updateCoach = async function updateCoach(id,updateCoach){

    if (!id){
        throw "You must provide a user Id"
    }

    const coachCollection = await coaches();
    const coachInfo = await this.getCoachByID(id);
    const updateCoachData = {};

    if(coachInfo) {
        try {
            if(updateCoach.coachName){
                if (typeof updateCoach.coachName !== "string"){
                    throw "You must provide coach name as string!";
                }
                updateCoachData.coachName = updateCoach.coachName;
            }

            if(updateCoach.gender){
                if (typeof updateCoach.gender !== "string"){
                    throw "You must provide coach gender as string!";
                }
                updateCoachData.gender = updateCoach.gender;
            }

            if(updateCoach.availableTime){
                if (!Array.isArray(updateCoach.availableTime)){
                    throw "You must provide coach available time as array!";
                }
                updateCoachData.availableTime = updateCoach.availableTime;
            }

            if(updateCoach.email){
                if (typeof updateCoach.email !== "string"){
                    throw "You must provide coach email as string!";
                }
                updateCoachData.email = updateCoach.email;
            }

            if(updateCoach.profession){
                if (typeof updateCoach.profession !== "string"){
                    throw "You must provide coach profession as string!";
                }
                updateCoachData.profession = updateCoach.profession;
            }

        await coachCollection.updateOne({_id:id},{$set:updateCoachData});
            return await this.getCoachByID(id);
        }  catch (err) {
            throw err;
        }
    }

}

const removeCoach = async function removeCoach(id) {

    if (!id)
        throw "You must provide an id"

    try {
        const coachCollection = await coaches();
        const deletionInfo = await coachCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0)
            throw `Could not delete coach with id of ${id}`;

        return true;
    } catch (err) {
        throw err;
    }

}

const updateAvaiTime = async function updateAvaiTime(id, time, status) {
    if (!id)
        throw "You must provide an id"
    if (!time || !Array.isArray(time)) {
        throw "Time not valid!";
    }
    if (status === undefined || typeof status !== "boolean") {
        console.log(status);
        console.log(typeof status);
        throw "Status is not valid! true: decrease available time; false: increase available time";
    }
    if(status) {
        try {
            const coachCollection = await coaches();
            const updateInfo = await coachCollection.updateOne({_id:id},{$pull:{"availableTime": {$in: time}}});
            if(updateInfo.updateCount === 0) {
                throw "Update coach available time fialed!";
            }
        } catch (e) {
            throw e;
        }
    }
    else {
        try {
            const coachCollection = await coaches();
            const updateInfo = await coachCollection.updateOne({_id:id},{$push:{"availableTime": {$each: time}}});
            if(updateInfo.updateCount === 0) {
                throw "Update coach available time fialed!";
            }
        } catch (e) {
            throw e;
        }
    }
}

const commentCoach = async function commentCoach(id, name, commentInfo) {
    if(!id) {
        throw "Please provide the coach id!";
    }
    if(!name)
    {
        throw "Please provide the user's name"
    }
    if(!commentInfo || typeof commentInfo !== "string") {
        throw "Comment information not valid!";
    }

    try {
        const coachCollection = await coaches();
        let timeStamp = new Date();
        const commentUpdate = await coachCollection.updateOne({_id:id},{$push: {"comment": {name, commentInfo ,timeStamp}}});
        if(commentUpdate.updateCount === 0) {
            throw "Add comment failed!";
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createCoach,
    getAllCoaches,
    getCoachByID,
    findCoachByName,
    updateCoach,
    removeCoach,
    updateAvaiTime,
    commentCoach
};