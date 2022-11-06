import React, { useEffect, useState } from "react";
import { AddCourseModal } from "../../components/admin/AddCourseModal";
import courseService from "../../services/courses";
import { ConfirmationModal } from "../../modals/ConfirmationModal";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

const CoursesCatalog = () => {
  const [dataCourses, setDataCourses] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [sortTable, setSortTable] = useState("_id");

  useEffect(() => {
    retrieveCourses();
  }, [modalIsOpen, confirmDeleteModal]);

  // retrieve all courses
  const retrieveCourses = () => {
    courseService
      .getAll()
      .then((response) => {
        setDataCourses(response.data);
      })
      .catch((e) => { toast.error("Unable to retrieve courses") });
  };

  const openEditorModal = (course) => {
    if (course == null) {
      setCourseInfo({});
      setModalIsOpen(true);
    } else {
      setCourseInfo(course);
      setModalIsOpen(true);
    }
  };

  // delete course
  const deleteCourseModal = (course) => {
    setCourseInfo(course);
    setConfirmDeleteModal(true);
  };

  function sortObjectArrayByProperty(array, property) {
    array.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
  }

  const sortListing = (e) => {
    setSortTable(e.target.value);
  };

  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start overflow-y-auto">
      <div className="flex w-full font-type1 text-[20px] font-bold">
        Courses Catalog
        <div className="text-sm ml-4 self-center">
          Sort By:
          <select
            className="border-2 border-b2 p-2 rounded ml-2"
            onChange={sortListing}
          >
            <option value="_id">Id</option>
            <option value="courseName">Name</option>
            <option value="courseType">Type</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between w-full mb-4">
        <p className="flex mt-2 mb-2">Add, update, deactivate courses</p>
        <button
          className="align-end bg-success text-w1 px-4 font-bold font-type1 rounded-sm"
          onClick={() => openEditorModal(null)}
        >
          Add new courses
        </button>
      </div>
      <div className="flex flex-wrap bg-b2 rounded-t-sm p-3 font-bold text-w1 text-center justify-between w-full">
        <div className="w-auto">ID</div>
        <div className="w-auto">Name</div>
        <div className="w-auto">Type</div>
        <div className="w-auto">Image</div>
        <div className="w-auto">Quantity</div>
        <div className="w-auto">Actions</div>
      </div>

      {dataCourses
        .sort(sortObjectArrayByProperty(dataCourses, sortTable))
        .filter((course) => !course.deleteIndicator)
        .map((course) => (
          <div
            className={
              "flex flex-wrap overflow-hidden w-full hover:bg-gray-200 border-b-2"
            }
            key={course._id}
          >
            <div className="truncate ... overflow-hidden w-[10%] my-auto pl-2">
              {course._id.substring(course._id.length - 5)}
            </div>
            <div className="overflow-y-hidden w-[25%] my-auto">
              <p className="w-full max-w-[200px]">
                <b>{course.company}</b>
                <br /> {course.courseName}
              </p>
            </div>
            <div className="truncate ... overflow-hidden w-[10%] my-auto">
              {course.courseType}
            </div>
            <div className="w-[25%] justify-center">
              <img
                src={`https://learn4fund.tk/v1/api/images/getImg/${course.courseImg}`}
                className="flex h-[120px] w-full object-stretch self-center"
                alt={"example"}
              />
            </div>
            <div className="truncate ... overflow-hidden w-[10%] my-auto text-center">
              {course.quantity}
            </div>
            <div className="w-[20%] my-auto">
              <button
                className="bg-blue-400 w-1/2 h-[40px] font-bold text-center mx-auto font-type1 rounded-lg"
                onClick={() => {
                  openEditorModal(course);
                }}
              >
                <span className="self-center">Edit</span>
                <AiOutlineEdit className="inline self-center" />
              </button>
              <button
                className=" bg-black text-white w-1/2 h-[40px] font-bold mx-auto font-type1 rounded-lg"
                onClick={() => {
                  deleteCourseModal(course);
                }}
              >
                <span className="self-center">Delete</span>
                <AiOutlineDelete className="inline self-cente" />
              </button>
            </div>
          </div>
        ))}

      
      {confirmDeleteModal && (
        <ConfirmationModal
          closeModal={setConfirmDeleteModal}
          courseInfo={courseInfo}
        />
      )}
      {modalIsOpen && (
        <AddCourseModal
          closeModal={setModalIsOpen}
          courseInfo={courseInfo}
          setCourseInfo={setCourseInfo}
        />
      )}
    </div>
  );
};

export default CoursesCatalog;
