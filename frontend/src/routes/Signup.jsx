import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userActions";
import { clearSignupState } from "../features/user/userSlice";
import { logout } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { OTPModal } from "../modals/OTPModal";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const Signup = () => {
  const [reCaptchaKey] = useState(
    process.env.REACT_APP_RECAPTCHA_SITE_KEY
  );
  const { error, success, stateErrorMsg } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //for captcha
  const captchaRef = useRef(null);

  useEffect(() => {
    if (success) {
      setModalOpen(true);
    }
    if (error) {
      toast.error(stateErrorMsg);
    }
  }, [dispatch, success, error]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(logout());
    dispatch(clearSignupState());
  }, []);

  const [agreementCheckbox, setAgreementCheckbox] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    emailSubscription: false,
  });
  const [fufillPassword, setFufillPassword] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const { email, password, password2, firstName, lastName, emailSubscription } =
    accountForm;

  const onChange = (e) => {
    setAccountForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /***
   * Password validation
   */
  const checkPassword = (e) => {
    if (e.target.value.length >= 12) {
      setFufillPassword((prevState) => [
        true,
        prevState[1],
        prevState[2],
        prevState[3],
      ]);
    } else {
      setFufillPassword((prevState) => [
        false,
        prevState[1],
        prevState[2],
        prevState[3],
      ]);
    }

    if (/(?=.*[A-Z])(?=.*[a-z])/.test(e.target.value)) {
      setFufillPassword((prevState) => [
        prevState[0],
        true,
        prevState[2],
        prevState[3],
      ]);
    } else {
      setFufillPassword((prevState) => [
        prevState[0],
        false,
        prevState[2],
        prevState[3],
      ]);
    }

    if (/(?=.*\d)(?=.*[A-Z])/.test(e.target.value)) {
      setFufillPassword((prevState) => [
        prevState[0],
        prevState[1],
        true,
        prevState[3],
      ]);
    } else if (/(?=.*\d)(?=.*[a-z])/.test(e.target.value)) {
      setFufillPassword((prevState) => [
        prevState[0],
        prevState[1],
        true,
        prevState[3],
      ]);
    } else {
      setFufillPassword((prevState) => [
        prevState[0],
        prevState[1],
        false,
        prevState[3],
      ]);
    }

    setAccountForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const confirmPasswordCheck = (e) => {
    if (
      e.target.value == accountForm.password ||
      e.target.value == accountForm.password2
    ) {
      setFufillPassword((prevState) => [
        prevState[0],
        prevState[1],
        prevState[2],
        true,
      ]);
    } else {
      setFufillPassword((prevState) => [
        prevState[0],
        prevState[1],
        prevState[2],
        false,
      ]);
    }

    setAccountForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /***
   * 1. Check the captcha
   * 2. If captcha is valid, then call the registerUser action
   */
  const submitData = async () => {
    var token = captchaRef.current.getValue();

    if (!token) {
      toast.error("Please verify captcha");
    } else {
      await axios
        .post(process.env.REACT_APP_API_URL, { token })
        .then((res) => {
          dispatch(registerUser(accountForm));
        })
        .catch((error) => {
          alert(error);
        });
      captchaRef.current.reset();
    }
  };

  /***
   * 1. Check if password matches
   * 2. Check if agreement box is ticked
   */
  const onSubmit = () => {
    if (accountForm.password != accountForm.password2) {
      toast.error("Passwords do not match");
      return;
    }
    if (agreementCheckbox == false) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    submitData();
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-fit py-20 bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <div className="flex flex-col items-center w-1/2 h-fit p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="font-type2 text-2xl">
            Register an account with us.
          </span>

          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap w-full justify-center mt-4">
              <div className="flex w-full mt-2">
                <span className="flex-none font-type1 order-1 w-1/5  text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                  Email
                </span>
                <input
                  required
                  className="flex-row w-4/5 h-full ml-[-2px] order-2 border-2 border-g3 rounded-r text-center"
                  type="text"
                  maxLength={255}
                  {...register("email", {
                    pattern:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                  placeholder="handler@mailer.com"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                />
              </div>
              <div className="flex w-full">
                {errors.email && (
                  <div>
                    <p style={{ color: "red" }}>
                      <b>Please enter a valid Email address</b>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-row w-full">
                <div className="flex flex-col w-1/2">
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      First Name
                    </span>
                    <input
                      required
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="text"
                      maxLength={20}
                      {...register("firstName", {
                        maxLength: 20,
                        pattern:
                          /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])).)*$/,
                      })}
                      placeholder="First Name"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={onChange}
                    />
                  </div>
                  {errors.firstName && (
                    <div>
                      <p style={{ color: "red" }}>
                        <b>No emojis allowed</b>
                      </p>
                    </div>
                  )}
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Last Name
                    </span>
                    <input
                      required
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="text"
                      maxLength={20}
                      {...register("lastName", {
                        maxLength: 20,
                        pattern:
                          /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])).)*$/,
                      })}
                      placeholder="Last Name"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={onChange}
                    />
                  </div>
                  {errors.lastName && (
                    <div>
                      <p style={{ color: "red" }}>
                        <b>No emojis allowed</b>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col w-1/2">
                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Password
                    </span>
                    <input
                      required
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="password"
                      {...register("password", {
                        pattern:
                          /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]))^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$)/,
                      })}
                      placeholder="*************"
                      id="password"
                      name="password"
                      value={password}
                      onChange={checkPassword}
                    />
                  </div>
                  {errors.password && (
                    <div>
                      <p style={{ color: "red" }}>
                        <b>Emoji not allowed, minimum 12 characters</b>
                      </p>
                    </div>
                  )}

                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Confirm Password
                    </span>
                    <input
                      required
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="password"
                      {...register("password2", {
                        validate: (val) => {
                          if (watch("password") != val) {
                            return "Passwords do not match";
                          }
                        },
                      })}
                      placeholder="*************"
                      id="password2"
                      name="password2"
                      value={password2}
                      onChange={confirmPasswordCheck}
                    />
                  </div>
                  {errors.password2 && (
                    <div>
                      <p style={{ color: "red" }}>
                        <b>Passwords do not match</b>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row flex-wrap w-full bg-white rounded p-2 my-2">
                <div className="flex-none w-full">
                  <b>Password Conditions</b>
                </div>
                <div
                  className="flex-none w-1/2"
                  style={{
                    color: fufillPassword[0] === false ? "red" : "black",
                  }}
                >
                  &#8226; At least 12 characters
                </div>
                <div
                  className="flex-none w-1/2"
                  style={{
                    color: fufillPassword[1] === false ? "red" : "black",
                  }}
                >
                  &#8226; Mixture of upper and lower case letters
                </div>
                <div
                  className="flex-none w-1/2"
                  style={{
                    color: fufillPassword[2] === false ? "red" : "black",
                  }}
                >
                  &#8226; Mixture of letters and numbers
                </div>
                <div
                  className="flex-none w-1/2"
                  style={{
                    color: fufillPassword[3] === false ? "red" : "black",
                  }}
                >
                  &#8226; Confirm password must match original password
                </div>
              </div>
              <div className="flex flex-row w-full justify-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={agreementCheckbox}
                  onChange={setAgreementCheckbox}
                />{" "}
                <Link to="/tos" className="hover:text-orange-500">
                  Accept our Terms and Conditions
                </Link>
              </div>
              <div className="flex flex-row w-full justify-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  id="emailSubscription"
                  name="emailSubscription"
                  value={emailSubscription}
                />{" "}
                <label>Subscribe to Newsletter</label>
              </div>
            </div>

            <ReCAPTCHA
              sitekey={reCaptchaKey}
              className="flex justify-center w-full mt-2"
              ref={captchaRef}
            />

            <button
              className="mt-4 p-2 w-full rounded bg-green-400 hover:bg-green-600 text-w1 font-bold"
              type="submit"
            >
              Sign up
            </button>
          </form>
          <div className="flex flex-row flex-nowrap w-full my-1">
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center mr-4" />
            <p className="font-type2">OR</p>
            <hr className="flex flex-wrap w-full border-1 border-[black] self-center ml-4" />
          </div>
          <Link
            to="/login"
            className="cursor-pointer p-2 w-full rounded bg-g2 text-w1 hover:bg-orange-500 hover:text-white font-bold text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
      {modalOpen ? <OTPModal closeModal={setModalOpen}></OTPModal> : null}
    </main>
  );
};

export default Signup;
