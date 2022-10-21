import React, { useEffect, useState } from "react";
import { BsDash, BsPlus } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import courseService from "../../services/courses";
import { useAuth } from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

function CourseInfo() {
  // useEffect(() => {
  // }, [])
  const parse = require("html-react-parser");
  const [quantitySelected, setQuantitySelected] = useState(0);
  const [stars, setStars] = useState(0);
  const { courseID } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const { authed } = useAuth();

  // retrieve all courses
  const retrieveCourses = () => {
    courseService
      .getAll()
      .then((response) => {
        console.log(response.data);
        setCourses(response.data);
        const course = response.data.find((course) => course._id.toString() === courseID);
        setCourseDetails(course)
        console.log("courses:", courses)
        console.log("course details:", courseDetails)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    retrieveCourses();
  }, [courseID]);

  // Add quantity to const variable
  function handleChange(event) {
    setQuantitySelected(event.target.value);
  }

  // Check if there is any cart items in session storage
  useEffect(() => {
    let sessionItems = sessionStorage.getItem("cartItems");
    if (sessionItems > 0) {
      setQuantitySelected(sessionItems);
    } else {
      setQuantitySelected(0);
    }
  }, []);

  // save quantity to cart
  function addToCart() {
    if (quantitySelected > courseDetails.quantity) {
      alert("amount exceeded");
      return;
    }
    console.log("save to cart");
    sessionStorage.setItem("cartItems", quantitySelected);
    navigate(0);
  }

  // store stars
  function highlightStars(number) {
    setStars(number);
  }

  return (
    <main className="flex w-full h-full px-[40px] lg:px-[120px] pb-[24px] bg-b1 items-center">
      <div className="flex flex-row flex-wrap w-2/3 h-auto mt-[24px] p-[16px] bg-white rounded self-start">
        <div className="flex flex-col w-full">
          <span className="font-type1 font-medium text-[2vw] text-b3 leading-[32px]">
            {courseDetails.courseName}
          </span>
          <div className="flex flex-row flex-nowrap w-full m-[2px]">
            <div className="flex flex-row w-full flex-nowrap">
              <div className="flex w-1/2">
                <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                  Course ID: &nbsp;
                </span>
                <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                  {courseDetails._id}
                </span>{" "}
              </div>

              <div className="flex w-1/2">
                <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                  Company: &nbsp;
                </span>
                <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                  {courseDetails.companyName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-nowrap w-full m-[2px]">
            <div className="flex flex-row w-1/2 flex-nowrap">
              <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                Type: &nbsp;
              </span>
              <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                {courseDetails.courseType &&
                  courseDetails.courseType.toString()}
              </span>
            </div>
            <div className="flex w-1/2">
              <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                Tutor: &nbsp;
              </span>
              <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                {courseDetails.courseTutor}
              </span>
            </div>
          </div>
          <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2" />
        </div>
        <div className="flex flex-col w-full h-[244px] my-[16px]">
          <div className="flex w-full h-full justify-center">
            <img
              src={`http://localhost:5000/v1/api/images/getImg/${courseDetails.courseImg}`}
              alt={""}
            />
          </div>
        </div>
        <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2" />

        <div className="flex flex-col flex-wrap w-full h-auto align-start self-start content-start justify-start text-start">
          <span className="font-type1 font-bold text-[20px] leading-[28px] tracking-[0.3px] text-b3">
            Course Description
          </span>

          <div>
            <span className="font-type1 font-normal text-[14px] leading-[22px]">
              {courseDetails.courseDescription}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-1/3 h-auto space-y-8 self-start">
        <div className="flexcontent-start w-full h-fit bg-white mt-[24px] py-[16px] mx-[16px] px-[24px] border-[1px] border-[#E4E5E7] rounded self-start">
          <div className="flex justify-between">
            <div className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
              U.P Price:{" "}
              <span className="line-through">
                ${courseDetails.courseOriginalPrice}
              </span>
            </div>
            <div className="font-type1 font-bold text-[1vw] text-success leading-[22px] self-center">
              Current Price: ${courseDetails.courseDiscountedPrice}
            </div>
          </div>
          <div className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
            Available: {courseDetails.quantityAvailable}
          </div>

          <div className="flex flex-nowrap w-full justify-between">
            <div className="flex font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
              Selected Quantity:
            </div>
            <div className="flex">
              <div
                className="cursor-pointer flex w-[31px] h-full border-[1px] justify-center"
                onClick={() =>
                  quantitySelected > 0
                    ? setQuantitySelected(parseInt(quantitySelected) - 1)
                    : null
                }
              >
                <BsDash className="text-b3 self-center" />
              </div>
              <div className="flex h-full border-[1px] w-[50px] justify-center text-center">
                <input
                  className="font-type1 font-normal text-[1.5vw] leading-[20px] w-full text-center self-center"
                  type="number"
                  value={quantitySelected}
                  onChange={handleChange}
                />
              </div>
              <div
                className="cursor-pointer flex w-[31px] h-full border-[1px] justify-center"
                onClick={() =>
                  setQuantitySelected(parseInt(quantitySelected) + 1)
                }
              >
                <BsPlus className="text-b3 self-center" />
              </div>
            </div>
          </div>
          <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2" />

          <div className="flex justify-between">
            <div className="font-type1 font-bold text-[1vw] leading-[22px] self-center">
              Total Cost ($):
            </div>
            <div className="font-type1 font-bold text-[1vw] leading-[22px] self-center my-2">
              {courseDetails.courseDiscountedPrice * quantitySelected}
            </div>
          </div>
          <button
            className="flex w-full h-[40px] rounded-sm bg-b3 justify-center items-center"
            onClick={() => addToCart()}
          >
            <span className="font-type1 font-normal text-[14px] leading-[22px] text-white">
              Add to Cart
            </span>
          </button>
        </div>

        <div className="flex flex-row flex-wrap w-full h-auto bg-white rounded mt-[24px] mx-[16px] p-[24px]">
          <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
            <span className="font-type1 text-[1.4vw] text-b3 font-bold">
              Customer Reviews - 4.5/5{" "}
            </span>
            <AiFillStar className="text-yellow-500 self-center" size={24} />
          </div>

          <div className="flex flex-wrap h-[300px] overflow-y-scroll">
            <div className="flex-row flex-wrap w-full my-2 text-[1vw]">
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  John [3 <AiFillStar className="self-center text-yellow-500" />
                  ]
                </div>
                <div>14/9</div>
              </div>
              <p>"I love this course"</p>
            </div>
            <div className="flex-row flex-wrap w-full my-2 text-[1vw]">
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  Samantha [4{" "}
                  <AiFillStar className="self-center text-yellow-500" />]
                </div>
                <div>14/9</div>
              </div>
              <p>
                "Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum."
              </p>
            </div>
          </div>
          {authed && (
            <div className="flex flex-row flex-wrap w-full h-auto my-4">
              <span className="font-type1 text-[20px] font-semibold">
                My review
              </span>
              <div className="flex flex-nowrap ml-4">
                <AiOutlineStar
                  className="self-center"
                  style={stars >= 1 ? { color: "gold" } : { color: "black" }}
                  onClick={() => {
                    highlightStars(1);
                  }}
                />
                <AiOutlineStar
                  className="self-center"
                  style={stars >= 2 ? { color: "gold" } : { color: "black" }}
                  onClick={() => {
                    highlightStars(2);
                  }}
                />
                <AiOutlineStar
                  className="self-center"
                  style={stars >= 3 ? { color: "gold" } : { color: "black" }}
                  onClick={() => {
                    highlightStars(3);
                  }}
                />
                <AiOutlineStar
                  className="self-center"
                  style={stars >= 4 ? { color: "gold" } : { color: "black" }}
                  onClick={() => {
                    highlightStars(4);
                  }}
                />
                <AiOutlineStar
                  className="self-center"
                  style={stars >= 5 ? { color: "gold" } : { color: "black" }}
                  onClick={() => {
                    highlightStars(5);
                  }}
                />
              </div>
              <textarea className="flex w-full h-[80px] border-2 border-b2 rounded text-start my-2" />
              <button className="bg-g2 text-w1 p-2 rounded">
                Submit review
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CourseInfo;
