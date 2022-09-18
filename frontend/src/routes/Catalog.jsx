import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import dataCourses from "../assets/datasets/courses.json";
import { BsSearch } from "react-icons/bs";

// temporary image
import courseImg from "../assets/images/download.jpeg";

function Catalog() {
  const { state } = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if(state && state.filter){
      console.log(state.filter);
      setSelectedTab(state.filter);
      }
  }, [state]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
  }

  

  // Add the sort condition and randomise if relevance is chosen
  function arrangeProducts(option) {
    if (option === 0) {
      // relevance
      return dataCourses.sort(() => Math.random() - 0.5);
    } else if (option === 1) {
      // lowest stock
      return dataCourses.sort(
      (a,b)=>(a.quantityAvailable >
        b.quantityAvailable?1:-1)
      );
    } else if (option === 2) {
      // discount
      return dataCourses.sort((a, b) =>
        a.courseOriginalPrice - a.courseDiscountedPrice <
        b.courseOriginalPrice - b.courseDiscountedPrice
          ? 1
          : -1
      );
    } else if (option === 3) {
      // cheapest
      return dataCourses.sort((a, b) =>
        a.courseDiscountedPrice > b.courseDiscountedPrice ? 1 : -1
      );
    } else if (option === 4) {
      // alphabetical
      return dataCourses.sort((a, b) => (a.courseName > b.courseName ? 1 : -1));
    }
    return dataCourses.sort(() => Math.random() - 0.5); // recent
  }

  return (
    <main className="flex flex-row flex-wrap w-full h-full px-[40px] pb-[119px] bg-b1 items-center">
      <div className="flex flex-row flex-wrap w-full h-full mt-[24px] self-start p-2">
        
        <div className="flex flex-nowrap w-full justify-between mt-[8px]">
        <span className="font-type1 font-bold text-[2vw] leading-[28px] tracking-[0.3px] w-1/2 text-w1 self-center">
          Courses
        </span>
        <div className="flex w-1/4 justify-end">
        <button className="flex bg-black p-2 w-[50px] justify-center">
            <BsSearch className="self-center text-w1" />
          </button>
          <input
            className="flex bg-w1 text-black p-2 w-full rounded text-center border-2 border-b1"
            placeholder="Search for courses"
            value={search}
            onChange={handleSearchChange}
          />
          </div>
        </div>

          
        <div className="flex flex-nowrap w-full items-center font-type1 font-normal text-[12px] leading-[20px] mt-[24px] space-x-2">
          <div
            className={
              "border-[1px] w-1/5 border-[#D9D9D9] rounded-l-sm py-[6px] px-[16px] bg-w1" +
              (selectedTab === 0
                ? "border-w1 bg-black text-w1"
                : "")
            }
            onClick={() => {
              setSelectedTab(0);
            }}
          >
            Relevance
          </div>
          <div
            className={
              "flex border-[1px] w-1/5 border-[#D9D9D9] rounded-l-sm py-[6px] px-[16px] bg-w1" +
              (selectedTab === 1
                ? "border-w1 bg-black text-w1"
                : "")
            }
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            Lowest Stock
          </div>
          <div
            className={
              "flex border-[1px] w-1/5 border-[#D9D9D9] rounded-sm py-[6px] px-[16px] bg-w1" +
              (selectedTab === 2
                ? "border-w1 bg-black text-w1"
                : "")
            }
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            Most Discount
          </div>
          <div
            className={
              "flex border-[1px] w-1/5 border-[#D9D9D9] rounded-sm py-[6px] px-[16px] bg-w1" +
              (selectedTab === 3
                ? "border-w1 bg-black text-w1"
                : "")
            }
            onClick={() => {
              setSelectedTab(3);
            }}
          >
            Cheapest
          </div>
          <div
            className={
              "flex border-[1px] w-1/5 border-[#D9D9D9] rounded-r-sm py-[6px] px-[16px] bg-w1" +
              (selectedTab === 4
                ? "border-w1 bg-black text-w1"
                : "")
            }
            onClick={() => {
              setSelectedTab(4);
            }}
          >
            A - Z
          </div>
        </div>
      </div>
      <div className="flex-row flex-wrap w-full h-full mt-[24px]">
        <span className="font-type1 font-normal text-[14px] leading-[22px] text-w1 w-full px-2">
          Page 1 of 1 about 10 results
        </span>

          <div className="flex flex-row flex-wrap w-full mt-[8px]">
            {arrangeProducts(selectedTab)
              .filter(
                (a) =>
                  a.courseName.includes(search) || a.courseDescription.includes(search)
              )
              .map((course, index) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer flex flex-col flex-wrap w-1/4 p-2 rounded"
                  >
                    <div className="flex flex-wrap w-full h-full border-[1px] border-w1 p-2 bg-w1" 
                    onClick={() => navigate(""+course.courseID)}>
                    <img
                      src={courseImg}
                      className="flex  h-[120px] w-full object-stretch"
                      alt={""}
                    />
                    <div className="flex-row flex-wrap w-full space-y-2">
                      <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                        {course.courseName}(
                        <span className="text-red-500">
                          {course.quantityAvailable} left
                        </span>
                        )
                      </div>

                      <div className="flex w-full justify-between text-[1vw] leading-[20px] font-bold font-type1">
                        <span className="bg-black h-[24px] text-w1 lg:p-1 line-through">
                          U.P. ${course.courseOriginalPrice}
                        </span>
                        <span className="bg-success h-[24px] text-w1 lg:p-1">
                          NOW ${course.courseDiscountedPrice}
                        </span>
                        <span className="bg-g2 h-[24px] text-w1 lg:p-1">
                          {(
                            ((course.courseOriginalPrice -
                              course.courseDiscountedPrice) /
                              course.courseOriginalPrice) *
                            100
                          ).toFixed(0)}
                          % OFF
                        </span>
                      </div>
                      <div className="flex w-full h-[40px] justify-between text-[12px] leading-[20px] font-bold font-type1">
                        <button className="font-type1 font-bold uppercase btn w-full h-[40px]">
                          Buy Now
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
          </div>
        
      </div>
    </main>
  );
}

export default Catalog;
