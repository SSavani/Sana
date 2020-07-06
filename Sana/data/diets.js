const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid/v4");
const diets = mongoCollections.diets;


const createDiet= async function createDiet(mealName, serving, calories, mealType){
    if(!mealName || typeof mealName !== "string") {
        throw "Meal name is invalid!";
    }
    if(!serving || typeof serving !== "number") {
        throw "Meal serving is invalid!";
    }
    if(!calories || typeof calories!=="number") {
        throw "Meal calories is invalid!";
    }
    if(!mealType ||typeof mealType !== "string") {
        throw "Meal type is invalid!";
    }
    try {
        let newInfo = {
            _id: uuid(),//uuid or set number
            mealName: mealName,
            serving: serving,
            calories: calories,
            mealType: mealType
        };

        const dietColln = await diets();
        const insertInfo = await  dietColln.insertOne(newInfo);

        if (insertInfo.insertedCount === 0)
            throw "Could not add Meal Info";

        const thisDiet = await this.getDietByID(newInfo._id);
        return thisDiet;
    } catch (err) {
        console.log(err);
        throw err;
    }

}


const getAllDiets = async function getAllDiets() {
    try {
        const dietColln = await diets();
        const allDiets = await dietColln.find({}).toArray();
        return allDiets;
    } catch (err) {
        throw err;
    }
}

const getDietByID = async function getDietByID(id) {

    if (!id)
        throw "You must provide an id to search for";

    try {
        const dietColln = await diets();
        const diet = await dietColln.findOne({ _id: id });

        if (!diet)
            throw "No diet found with this id"

        return diet;
    } catch (err) {
        throw err;
    }

}

const findDietByName = async function findDietByName(dietName) { 
    if (!dietName)
        throw "You must provide a diet name";
    try {
        const dietColln = await diets();
        return await dietColln.findOne({mealName: dietName});
        //return await coachCollection.find({coachName: coachName}).toArray(); // maybe more than one
    } catch (err) {
        throw err;
    }
}



const removeDiet = async function removeDiet(id) {

    if (!id)
        throw "You must provide an id"

    try {
        const dietColln = await diets();
        const deletionInfo = await dietColln.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0)
            throw `Could not delete diet with id of ${id}`;

        return true;
    } catch (err) {
        throw err;
    }

}

module.exports={
    createDiet,
    getAllDiets,
    getDietByID,
    removeDiet,
    findDietByName
};
