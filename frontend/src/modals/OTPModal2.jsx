import React, { useState, useEffect, Fragment } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useLocation } from "react-router-dom";
import { BsShieldLockFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { getCartNumber, user2FA, getUserDetails } from "../features/user/userActions";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import authService from "../services/accounts";
import Cookies from 'js-cookie';

export const OTPModal2 = ({ closeModal, password }) => {
  const { loading, userInfo, userId, otpError, qrUrl, stateErrorMsg } = useSelector(
    (state) => state.user
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  const submitForm = (data) => {
    const payload = {userId: userId, token: otp}
    console.log(payload)
    dispatch(user2FA(payload));
    authService.verify2FA(payload).then((res) => {
      if (res.status == 200){
      } else {
        toast.error(res.data.message)
      }
    })
  };

  useEffect(() => {
    if (success){
      const jwt = Cookies.get("access_token")
      console.log(jwt, userId, password)
      // authService.changePass(userId, jwt, password).then((response) => {
      //   if (response.status == 200){
      //     toast.success(response.data.message)
      //   } else {
      //     toast.error(response.data.message)
      //   }
      // })
    }
  },[success, setSuccess])

  return (
    <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
      <div className="flex  justify-center items-center h-full w-full">
        <div className="flex-column w-1/3 h-auto bg-white rounded-lg shadow-lg m-[16px]">
          <div className="flex w-full rounded-lg h-1/5 px-[16px]">
            <div className="ml-2 mt-2 text-black text-center w-full self-center text-[24px]">
              2 Factor Authentication
            </div>

            <button
              className="text-[black] bg-transparent text-[24px]"
              onClick={() => closeModal(false)}
            >
              <AiOutlineCloseSquare />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="mx-5, my-5 flex justify-center"
          >
            <div className="flex flex-col items-center  rounded-lg">
              <div className="flex flex-nowrap w-full justify-center mt-4">
                <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                  <div className="flex w-full h-full content-center justify-center">
                    <BsShieldLockFill className="self-center text-w1" />
                  </div>
                </span>
                <input
                  className="flex w-3/4 h-[40px] input"
                  maxLength={7} // Code is 7 digits
                  type="password"
                  {...register("code", { required: true, pattern: /^[0-9]*$/ })} // [Validation] Number only
                  placeholder="Token"
                  value={otp}
                  onChange={handleOtp}
                />
                <p id="errorMsg" name="errorMsg" value={errorMsg}></p>
              </div>
              <h2>Enter token from your authentication app</h2>
              <div className="flex flex-nowrap w-full justify-center mt-4">
                {errors.code && (
                  <div>
                    <p style={{ color: "red" }}>
                      <b>Invalid format, numbers only</b>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full space-y-2 mt-6">
                <button
                  className="p-2 w-full rounded bg-success text-w1 font-bold"
                  type="submit"
                  disabled={loading} // [Validation] React Hook Form
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};