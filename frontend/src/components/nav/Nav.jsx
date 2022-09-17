import React, { useEffect, useState } from "react";
import { BsCart } from "react-icons/bs";
import {
  RiAdminLine,
  RiLoginBoxFill,
  RiLogoutBoxRLine,
  RiUserSettingsFill,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import picture from "../../assets/images/default_person.jpg";
import { BiDonateHeart } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import {useAuth} from "../../hooks/useAuth";

function Nav() {
  const { authed, logout } = useAuth();
  const navigate = useNavigate();
  const [sessionItems, setSessionItems] = useState(0);
  const [tab, setTab] = useState('');

  const handleLogout = () => {
    logout();
    setTab('');
    navigate("/");
  };

  const selectedTab = (tab) => {
    setTab(tab);
    navigate('/'+tab);
  }

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
    <section id="Nav" className="sticky top-0 flex w-full z-100 bg-w2">
      <div className="flex-row flex-wrap w-full px-[40px] text-black shadow-lg">
        <div className="flex flex-row flex-wrap w-full justify-between mb-2">
        {authed === true ? <div className="flex w-full lg:w-1/2 justify-center lg:justify-start my-2">
              <img
                src={picture}
                alt={"user profile"}
                className="w-[32px] h-[32px] mr-[8px] bg-w1 self-center"
                style={{ borderRadius: "100%" }}
              />
              <span className="font-type2 text-[24px]">Hi, John Doe</span>
            </div>: <div
            className="flex w-full lg:w-1/2 justify-center lg:justify-start font-type4 my-2 text-[32px]"
            onClick={() => {
              navigate("/");
            }}
          >
            Learn4Fund
          </div>}
          
          
          
          <div className="flex w-full lg:w-1/2 justify-center lg:justify-end self-center">
          {authed && <div
                onClick={()=>{selectedTab('admin')}}
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === 'admin' ? "underline" : "")}
              >
                <RiAdminLine className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Settings
                </span>
              </div>}
              <div onClick={()=>{selectedTab('')}}
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === '' ? "underline" : "")}

              >
                <AiOutlineHome className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1" >
                  Home
                </span>
              </div>
              <div onClick={()=>{selectedTab('donate')}}
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === 'donate' ? "underline" : "")}

              >
                <BiDonateHeart className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Donate
                </span>
              </div>
              {authed && <div onClick={()=>{selectedTab('settings')}}
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === 'settings' ? "underline" : "")}
              >
                <RiUserSettingsFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Profile
                </span>
              </div>}
              <div onClick={()=>{selectedTab('cart')}} 
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === 'cart' ? "underline" : "")}
                >
                <BsCart className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Cart
                </span>
                <span className="flex mx-1 w-[16px] h-[16px] rounded-full bg-b1 text-w1 self-center text-[12px] text-center justify-center">
                  {sessionItems}
                </span>
              </div>

              {authed == true ? <div
                onClick={handleLogout}
                className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px]"
              >
                <RiLogoutBoxRLine className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Logout
                </span>
              </div> : 
                
              <div
              onClick={()=>{selectedTab('login')}}
                className={"cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " + (tab === 'login' ? "underline" : "")}

              >
                <RiLoginBoxFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Login
                </span>
              </div>}
              
          </div>
        </div>

        
      </div>
    </section>
  );
}

export default Nav;
