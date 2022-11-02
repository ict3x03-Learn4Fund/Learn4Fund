import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { BsShieldLockFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { MdAlternateEmail } from "react-icons/md";
import authService from "../services/accounts";
import {toast} from "react-toastify";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  const submitForm = (data) => {
    resetPassword();
  };

  useEffect(() => {
  });

  const resetPassword = () => {
    const request = {email: email, token: otp}
    authService.resetPass(request).then((response) => {
      if (response.status == 200){
        toast.success(response.data.message)
      }
    }).catch((error) => {
      toast.error(error.response.data.message) 
    })
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex flex-col items-center w-96 h-auto p-2 bg-w2 rounded-lg border-2 border-black">
            <span className="flex w-16 h-16 bg-b1 rounded-full items-center justify-center">
              <IoPersonCircleOutline className="text-w1" size="100" />
            </span>
            <h2 className="text-lg font-bold">Reset Password</h2>
            <div className="flex flex-nowrap w-full justify-center mt-4">
              <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                <div className="flex w-full h-full content-center justify-center">
                  <MdAlternateEmail className="self-center text-w1" />
                </div>
              </span>
              <input required 
                className="flex w-3/4 h-[40px] input"
                autoComplete="off"
                type="text"
                maxLength={255}
                {...register("email", {
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex flex-nowrap w-full justify-center">
              {errors.email && (
                <div>
                  <p style={{ color: "red" }}>
                    <b>Please enter a valid Email address</b>
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-nowrap w-full justify-center mt-4">
              <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                <div className="flex w-full h-full content-center justify-center">
                  <BsShieldLockFill className="self-center text-w1" />
                </div>
              </span>
              <input required
                className="flex w-3/4 h-[40px] input"
                maxLength={7} // Code is 7 digits
                type="password"
                {...register("code", { pattern: /^[0-9]*$/ })} // [Validation] Number only
                placeholder="Enter 2fa token"
                value={otp}
                onChange={handleOtp}
              />
              <p id="errorMsg" name="errorMsg" value={errorMsg}></p>
            </div>
            <div className="flex flex-nowrap w-full justify-center">
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
                disabled={loading}
              >
                Reset 
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ResetPassword;
