import React, { useEffect, useState } from "react";
import { BsCart } from "react-icons/bs";
import {
  RiAdminLine,
  RiLoginBoxFill,
  RiLogoutBoxRLine,
  RiUserSettingsFill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import picture from "../../assets/images/default_person.jpg";
import { BiDonateHeart } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, getCartNumber } from "../../features/user/userActions";
import { logout } from "../../features/user/userSlice";
import { useNav } from "../../hooks/useNav";
import cartsService from "../../services/carts";
import toast from "react-hot-toast";

function Nav() {
  const { tab, setTab } = useNav();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);
  const { userInfo, userId, cartNo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [adminStatus, setAdmin] = useState(false);

  useEffect(() => {
    if (userInfo) {
      console.log("testing 123")
      dispatch(getUserDetails());
      dispatch(getCartNumber())
    }
  }, []);

  useEffect(() => {
    if (userInfo != null && userInfo.role == "admin") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, userInfo);

  const handleLogout = () => {
    // logout();
    dispatch(logout());
    setTab("");
    navigate("/");
  };

  const selectedTab = (tab) => {
    setTab(tab);
    navigate("/" + tab);
  };

  useEffect(() => {
    console.log("cart no: ",cartNo )
  }, cartNo);
  return (
    <section
      id="Nav"
      className="sticky top-0 flex w-full bg-w2"
      style={{ zIndex: 99 }}
    >
      <div className="flex-row flex-wrap w-full px-[40px] text-black shadow-lg">
        <div className="flex flex-row flex-wrap w-full justify-between mb-2">
          {userInfo ? (
            <div className="flex w-full lg:w-1/2 justify-center lg:justify-start my-2">
              <img
                src={picture}
                alt={"user profile"}
                className="w-[32px] h-[32px] mr-[8px] bg-w1 self-center"
                style={{ borderRadius: "100%" }}
              />
              <span className="font-type2 text-[32px]">
                {userInfo?.firstName + " " + userInfo?.lastName}
              </span>
            </div>
          ) : (
            <div
              className="flex w-full lg:w-1/2 justify-center lg:justify-start font-type4 my-2 text-[32px]"
              onClick={() => {
                navigate("/");
              }}
            >
              Learn4Fund
            </div>
          )}

          <div className="flex w-full lg:w-1/2 justify-center lg:justify-end self-center">
            {adminStatus && (
              <div
                onClick={() => {
                  selectedTab("admin");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                  (tab === "admin" ? "underline" : "")
                }
              >
                <RiAdminLine className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Settings
                </span>
              </div>
            )}
            <div
              onClick={() => {
                selectedTab("");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                (tab === "" ? "underline" : "")
              }
            >
              <AiOutlineHome className="w-[18px] h-[18px] mr-[8px] self-center" />
              <span className=" h-[22px] font-normal leading-[22px] font-type1">
                Home
              </span>
            </div>
            <div
              onClick={() => {
                selectedTab("donate");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                (tab === "donate" ? "underline" : "")
              }
            >
              <BiDonateHeart className="w-[18px] h-[18px] mr-[8px] self-center" />
              <span className=" h-[22px] font-normal leading-[22px] font-type1">
                Donate
              </span>
            </div>
            {userInfo && (
              <div
                onClick={() => {
                  selectedTab("settings");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                  (tab === "settings" ? "underline" : "")
                }
              >
                <RiUserSettingsFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Profile
                </span>
              </div>
            )}
            <div
              onClick={() => {
                selectedTab("cart");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                (tab === "cart" ? "underline" : "")
              }
            >
              <BsCart className="w-[18px] h-[18px] mr-[8px] self-center" />
              <span className=" h-[22px] font-normal leading-[22px] font-type1">
                Cart
              </span>
              <span className="flex mx-1 w-[16px] h-[16px] rounded-full bg-b1 text-w1 self-center text-[12px] text-center justify-center">
                {cartNo}
              </span>
            </div>

            {userInfo ? (
              <div
                onClick={handleLogout}
                className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px]"
              >
                <RiLogoutBoxRLine className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Logout
                </span>
              </div>
            ) : (
              <div
                onClick={() => {
                  selectedTab("login");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-[22px] ml-[32px] " +
                  (tab === "login" ? "underline" : "")
                }
              >
                <RiLoginBoxFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Login
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Nav;
