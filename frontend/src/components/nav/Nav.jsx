import React, { useEffect, useState } from "react";
import { AiOutlinePhone } from "react-icons/ai";
import SGflag from "../../assets/vectors/singaporeflag.png";
import { BsSearch } from "react-icons/bs";
import { BsCart } from "react-icons/bs";
import { RiAdminLine, RiLogoutBoxRLine, RiUserSettingsFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { HiCurrencyDollar } from "react-icons/hi";
import picture from "../../assets/images/default_person.jpg";
import { BiDonateHeart } from "react-icons/bi";

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
      <div className="flex flex-row flex-wrap w-full bg-b2 px-[120px] pt-[24px] text-w1 shadow-lg">
        <div className="flex flex-row flex-wrap w-full justify-between">
          <div className="flex">
            <div className="flex flex-row flex-wrap w-[91px] h-[22px]">
              <img
                src={SGflag}
                className="w-[20px] h-[14px] top-[4px] mr-[8px] self-center"
                alt={""}
              />
              <p className="flex w-[63px] h-[22px] left-[28px] text-[14px] font-normal leading-[22px] font-roboto">
                Singapore
              </p>
            </div>
            <div className="flex flex-row flex-wrap w-[120px] h-[22px] ml-[32px]">
              <AiOutlinePhone className="w-[18px] h-[18px] mr-[8px] self-center" />
              <p className="w-[94px] h-[22px] text-[14px] font-normal leading-[22px] font-roboto">
                +65 9797 9797
              </p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap w-auto h-[22px] ml-[32px] self-end">
            <p className="flex h-[22px] left-[28px] text-[14px] font-normal leading-[22px] font-roboto">
              Currency
            </p>
            <HiCurrencyDollar className="w-[18px] h-[18px] mx-[8px] self-center" />

            <p className="flex h-[22px] left-[28px] text-[14px] font-bold leading-[22px] font-roboto">
              SGD
            </p>
          </div>
        </div>

        <div className="flex flex-row flex-wrap w-full justify-between mb-2">
          <div className="flex w-1/2 font-type4 mt-2 text-[32px]" onClick={() => {
              navigate("/");
            }}>
            Learn4Fund
          </div>
          <div className="flex w-1/2 h-full items-center justify-end">
            <BsSearch className="self-center" />
            <input
              className="flex w-1/3 h-1/2 bg-b1 text-w2 p-2 ml-2 rounded text-center"
              placeholder="Search for courses"
            />
          </div>
        </div>

        <div className="flex flex-col w-full items-center my-2">
          <div className="flex flex-row flex-wrap w-full justify-between mb-2">
            <div className="flex w-1/2">
              <img
                src={picture}
                alt={"user profile"}
                className="w-[32px] h-[32px] mr-[8px] bg-w1 self-center"
                style={{ borderRadius: "100%" }}
              />
              <span className="font-type2 text-[24px]">Hi, John Doe</span>
            </div>
            <div className="flex w-1/2 justify-end">
            <Link to="/admin" className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px]">
                <RiAdminLine className="w-[18px] h-[18px] mr-[8px] self-center text-w1" />
                < span className=" h-[22px] font-normal leading-[22px] font-type1" >
                  Settings
                </span>
                
              </Link>
            <Link to="/donate" className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px]">
                <BiDonateHeart className="w-[18px] h-[18px] mr-[8px] self-center" />
                < span className=" h-[22px] font-normal leading-[22px] font-type1" >
                  Donate
                </span>
                
              </Link>
              <Link to="/settings" className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px]">
                <RiUserSettingsFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                < span className=" h-[22px] font-normal leading-[22px] font-type1" >
                  Profile
                </span>
                
              </Link>
              <div className="flex flex-row flex-wrap h-[22px] ml-[32px]">
              <div className="relative">
              
            </div>
                <BsCart className="w-[18px] h-[18px] mr-[8px] self-center" />
                <p className="h-[22px] text-[14px] font-normal leading-[22px] font-roboto">
                  Cart 
                </p>
                <span className="flex mx-1 w-[16px] h-[16px] rounded-full bg-b3 text-[12px] text-center justify-center">{sessionItems}</span>
              </div>

              <div className="flex flex-row flex-wrap  h-[22px] ml-[32px]">
                <RiLogoutBoxRLine className="w-[18px] h-[18px] mr-[8px]  self-center" />
                <p className=" h-[22px] text-[14px] font-normal leading-[22px] font-roboto">
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </section>
  );
}

export default Nav;
