import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineGoogle } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNav } from "../hooks/useNav";

function Login() {
  const {auth, authed, authMsg, login, currentUser} = useAuth();
  const { setTab } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const handleLogin = async () => {
    login(email,password)
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <div className="flex flex-col items-center w-96 h-auto p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="flex w-16 h-16 bg-b1 rounded-full items-center justify-center">
            <IoPersonCircleOutline className="text-w1" size="100" />
          </span>
          <div className="flex flex-nowrap w-full justify-center mt-4">
            <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
              <div className="flex w-full h-full content-center justify-center">
                <MdAlternateEmail className="self-center text-w1" />
              </div>
            </span>
            <input
              className="flex w-3/4 h-[40px] input"
              type="text"
              placeholder="Email ID"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="flex flex-nowrap w-full justify-center mt-4">
            <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
              <div className="flex w-full h-full content-center justify-center">
                <BsShieldLockFill className="self-center text-w1" />
              </div>
            </span>
            <input
              className="flex w-3/4 h-[40px] input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <p id="errorMsg" name="errorMsg" value={errorMsg}></p>
          </div>
          <div className="flex flex-col w-full space-y-2 mt-6">
            <button
              className="p-2 w-full rounded bg-success text-w1 font-bold"
              onClick={handleLogin}
            >
              Login with Email
            </button>
            <button className="flex flex-wrap p-2 w-full rounded bg-[#FFCE44] text-w1 font-bold justify-center">
              <AiOutlineGoogle className="self-center" />
              Login with Google
            </button>
            <button className="flex flex-wrap p-2 w-full rounded text-w1 font-bold justify-center bg-[#4267B2]">
              <FaFacebookF className="self-center" />
              Login with Facebook
            </button>
          </div>

          <div className="flex flex-row flex-nowrap w-full my-1">
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center mr-4" />
            <p className="font-type2">OR</p>
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center ml-4" />
          </div>
          <Link
            to="/signup"
            className="cursor-pointer p-2 w-full rounded bg-g2 text-w1 font-bold text-center"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;
