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
import { toast } from "react-toastify";
import { useRef } from "react";

function Nav() {
  const { tab, setTab } = useNav();
  const navigate = useNavigate();
  const { userInfo, cartNo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState();

  // get user info
  useEffect(() => {
    if (userInfo) {
      dispatch(getCartNumber(localStorage.getItem('userId')));
    }
    dispatch(getUserDetails())
    setInterval(() => {
      //checks user every 1 mins
      dispatch(getUserDetails())
    }, 60000);
  }, [])

  useEffect(() => {
    if (userInfo) {
      setAvatar(userInfo.avatarImg)
      dispatch(getCartNumber(localStorage.getItem('userId')));
    }
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    setTab("");
    navigate("/");
  };

  return (
    <section
      id="Nav"
      className="sticky top-0 flex w-full bg-w2"
      style={{ zIndex: 99 }}
    >
      <div className="flex-row flex-wrap w-full px-[40px] text-black shadow-lg">
        <div className="flex flex-row flex-wrap w-full justify-between">
          {userInfo ? (
            <div className="flex w-full lg:w-1/2 justify-center lg:justify-start my-2">
              <img
                src={
                  avatar
                    ? `https://learn4fund.tk/v1/api/images/getImg/${userInfo?.avatarImg}`
                    : picture
                }
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
              Learn4Fund {modalOpen}
            </div>
          )}

          <div className="flex w-full lg:w-1/2 justify-center lg:justify-end self-center">
            {userInfo && userInfo.role == "admin" && (
              <div
                onClick={() => {
                  navigate("/admin");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                  (tab === "admin" ? "border-b-4 border-b2" : "")
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
                navigate("/");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                (tab === "" ? "border-b-4 border-b2" : "")
              }
            >
              <AiOutlineHome className="w-[18px] h-[18px] mr-[8px] self-center" />
              <span className=" h-[22px] font-normal leading-[22px] font-type1">
                Home
              </span>
            </div>
            <div
              onClick={() => {
                navigate("/donate");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                (tab === "donate" ? "border-b-4 border-b2" : "")
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
                  navigate("/settings");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                  (tab === "settings" ? "border-b-4 border-b2" : "")
                }
              >
                <RiUserSettingsFill className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Profile
                </span>
              </div>
            )}
            {userInfo && <div
              onClick={() => {
                navigate("/cart");
              }}
              className={
                "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                  (tab === "cart" ? "border-b-4 border-b2" : "")
              }
            >
              <BsCart className="flex w-8 h-[18px] mr-[8px] self-center" />
              <span className="flex h-[22px] font-normal leading-[22px] font-type1">
                Cart
              </span>
              <span className="absolute ml-6 mb-4 w-4 h-4 rounded-full bg-b1 text-w1 self-center text-[12px] text-center justify-center">
                {cartNo}
              </span>
            </div>}

            {userInfo ? (
              <div
                onClick={handleLogout}
                className="cursor-pointer flex flex-row flex-wrap h-[22px] ml-8"
              >
                <RiLogoutBoxRLine className="w-[18px] h-[18px] mr-[8px] self-center" />
                <span className=" h-[22px] font-normal leading-[22px] font-type1">
                  Logout
                </span>
              </div>
            ) : (
              <div
                onClick={() => {
                  navigate("/login");
                }}
                className={
                  "cursor-pointer flex flex-row flex-wrap h-fit ml-8 " +
                  (tab === "login" ? "border-b-4 border-b2" : "")
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
