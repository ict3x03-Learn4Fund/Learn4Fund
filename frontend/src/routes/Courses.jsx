import React, { useLayoutEffect, useState, useEffect } from "react";
import CourseDataService from "../services/courses";

import { useNavigate } from "react-router-dom";

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStoreLocation, setSearchStoreLocation] = useState("");

  useEffect(() => {
    retrieveCourses();
  }, []);

  // retrieve all courses
  const retrieveCourses = () => {
    CourseDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setCourses(response.data.courses);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // search and filter items by email 
  const onChangeSearchEmail = (e) => {
    const searchEmail = e.target.value;
    setSearchEmail(searchEmail);
  };

  // search and filter items by email
  const onChangeSearchStoreLocation = (e) => {
    const searchStoreLocation = e.target.value;
    setSearchStoreLocation(searchStoreLocation);
  };

  
  // logic to find and filter items by specified type
  const find = (query, by) => {
    CourseDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setCourses(response.data.courses);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // call find method to find by email
  const findByEmail = () => {
    find(searchEmail, "email");
  };

  // call find method to find by storeLocation
  const findByStoreLocation = () => {
    find(searchStoreLocation, "storeLocation");
  };

  // render the frontend html
  return (
    <main className="flex flex-col flex-wrap w-full h-full px-[120px] pb-[119px] bg-[#EFEFF0] items-center">
      <input
        type="text"
        placeholder="Search by email"
        value={searchEmail}
        onChange={onChangeSearchEmail}
      />
      <button type="button" onClick={findByEmail}>
        Search Email
      </button>

      <input
        type="text"
        placeholder="Search by store location"
        value={searchStoreLocation}
        onChange={onChangeSearchStoreLocation}
      />
      <button type="button" onClick={findByStoreLocation}>
        Search store location
      </button>

      <div className="flex flex-row flex-wrap w-full mt-[12px] gap-[8px]">
        {courses.map((course) => {
          return (
            <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">{course.storeLocation}</div>
                <p class="text-gray-700 text-base">
                  {course.saleDate}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Courses;
