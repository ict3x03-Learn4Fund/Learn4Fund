// let courses

// // class that contains api logic, which is called by the controller class
// export default class CoursesDAO{
//     // to connect to the database
//     static async injectDB(conn){
//         if (courses){
//             return
//         }
//         try {
//             courses = await conn.db(process.env.COURSES_NS).collection("courses")
//         } catch (e) {
//             console.error(
//                 `Unable to establish a collection handle in coursesDAO: ${e}`,
//             )
//         }
//     }
    
//     // api logic for getting all courses with fliter options
//     static async getCourses({
//         filters=null,
//         page=0,
//         coursesPerPage=20,
//     } = {}){
//         let query
//         if (filters){
//             if ("name" in filters) {
//                 query = { $text: { $search: filters["name"]}}
//             } else if ("courseType" in filters) {
//                 query = { "courseType" : { $eq: filters["courseType"]}}
//             }
//         }

//         let cursor

//         try {
//             cursor = await courses.find(query)
//         } catch (e) {
//             console.error(`Unable to issue find command, ${e}`)
//             return { coursesList: [], totalNumCourses: 0}
//         }

//         const displayCursor = cursor.limit(coursesPerPage).skip(coursesPerPage * page)

//         try {
//             const coursesList = await displayCursor.toArray()
//             const totalNumCourses = await courses.countDocuments(query)
//             return { coursesList, totalNumCourses}
//         } catch (e) {
//             console.error(
//                 `Unable to convert cursor to array or problem counting documents, ${e}`,
//             )
//             return { coursesList: [], totalNumCourses: 0}
//         }
//     }

    
// }