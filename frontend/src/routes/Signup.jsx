import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userActions";
import { toast } from "react-hot-toast";
import { OTPModal } from "../modals/OTPModal";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const { loading, userInfo, userId, error, success, stateErrorMsg } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(success);
    if (success) {
      setModalOpen(true);
    }
    if (error) {
      toast.error(stateErrorMsg);
    }
  }, [dispatch, success, error]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const [accountForm, setAccountForm] = useState({
    email: "",
    countryCode: "",
    phone: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    emailSubscription: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fufillPassword, setFufillPassword] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    email,
    phone,
    countryCode,
    password,
    password2,
    firstName,
    lastName,
    emailSubscription,
  } = accountForm;

  const onChange = (e) => {
    setAccountForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const checkPassword = (e) => {
    if (
      /(?=^.{12,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        e.target.value
      )
    ) {
      setPasswordStrength(100);
    } else {
      setPasswordStrength(0);
    }

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
    if (e.target.value == accountForm.password) {
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

  const onSubmit = (data) => {
    if (data.password != data.password2) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(registerUser(data));
  };

  const setColor = (strength) => {
    if (strength < 50) {
      return "red";
    } else {
      return "green";
    }
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-fit py-20 bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <div className="flex flex-col items-center w-1/2 h-fit p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="font-type2 text-2xl">
            Register an account with us
          </span>

          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap w-full justify-center mt-4">
              <div className="flex flex-row w-full">
                <div className="flex w-1/2">
                  <div className="flex flex-col w-full">
                    <div className="flex pr-2 my-2">
                      <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                        First Name
                      </span>
                      <input
                        className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                        type="text"
                        maxLength={20}
                        {...register("firstName", {
                          required: true,
                          maxLength: 20,
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
                          <b>Please check the First Name</b>
                        </p>
                      </div>
                    )}
                    <div className="flex pr-2 my-2">
                      <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                        Last Name
                      </span>
                      <input
                        className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                        type="text"
                        maxLength={20}
                        {...register("lastName", {
                          required: true,
                          maxLength: 20,
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
                          <b>Please check the Last Name</b>
                        </p>
                      </div>
                    )}
                    <div className="flex pr-2 my-2">
                      <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                        Country Code
                      </span>
                      <input
                        className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                        type="text"
                        maxLength={4}
                        {...register("countryCode", {
                          required: true,
                          pattern: /^(\+\d{2,3})$/,
                        })}
                        placeholder="+65"
                        id="countryCode"
                        name="countryCode"
                        value={countryCode}
                        onChange={onChange}
                      />
                    </div>
                    {errors.countryCode && (
                      <div>
                        <p style={{ color: "red" }}>
                          <b>Check country code</b>
                        </p>
                      </div>
                    )}

                    <div className="flex pr-2 my-2">
                      <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                        Phone
                      </span>
                      <input
                        className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                        type="tel"
                        maxLength={12}
                        {...register("phone", {
                          required: true,
                          pattern: /^[0-9]*$/,
                          minLength: 6,
                          maxLength: 12,
                        })}
                        placeholder="98765432"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                      />
                    </div>
                    {errors.phone && (
                      <div>
                        <p style={{ color: "red" }}>
                          <b>Check phone number</b>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col  w-1/2">
                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Email
                    </span>
                    <input
                      className="flex-row w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="text"
                      maxLength={255}
                      {...register("email", {
                        required: true,
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
                  {errors.email && (
                    <div>
                      <p style={{ color: "red" }}>
                        <b>Please enter a valid Email address</b>
                      </p>
                    </div>
                  )}
                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Password
                    </span>
                    <input
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="password"
                      {...register("password", {
                        required: true,
                        pattern: /.{12,}/,
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
                        <b>Password too short</b>
                      </p>
                    </div>
                  )}
                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Password Strength
                    </span>
                    <input
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center text-white"
                      style={{ backgroundColor: setColor(passwordStrength) }}
                      type="text"
                      readOnly
                      id="passwordstrength"
                      name="passwordstrength"
                      value={
                        passwordStrength < 50 ? "Unacceptable" : "Acceptable"
                      }
                    />
                  </div>
                  <div className="flex pl-2 my-2">
                    <span className="flex-none font-type1 order-1 w-2/5 text-center text-sm bg-g1 h-full text-w1 rounded-l py-2">
                      Confirm Password
                    </span>
                    <input
                      className="flex-none w-3/5 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="password"
                      {...register("password2", {
                        required: true,
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
                <input type="checkbox" className="mr-2" />{" "}
                <Link to="/policy" className="hover:text-orange-500">
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
            <ReCAPTCHA sitekey="6Le7wVsiAAAAAJsqEU2e94S3VDqf2UFpRpz2l6De" />
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
