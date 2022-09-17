import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

// Mock datasets to render
import dataCourses from "../assets/datasets/courses.json";

// temporary image
import courseImg from "../assets/images/download.jpeg";

// retrieve banners
import Banner1 from "../assets/images/top donators.png";
import Banner2 from "../assets/images/donation drive.png";
import Banner3 from "../assets/images/business partners.png";

// import Swiper core and required modules
import { Navigation, Pagination, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

//Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Subscribe from "../components/banner/Subscribe";
import { BsSearch } from "react-icons/bs";

function Homepage() {
  const navigate = useNavigate();



  function sortByDiscount( a, b ) {
    if ( (a.courseOriginalPrice - a.courseDiscountedPrice) > (b.courseOriginalPrice - b.courseDiscountedPrice) ){
      return -1;
    }
    if ( (a.courseOriginalPrice - a.courseDiscountedPrice) < (b.courseOriginalPrice - b.courseDiscountedPrice) ){
      return 1;
    }
    return 0;
  }


  return (
    <main className="flex flex-col flex-wrap w-full h-full bg-b1 items-center space-y-[40px] pb-[40px]">
      
      <div className="flex h-[480px] w-4/5 bg-w1 border-[1px] border-w2 rounded mt-[24px]">
        <Swiper
          //Swiper modules
          modules={[Navigation, Pagination, Autoplay]}
          speed={400}
          lazy={true}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{ delay: 2500, disableOnInteraction: true }}
          loop
          pagination={{ clickable: true }}
        >
          <SwiperSlide><img src={Banner1} className="w-full h-full object-fill" alt="top donations"/></SwiperSlide>
          <SwiperSlide><img src={Banner2} className="w-full h-full object-fill" alt="promotions"/></SwiperSlide>
          <SwiperSlide><img src={Banner3} className="w-full h-full object-fill" alt="contact us"/></SwiperSlide>
        </Swiper>
      </div>
      <Subscribe />

      <div className="flex flex-row flex-wrap w-full justify-end mb-2 mt-[24px] px-[120px]">
          <button className="flex w-[40px] h-[40px] bg-black rounded-full p-2 justify-center">
            <BsSearch className="self-center text-w1" />
          </button>
          <input
            className="flex w-1/3 bg-w1 text-black p-2 ml-2 rounded text-center border-2 border-b1"
            placeholder="Search for courses"
          />
      </div>

      <section className="w-full px-[120px]">
        <div className="font-type1 font-bold text-[2rem] tracking-[0.3px] text-w1">
          Cheapest Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[1rem] font-type1 font-normal">
            Browse the list of courses with the most discount!
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("courses")}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {dataCourses.sort(sortByDiscount).slice(0,4).map((course, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer flex flex-col flex-wrap w-1/4 bg-w1 border-[1px] border-w1 p-2 rounded"
                // onClick={() => navigate("products/" + course.id)}
                onClick={() => console.log("products/" + course.courseID)}
              >
                <img
                  src={courseImg}
                  className="flex h-[120px] w-full object-stretch"
                  alt={""}
                />
                <div className="flex-row flex-wrap w-full space-y-2">
                <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                  {course.courseName}
                </div>
                
                <div className="flex w-full justify-between text-[1vw] leading-[20px] font-bold font-type1">
                  <span className="bg-black h-[24px] text-w1 lg:p-1 line-through">U.P. ${course.courseOriginalPrice}</span>
                  <span className="bg-success h-[24px] text-w1 lg:p-1">NOW ${course.courseDiscountedPrice}</span>
                  <span className="bg-g2 h-[24px] text-w1 lg:p-1">{((course.courseOriginalPrice - course.courseDiscountedPrice)/course.courseOriginalPrice*100).toFixed(0)}% OFF
                  </span>
</div>
                <div className="flex w-full h-[40px] justify-between text-[12px] leading-[20px] font-bold font-type1">
                  <button className="font-type1 font-bold uppercase btn w-full h-[40px]">Buy Now</button>
                </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full px-[120px]">
        <div className="font-type1 font-bold text-[2rem] tracking-[0.3px] text-w1">
        Featured Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[1rem] font-type1 font-normal">
          All courses are handpicked by our team!
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("courses")}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {dataCourses.sort(() => Math.random() - 0.5).slice(0,4).map((course, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer flex flex-col flex-wrap w-1/4 bg-w1 border-[1px] border-w1 p-2 rounded"
                // onClick={() => navigate("products/" + course.id)}
                onClick={() => console.log("products/" + course.courseID)}
              >
                <img
                  src={courseImg}
                  className="flex h-[120px] w-full object-stretch"
                  alt={""}
                />
                <div className="flex-row flex-wrap w-full space-y-2">
                <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                  {course.courseName}
                </div>
                
                <div className="flex w-full justify-between text-[1vw] leading-[20px] font-bold font-type1">
                  <span className="bg-black h-[24px] text-w1 lg:p-1 line-through">U.P. ${course.courseOriginalPrice}</span>
                  <span className="bg-success h-[24px] text-w1 lg:p-1">NOW ${course.courseDiscountedPrice}</span>
                  <span className="bg-g2 h-[24px] text-w1 lg:p-1">{((course.courseOriginalPrice - course.courseDiscountedPrice)/course.courseOriginalPrice*100).toFixed(0)}% OFF
                  </span>
</div>
                <div className="flex w-full h-[40px] justify-between text-[12px] leading-[20px] font-bold font-type1">
                  <button className="font-type1 font-bold uppercase btn w-full h-[40px]">Buy Now</button>
                </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </section>

      
    </main>
  );
}

export default Homepage;
