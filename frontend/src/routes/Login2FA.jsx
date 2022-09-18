import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNav } from "../hooks/useNav";
import { BsShieldLockFill } from "react-icons/bs";

function Login2FA() {
  const { auth, authed, authMsg, verify2FA, currentUser } = useAuth();
  const { setTab } = useNav();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  const handleLogin2FA = () => {
    if (currentUser) verify2FA(otp);
    else setErrorMsg(authMsg);
  };

  useEffect(() => {
    if (authed) navigate("/");
    else setErrorMsg(authMsg);
  });

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
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
              type="password"
              placeholder="Token"
              value={otp}
              onChange={handleOtp}
            />
            <p id="errorMsg" name="errorMsg" value={errorMsg}></p>
          </div>
          <div className="flex flex-col w-full space-y-2 mt-6">
            <button
              className="p-2 w-full rounded bg-success text-w1 font-bold"
              onClick={handleLogin2FA}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login2FA;
