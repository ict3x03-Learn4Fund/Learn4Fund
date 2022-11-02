import React, { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useNav } from "../hooks/useNav";
import { BsShieldLockFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { user2FA } from "../features/user/userActions";
import {toast} from "react-toastify";
import authService from "../services/accounts";

function ChangePass() {
  const { setTab } = useNav();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const { loading } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { userId, jwt } = useParams();
  const [accountForm, setAccountForm] = useState({
    password: "",
    password2: "",
  });
  const { password, password2 } = accountForm;

  const [fufillPassword, setFufillPassword] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    verifyReset();
  }, []);

  const verifyReset = () => {
    authService
      .verifyReset(userId, jwt)
      .then((response) => {})
      .catch((error) => {
        toast.error(error.response.data.message);
        navigate("/login");
      });
  };

  const submitForm = (data) => {
    if (data.password != data.password2) {
      toast.error("Passwords do not match");
      return;
    }
    changePassword()
  };

  const changePassword = () => {
    authService.changePass(userId, jwt, password).then((response) => {
      console.log(response)
      if (response.status == 200){
        toast.success(response.data.message)
        navigate("/login")
      } 
      else { toast.error(response.data.message) }
    }).catch((error) => {
      toast.error(error.response.data.message)
    })
  }

  const onChange = (e) => {
    setAccountForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };



  

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="flex flex-col items-center w-96 h-auto p-2 bg-w2 rounded-lg border-2 border-black">
            <span className="flex w-16 h-16 bg-b1 rounded-full items-center justify-center">
              <IoPersonCircleOutline className="text-w1" size="100" />
            </span>
            <h2 className="text-lg font-bold">Change Password</h2>
            <div className="flex flex-nowrap w-full justify-center mt-4">
              <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                <div className="flex w-full h-full content-center justify-center">
                  <BsShieldLockFill className="self-center text-w1" />
                </div>
              </span>
              <input
                className="flex w-3/4 h-[40px] input"
                type="password"
                {...register("password", {
                  required: true,
                  pattern: /.{12,}/,
                })}
                placeholder="Enter your password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
            {errors.password && (
              <div>
                <p style={{ color: "red" }}>
                  <b>Password too short</b>
                </p>
              </div>
            )}
            <div className="flex flex-nowrap w-full justify-center mt-4">
              <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                <div className="flex w-full h-full content-center justify-center">
                  <BsShieldLockFill className="self-center text-w1" />
                </div>
              </span>
              <input
                className="flex w-3/4 h-[40px] input"
                type="password"
                {...register("password2", {
                  required: true,
                  validate: (val) => {
                    if (watch("password") != val) {
                      return "Passwords do not match";
                    }
                  },
                })}
                placeholder="Confirm your password"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
              />

            </div>
            <div className="flex flex-nowrap flex-col items-center	 w-full justify-center">
              {errors.password2 && (
                <div>
                  <p style={{ color: "red" }}>
                    <b>Passwords do not match</b>
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
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ChangePass;
