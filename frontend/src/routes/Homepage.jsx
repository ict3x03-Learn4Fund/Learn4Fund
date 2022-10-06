import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

// Mock datasets to render
import crse from "../assets/datasets/courses.json";
import courseService from "../services/courses";

// temporary image
import courseImg from "../assets/images/download.jpeg";
import images from "../services/images";

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
import { useEffect } from "react";

function Homepage({ setNewsModal }) {
  const navigate = useNavigate();
  const [dataCourses, setDataCourses] = useState([]);
  // const dataCourses = courseService.getAll();

  function sortByDiscount(a, b) {
    if (
      a.courseOriginalPrice - a.courseDiscountedPrice >
      b.courseOriginalPrice - b.courseDiscountedPrice
    ) {
      return -1;
    }
    if (
      a.courseOriginalPrice - a.courseDiscountedPrice <
      b.courseOriginalPrice - b.courseDiscountedPrice
    ) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    console.log('test')
    retrieveCourses();
  },[]);

  // retrieve all courses
  const retrieveCourses = () => {
    courseService
      .getAll()
      .then((response) => {
        console.log(response.data);
        setDataCourses(response.data);
        console.log("Course1: ", response.data[0]._id);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          <SwiperSlide>
            <img
              src={Banner1}
              className="w-full h-full object-fill"
              alt="top donations"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Banner2}
              className="w-full h-full object-fill"
              alt="promotions"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Banner3}
              className="w-full h-full object-fill"
              alt="contact us"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <Subscribe setNewsModal={setNewsModal} />

      <section className="w-full px-[120px]">
        <div className="font-type1 font-bold text-[2rem] tracking-[0.3px] text-w1">
          Best Selling Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[1rem] font-type1 font-normal">
            Browse the list of courses that are about to be sold out!
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("courses", { state: { filter: 1 } })}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {dataCourses
            .sort((a, b) => (a.quantity > b.quantity ? 1 : -1))
            .slice(0, 4)
            .map((course, index) => {
              return (
                <div
                  key={index}
                  className="cursor-pointer flex flex-col flex-wrap w-1/4 bg-w1 border-[1px] border-w1 p-2 rounded"
                  onClick={() => navigate("courses/" + course._id)}
                >
                  <img
                    // src={`/api/image/${images.getImg(course.courseImg)}`}
                    src={`http://localhost:5000/v1/api/images/getImg/${course.courseImg}`}
                    className="flex h-[120px] w-full object-stretch"
                    alt={"exmaple"}
                  />
                  <div className="flex-row flex-wrap w-full space-y-2">
                    <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                      {course.courseName} (
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
              );
            })}
        </div>
      </section>

      <section className="w-full px-[120px]">
        <div className="font-type1 font-bold text-[2rem] tracking-[0.3px] text-w1">
          Most Discounted Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[1rem] font-type1 font-normal">
            Browse the list of courses with the best value!
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("courses", { state: { filter: 2 } })}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {dataCourses
            .sort(sortByDiscount)
            .slice(0, 4)
            .map((course, index) => {
              return (
                <div
                  key={index}
                  className="cursor-pointer flex flex-col flex-wrap w-1/4 bg-w1 border-[1px] border-w1 p-2 rounded"
                  onClick={() => navigate("courses/" + course.courseID)}
                >
                  <img
                    src={courseImg}
                    className="flex h-[120px] w-full object-stretch"
                    alt={""}
                  />
                  <div className="flex-row flex-wrap w-full space-y-2">
                    <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                      {course.courseName} (
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
              );
            })}
        </div>
      </section>

      <section className="w-full px-[120px]">
        <div className="font-type1 font-bold text-[2rem] tracking-[0.3px] text-w1">
          Explore Other Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[1rem] font-type1 font-normal">
            All courses are handpicked by our team!
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("courses", { state: { filter: 0 } })}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {dataCourses
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((course, index) => {
              return (
                <div
                  key={index}
                  className="cursor-pointer flex flex-col flex-wrap w-1/4 bg-w1 border-[1px] border-w1 p-2 rounded"
                  onClick={() => navigate("courses/" + course.courseID)}
                >
                  <img
                    src={courseImg}
                    className="flex h-[120px] w-full object-stretch"
                    alt={""}
                  />
                  <div className="flex-row flex-wrap w-full space-y-2">
                    <div className="flex w-full h-[24px] justify-center pt-[8px] text-[1vw] leading-[20px] font-bold font-type1 text-[#242528]">
                      {course.courseName} (
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
              );
            })}
        </div>
      </section>
    </main>
  );
}

export default Homepage;
