import React, {useEffect, useState} from 'react'
import {AddCourseModal} from '../../components/admin/AddCourseModal'
import courseService from '../../services/courses';
import {ConfirmationModal} from '../../modals/ConfirmationModal'
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai'

const CoursesCatalog = () => {
  const [dataCourses, setDataCourses] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [sortTable, setSortTable] = useState("_id");

  useEffect(() => {
    retrieveCourses();
  },[]);

  // retrieve all courses
  const retrieveCourses = () => {
    courseService
      .getAll()
      .then((response) => {
        setDataCourses(response.data);
        console.log(dataCourses)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openEditorModal = (course) => {
    if (course==null){
      setCourseInfo({});
      setModalIsOpen(true);
    }else{
      setCourseInfo(course);
      setModalIsOpen(true);
    }
  }

  // delete course
  const deleteCourseModal = (course) => {
    setCourseInfo(course);
    setConfirmDeleteModal(true);
  }

  function sortObjectArrayByProperty(array, property) {
    array.sort(function(a, b) {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
  }

  const sortListing = (e) => {
    setSortTable(e.target.value)
  }

  
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start overflow-y-auto">
      <div className="flex w-full font-type1 text-[20px] font-bold">
        Courses Catalog
        <div className='text-sm ml-4 self-center'>Sort By: 
          <select className='border-2 border-black ml-2' onChange={sortListing}>
          <option value="_id">Id</option>
          <option value="courseName">Name</option>
          <option value="courseType">Type</option>
          <option value="quantity">Quantity</option>
          </select></div>
      </div>
      <div className="flex justify-between w-full mb-4">
      <p className="flex mt-2 mb-2">Add, update, deactivate courses</p>
      <button className="align-end bg-success text-w1 px-4 font-bold font-type1 rounded-sm" onClick={()=>openEditorModal(null)}>Add new courses</button>

      </div>
      <div className="w-full table-responsive">
        <table className="table w-full table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th className='w-1/6 border'>ID</th>
              <th className='w-1/6 border'>Name</th>
              <th className='w-1/6 border'>Type</th>
              <th className='w-1/6 border'>Img</th>
              <th className='w-1/6 border'>Quantity</th>
              <th className='w-1/6 border'>Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {dataCourses.sort(sortObjectArrayByProperty(dataCourses, sortTable)).map((course) => (
              <tr key={course._id}>
                <td className='w-1/6'>{course._id.substring(course._id.length-5)}</td>
                <td className='w-1/6'><b>{course.company }</b><br/> {  course.courseName}</td>
                <td className='w-1/6'>
                  {course.courseType}
                </td>
                <td className='w-1/6'>
                <img
                    src={`http://localhost:5000/v1/api/images/getImg/${course.courseImg}`}
                    className="flex h-[120px] w-full object-stretch"
                    alt={"exmaple"}
                  /></td>
                <td className='w-1/6'>{course.quantity}</td>
              <td>
                <div className="flex flex-wrap w-full space-y-2">
                <button className="flex bg-yellow-400 w-full h-[40px] justify-center font-bold font-type1 rounded-lg" onClick={()=>{openEditorModal(course)}}>
                  <span className='self-center'>
                  Edit
                    </span> 
                  <AiOutlineEdit className='self-center'/></button>
                <button className="flex bg-danger w-full h-[40px] font-bold justify-center font-type1 rounded-lg" onClick={()=>{deleteCourseModal(course)}}>
                  <span className='self-center'>Delete</span> 
                  <AiOutlineDelete className='self-center'/></button>
                </div>
              </td>
                </tr>
            ))}

            
          </tbody>
        </table>
      </div>
              {confirmDeleteModal && <ConfirmationModal closeModal={setConfirmDeleteModal} courseInfo={courseInfo}/>}
              {modalIsOpen && <AddCourseModal closeModal={setModalIsOpen} courseInfo={courseInfo} setCourseInfo={setCourseInfo}/>}
    </div>
  )
}

export default CoursesCatalog