//This script aims to create a Administrator account, several user accounts, courses, coaches and recommend diets
const connection = require("./config/mongoConnection");
const uuid = require("uuid/v4");
const users = require("./data/users");
const coaches = require("./data/coaches");
const courses = require("./data//courses");
const diets = require("./data/diets");

async function createAdmin(userName, mail, password, gender) {
    try {
        await users.createUser(userName, mail, password, gender, "", "", true);
        let admin = await users.findUserByName(userName);
        await users.activeAccount(admin._id);
    } catch (e) {
        const db = await connection();
        await db.serverConfig.close();
        throw e;
    }
    console.log("Done!");
}

async function createUser(userName, mail, password, gender, height, weight) {
    try {
        await users.createUser(userName, mail, password, gender, height, weight, false);
        let user = await users.findUserByName(userName);
        await users.activeAccount(user._id);
    } catch (e) {
        const db = await connection();
        await db.serverConfig.close();
        throw e;
    }

    console.log("Done!");
}

async function main(){
    try{
    await createAdmin("admin", "example@stevens.edu", "123456", "male");
    await createUser("Michael", "wen820061663@gmail.com", "123456",  "male", "6.2", "159");
    await createUser("Jeff", "test11@gmail.com", "123456",  "male", "6", "160");
    await createUser("Pablo", "test12@gmail.com", "123456",  "male", "5.8", "145");
    await createUser("Jess", "test13@gmail.com", "123456",  "female", "5.6", "120");
    await createUser("Emma", "test14@gmail.com", "123456",  "female", "5.5", "110");

    await coaches.createCoach("Joey", "female", ["Mon0608", "Mon0810", "Mon1416", "Wen1618", "Thu0810", "Fri1416"], "test111@gmail.com", "Weight loss training");
    await coaches.createCoach("Joe", "male", ["Sun0810", "Sun0810", "Fri1416", "Wen0810", "Thu0810", "Tus1012"], "test112@gmail.com", "Swim training");
    await coaches.createCoach("Mike", "male", ["Tus2022", "Thu1416", "Mon1416", "Fri0810", "Thu0810", "Fri1416"], "test113@gmail.com", "yoga");
    await coaches.createCoach("Sam", "male", ["Sun0810", "Sat0810", "Fri1012", "Wen1618", "Sat1618", "Thu2022"], "test114@gmail.com", "Weight loss training");
    await coaches.createCoach("Amily", "female", ["Mon0608", "Sun0810", "Mon1416", "Thu1416", "Wen2022", "Fri1416"], "test115@gmail.com", "rehab training");

    await courses.createCourse("yoga", "yoga life", ["Mon0608","Sun0810"], 20, "Composite");
    await courses.createCourse("swim", "swimming", ["Tus2022","Thu1416"], 25, "Cardio");
    await courses.createCourse("fitness", "fitness", ["Sat1416","Sat2022","Sun1618"], 10, "Cardio");
    await courses.createCourse("bicycle", "sweat", ["Wen0608","Thu1416","Fri1012"], 20, "Cardio");
    await courses.createCourse("test", "test", ["Thu0810","Fri1012","Sat0810"], 10, "Strength");

    await diets.createDiet("Roasted Beef Sandwich", 240, 320, "Carbs");
    await diets.createDiet("MeatBall Marinara Salad", 425, 300, "Carbs");
    await diets.createDiet("Egg & Cheese", 180, 380, "Carbs");
    await diets.createDiet("Steak,Egg and Cheese", 225, 450, "Carbs");
    await diets.createDiet("AvocadoEggToast", 50, 240, "Carbs");
    await diets.createDiet("RoastBeef Wrap", 300, 480, "Protein");
    await diets.createDiet("Boiled Eggs", 100, 160, "Protein");
    await diets.createDiet("Chicken and Bacon Ranch Salad", 444, 540, "Protein");
    await diets.createDiet("RoastedChicken", 100, 230, "Protein");
    await diets.createDiet("DarkChocolate Bar", 45, 210, "Fat");
    await diets.createDiet("Pizza", 700, 1800, "Fat");
    await diets.createDiet("Baked Salmon Meatballs", 70, 295, "Protein");
    await diets.createDiet("French Fries", 100, 310, "Fat");
    await diets.createDiet("Potato Chips", 28, 150, "Fat");
    await diets.createDiet("Beef Taco", 70, 160, "Carbs");
    await diets.createDiet("Mac and Cheese", 190, 310, "Carbs");
    await diets.createDiet("Hot Dog", 50, 150, "Fat");
    } catch (e) {
        throw e;
    }
    const db = await connection();
    await db.serverConfig.close();
    console.log("Done seeding database");
}

main().catch(e => {
    console.log(e);
});

