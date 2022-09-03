import React, { useEffect, useState } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import SGflag from "../../assets/vectors/singaporeflag.png";
import Eezeelogo from "../../assets/vectors/eezeelogo.png";
import Carticon from "../../assets/vectors/carticon.png";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  let navigate = useNavigate();
  const [sessionItems, setSessionItems] = useState(0);

  // Use session storage to save cart items temporarily, acts like a Vuex store
  useEffect(() => {
    let cartItems = sessionStorage.getItem("cartItems");
    if (cartItems) {
      setSessionItems(cartItems);
    } else {
      setSessionItems(0);
    }
  }, []);
  return (
    <section id="Nav">
      <div className="flex w-full h-[38px] bg-[#EFEFF0] items-center">
        <div className="flex-none order-none grow-0">
          <div className="flex flex-row flex-wrap ml-[120px] w-[91px] h-[22px]">
            <img
              src={SGflag}
              className="w-[20px] h-[14px] top-[4px] mr-[8px] self-center"
              alt={""}
            />
            <p className="flex w-[63px] h-[22px] left-[28px] text-[14px] font-normal leading-[22px] text-[#55585D] font-roboto">
              Singapore
            </p>
          </div>
        </div>
        <div className="flex-none order-1 grow-0">
          <div className="flex flex-row flex-wrap w-[120px] h-[22px] ml-[32px]">
            <AiOutlinePhone className="w-[18px] h-[18px] mr-[8px] text-[#55585D] self-center" />
            <p className="w-[94px] h-[22px] text-[14px] font-normal leading-[22px] text-[#55585D] font-roboto">
              +65 6797 9688
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full h-[119px] border-b-[1px] border-[#D7D8DB] bg-[#FFFFFF]">
        <div className="flex flex-row w-full h-[80px] justify-between items-center mx-[120px]">
          <img
            src={Eezeelogo}
            className="w-[150px] h-[44px]"
            alt={""}
            onClick={() => {
              navigate("/");
            }}
          />
          <div className="flex flex-col w-[40px] h-[60px] self-start items-center justify-center">
            <div className="relative h-[40px] w-[40px] mt-[14px]">
              <span className="absolute top-0 right-[-8px] w-[20px] h-[20px] rounded-[22px] bg-[#2A64DB] font-normal text-[12px] leading-[20px] text-[#FFFFFF] text-center top-[6px] font-roboto">
                {sessionItems}
              </span>
            </div>
            <img
              src={Carticon}
              className="w-[40px] h-[40px] mt-[14px]"
              alt={""}
            />

            <div className="w-[24px] h-[20px] text-[12px] leading-[20px] text-center text-[#55585D] font-bold font-roboto">
              Cart
            </div>
          </div>
        </div>
        <div className="flex w-full h-[38px] mx-[120px] items-center">
          <Link
            to="/brands"
            className="cursor-pointer w-[97px] h-[22px] font-normal text-[14px] leading-[22px] text-[#2A64DB] font-roboto"
          >
            View All Brands
          </Link>
        </div>        
        <div className="flex w-full h-[38px] mx-[120px] items-center">
          <Link
            to="/courses"
            className="cursor-pointer w-[97px] h-[22px] font-normal text-[14px] leading-[22px] text-[#2A64DB] font-roboto"
          >
            View Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Nav;
