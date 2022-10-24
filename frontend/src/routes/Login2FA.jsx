import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useNav } from "../hooks/useNav";
import { BsShieldLockFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { user2FA } from '../features/user/userActions'

function Login2FA() {
  
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { setTab } = useNav();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState("");
  const { loading } = useSelector((state) => state.user)

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  const submitForm = (data) => {
    dispatch(user2FA(data))
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="flex flex-col items-center w-96 h-auto p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="flex w-16 h-16 bg-b1 rounded-full items-center justify-center">
            <IoPersonCircleOutline className="text-w1" size="100" />
          </span>
          <h2>Verify your Token with the Authy App</h2>
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
              {...register("code", { required: true, pattern: /^[0-9]*$/})}     // [Validation] Number only
              placeholder="Token"
              value={otp}
              onChange={handleOtp}
            />
            <p id="errorMsg" name="errorMsg" value={errorMsg}></p>
          </div> 
          <div className="flex flex-nowrap w-full justify-center mt-4">         
            {errors.code && <div><p style={{ color: "red" }}><b>Invalid format, numbers only</b></p></div>} 
            </div>
          <div className="flex flex-col w-full space-y-2 mt-6">
            <button
              className="p-2 w-full rounded bg-success text-w1 font-bold"
              type='submit' disabled={loading}                            // [Validation] React Hook Form
            >
              Login
            </button>
          </div>
        </div>
        </form>
      </div>
    </main>
  );
}

export default Login2FA;
