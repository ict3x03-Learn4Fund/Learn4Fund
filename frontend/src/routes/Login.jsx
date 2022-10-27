import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineGoogle } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getCartNumber, userLogin } from '../features/user/userActions'
import { useNav } from "../hooks/useNav";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {OTPModal} from "../modals/OTPModal"

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, userInfo, error, success , stateErrorMsg} = useSelector((state) => state.user)
  const { setTab } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false)
  const [check, setCheck] = useState(false)

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // redirect authenticated user to profile screen
  useEffect(() => {
    console.log(success)
    if (success){
      setModalOpen(true)
    }   
    if (error) {
      toast.error(stateErrorMsg)
    }
  }, [dispatch,success, error])


  const submitForm = (data) => {
    dispatch(userLogin(data))
    console.log(success)
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="flex flex-col items-center w-96 align-center p-2 bg-w2 rounded-lg border-2 border-black space-y-2">
          <span className="flex w-16 h-16 bg-b1 rounded-full items-center justify-center my-2">
            <IoPersonCircleOutline className="text-w1" size="100" />
          </span>
          <div className="flex flex-nowrap w-full justify-center">
            <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
              <div className="flex w-full h-full content-center justify-center">
                <MdAlternateEmail className="self-center text-w1" />
              </div>
            </span>
            <input
              className="flex w-3/4 h-[40px] input"
              autoComplete="off"
              type="text"
              maxLength={255}
              {...register("email", { required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
              placeholder="Email ID"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex flex-nowrap w-full justify-center">
            {errors.email && <div><p style={{ color: "red" }}><b>Please enter a valid Email address</b></p></div>}
            </div>
          <div className="flex flex-nowrap w-full justify-center">
            <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
              <div className="flex w-full h-full content-center justify-center">
                <BsShieldLockFill className="self-center text-w1" />
              </div>
            </span>
            <input
              className="flex w-3/4 h-[40px] input"
              autoComplete="off"
              type="password"
              {...register("password", { required: true})}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {/* <p id="errorMsg" name="errorMsg" value={errorMsg}></p> */}
          </div>
          <div className="flex flex-nowrap w-full justify-center">
            {errors.password && <div><p style={{ color: "red" }}><b>Password is empty!</b></p></div>}
            </div>
          <div className="flex flex-col w-full space-y-2">
            <button
              className="p-2 w-full rounded bg-b1 border-2 hover:bg-b2 text-w1 font-bold"
              type='submit' disabled={loading}>
              Login with Email
            </button>
            
          </div>

          <div className="flex flex-row flex-nowrap w-full my-1">
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center mr-4" />
            <p className="font-type2">OR</p>
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center ml-4" />
          </div>
          <Link
            to="/signup"
            className="cursor-pointer p-2 w-full rounded bg-g2 text-w1 font-bold hover:text-w1 hover:bg-orange-500 text-center"
          >
            Sign up
          </Link>
        </div>
      </form>
      </div>
      { modalOpen ? <OTPModal closeModal={setModalOpen}></OTPModal> : null}
    </main>
  );
}

export default Login;
