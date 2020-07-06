const mongoCollections = require("../config/mongoCollections");
const uuid = require("uuid/v4");
const courses = mongoCollections.courses;

const createCourse = async function createCourse(courseName, courseDes, courseTime, capacity,  type) {
    if(!courseName || typeof courseName !== "string") {
        throw "Course name is invalid!";
    }
    const checkName = await this.findCourseByName(courseName);
    if(checkName) {
        throw "Course Name has existed!";
    }
    if(!courseDes || typeof courseDes !== "string") {
        throw "Course description is invalid!";
    }
    if(!courseTime || !Array.isArray(courseTime)) {
        throw "Course time is invalid!";
    }
    if(!capacity || typeof capacity !== "number" || capacity <= 0) {
        throw "Course capacity is invalid!";
    }
    try {
        let newInfo = {
            _id: uuid(),//uuid or set number
            courseName: courseName,
            courseDes: courseDes,
            courseTime: courseTime,
            capacity: capacity,
            availableSite: capacity,
            type: type,
            comment: []
        };

        const courseCollection = await courses();
        const insertInfo = await courseCollection.insertOne(newInfo);

        if (insertInfo.insertedCount === 0)
            throw "Could not add course info";

        const thiscourse = await this.getCourseByID(newInfo._id);

        return thiscourse;
    } catch (err) {
        throw err;
    }

}

const getAllCourses = async function getAllCourses() {
    try {
        const courseCollection = await courses();
        const allCourses = await courseCollection.find({}).toArray();
        return allCourses;
    } catch (err) {
        throw err;
    }

}

const getCourseByID = async function getCourseByID(id) {

    if (!id)
        throw "You must provide an id to search for";

    try {
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: id });

        if (!course)
            throw "No course found with this id"

        return course;
    }  catch (err) {
        throw err;
    }
}

const findCourseByName = async function findCourseByName(courseName) { //userName?
    if (!courseName)
        throw "You must provide an course name";
    try {
        const courseCollection = await courses();
        return await courseCollection.findOne({courseName: courseName });
    }
    catch (err) {
        throw err;
    }
}


const updateCourse = async function updateCourse(id,updateCourse){

    if (!id){
        throw "You must provide a course Id";
    }

    
    const courseInfo = await this.getCourseByID(id);
    const updatedCourseData = {};

    if(courseInfo) {
        try {
            if(updateCourse.courseName){
                if (typeof updateCourse.courseName !== "string"){
                    throw "You must provide course name as string!";
                }
                updatedCourseData.courseName = updateCourse.courseName;
            }

            if(updateCourse.courseDes){
                if (typeof updateCourse.courseDes !== "string"){
                    throw "You must provide course description as string!";
                }
                updatedCourseData.courseDes = updateCourse.courseDes;
            }

            if(updateCourse.courseTime){
                if (!Array.isArray(updateCourse.courseTime)){
                    throw "You must provide course time as array!";
                }
                updatedCourseData.courseTime = updateCourse.courseTime;
            }

            if(updateCourse.capacity){
                if (typeof updateCourse.capacity !== "number"){
                    throw "You must provide course capacity as number!";
                }
                if (updateCourse.capacity <= 0){
                    throw "You must provide course capacity bigger than 0!";
                }
                updatedCourseData.capacity = updateCourse.capacity;
                //update availableSite when update the capacity
                updatedCourseData.availableSite = updateCourse.capacity-(courseInfo.capacity-courseInfo.availableSite);
                if((updatedCourseData.availableSite) < 0) {
                    throw `Can't update course because the capacity is too small and there are ${courseInfo.capacity-courseInfo.availableSite} users have registered`;
                }
            }
            const courseCollection = await courses();
        await courseCollection.updateOne({_id:id},{$set:updatedCourseData});
            return await getCourseByID(id);
        } catch (err) {
            throw err;
        }
    }
    else {
        throw "Course not found!";
    }

}

const removeCourse = async function removeCourse(id) {

    if (!id)
        throw "You must provide an id to search for"

    try {
        const courseCollection = await courses();
        const deletionInfo = await courseCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0)
            throw `Could not delete course with id of ${id}`;

        return true;
    }  catch (err) {
        throw err;
    }

}

const updateAvaiSite = async function updateAvaiSite(id, status) {
    if (!id)
        throw "You must provide an course id";
    if (status === undefined || typeof status !== "boolean")
        throw "Status is not valid! true: decrease available site; false: increase available site";

    if(status) {
        try {
            const courseCollection = await courses();
            const courseInfo = await getCourseByID(id);
            if(courseInfo.availableSite <= 0) {
                throw "The course is full";
            }
            let newAvaiSite = courseInfo.availableSite - 1;
            const updateInfo = await courseCollection.updateOne({_id:id},{$set: {"availableSite": newAvaiSite}});

            if (updateInfo.updateCount === 0)
                throw "Update available site failed!";

            return true;
        }  catch (err) {
            throw err;
        }
    }
    else {
        try {
            const courseCollection = await courses();
            const courseInfo = await getCourseByID(id);
            let newAvaiSite = courseInfo.availableSite + 1;
            const updateInfo = await courseCollection.updateOne({_id:id},{$set: {"availableSite": newAvaiSite}});

            if (updateInfo.updateCount === 0)
                throw "Update available site failed!";

            return true;
        }  catch (err) {
            throw err;
        }
    }
}

const commentCourse = async function commentCourse(id, name, commentInfo) {
    if(!id) {
        throw "Please provide the course id!";
    }
    if(!name)
    {
        throw "Please provide the user's name"
    }
    if(!commentInfo || typeof commentInfo !== "string") {
        throw "Comment information not valid!";
    }
    try {
        const courseCollection = await courses();
        let timeStamp = new Date();
        const commentUpdate = await courseCollection.updateOne({_id:id},{$push: {"comment": {name, commentInfo ,timeStamp}}});
        if(commentUpdate.updateCount === 0) {
            throw "Add comment failed!";
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseByID,
    findCourseByName,
    updateCourse,
    removeCourse,
    updateAvaiSite,
    commentCourse
};