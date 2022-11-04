import React, { useState, useEffect, Fragment } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsShieldLockFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import {
  userLogin,
  getUserDetails,
  getCartNumber,
  user2FA,
} from "../features/user/userActions";
import { clearSignupState, logout } from "../features/user/userSlice";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

export const OTPModal = ({ closeModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      // Anything in here is fired on component unmount.
      document.body.style.overflow = "unset";
    };
  }, []);
  const { loading, otpError, otpSuccess, qrUrl, stateErrorMsg } = useSelector(
    (state) => state.user
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  function handleCloseModal(){
    dispatch(clearSignupState());
    closeModal(false);
  }

  const submitForm = async () => {
    if (qrUrl) {
      await dispatch(user2FA({ token: otp }))
        .then((res) => {
          navigate("/");
          toast.success("OTP Verified!");
        })
        .catch((e) => {
          toast.error("Wrong Code!");
          console.log(e);
          return;
        });
    } else {
      dispatch(user2FA({ token: otp }));
    }
  };

  useEffect(() => {
    if (!qrUrl) {
      if (otpSuccess) {
        toast.success('Logged in')
        dispatch(getUserDetails(localStorage.getItem("userId")));
        dispatch(getCartNumber());
        navigate("/");
      }
      if (otpError) {
        dispatch(logout());
        closeModal(false)
        toast.error(stateErrorMsg);
      }
    }
  }, [dispatch, otpError, otpSuccess, stateErrorMsg, qrUrl]);

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
              onClick={() => {handleCloseModal()}}
            >
              <AiOutlineCloseSquare />
            </button>
          </div>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="mx-5, my-5 flex justify-center"
          >
            <div className="flex flex-col items-center  rounded-lg">
              {qrUrl ? (
                <Fragment className="flex items-center">
                  <QRCode className="" value={qrUrl} size={256}></QRCode>
                  <h2>
                    Scan this QR code on your preferred authentication
                    application.
                  </h2>
                </Fragment>
              ) : null}

              <div className="flex flex-nowrap w-full justify-center mt-4">
                <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                  <div className="flex w-full h-full content-center justify-center">
                    <BsShieldLockFill className="self-center text-w1" />
                  </div>
                </span>
                <input
                  className="flex w-3/4 h-[40px] input"
                  maxLength={6} // Code is 7 digits
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
