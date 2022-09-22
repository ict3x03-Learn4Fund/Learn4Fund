import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Signup() {
  const {auth, authed, authMsg, register, currentUser} = useAuth();
  const [errorMsg, setErrorMsg] = useState("") 
  const navigate = useNavigate();
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
  const [passwordStrength, setPasswordStrength] = useState(100);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password === password2){
      const userForm = {email, phone, countryCode, password, firstName, lastName, emailSubscription};
      register(userForm)
    } else {
      setErrorMsg("Password does not match");
    }

  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-fit py-20 bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <div className="flex flex-col items-center w-1/2 h-fit p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="font-type2 text-2xl">
            Register an account with us
          </span>
          <form onSubmit={onSubmit}>
            <div className="flex flex-wrap w-full justify-center mt-4">
              <div className="flex w-1/2">
                <div className="flex flex-col w-full">
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-1/3 text-center bg-g1 h-full text-w1 rounded-l py-2">
                      First Name
                    </span>
                    <input
                      className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center"
                      placeholder="Chuck"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={onChange}
                    />
                  </div>
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-1/3 text-center bg-g1 h-full text-w1 rounded-l py-2">
                      Last Name
                    </span>
                    <input
                      className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center"
                      placeholder="Norris"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={onChange}
                    />
                  </div>
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-1/3 text-center bg-g1 h-full text-w1 rounded-l py-2">
                      Email
                    </span>
                    <input
                      className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center"
                      placeholder="ChuckWood@gmail.com"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                    />
                  </div>
                  <div className="flex pr-2 my-2">
                    <span className="flex-none font-type1 order-1 w-1/3 text-center bg-g1 h-full text-w1 rounded-l py-2">
                      Password
                    </span>
                    <input
                      className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center"
                      type="password"
                      placeholder="*************"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col  w-1/2">
              <div className="flex pl-2 my-2">
                  <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-w1 rounded-l py-2">
                    Country Code
                  </span>
                  <input
                    className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center"
                    type="text"
                    placeholder="+65"
                    id="countryCode"
                    name="countryCode"
                    value={countryCode}
                    onChange={onChange}
                  />
                </div>
                <div className="flex pl-2 my-2">
                  <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-w1 rounded-l py-2">
                    Phone
                  </span>
                  <input
                    className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center"
                    type="text"
                    placeholder="98765432"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                  />
                </div>

                <div className="flex pl-2 my-2">
                  <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-w1 rounded-l py-2">
                    Confirm Password
                  </span>
                  <input
                    className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center"
                    type="password"
                    placeholder="*************"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                  />
                </div>
                <div className="flex flex-col flex-wrap ml-2 my-2">
                  <div className="flex w-full">
                    password strength: {passwordStrength}%
                  </div>
                  <div className="flex w-full border-2 border-g2">
                    <span
                      className="flex-none text-center  h-full py-[6px] bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 ease-in"
                      style={{ width: passwordStrength + "%" }}
                    ></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-wrap w-full bg-white rounded p-2 my-2">
                <div className="flex-none w-full">
                  <b>Password Conditions</b>
                </div>
                <div className="flex-none w-1/2">
                  &#8226; At least 12 characters
                </div>
                <div className="flex-none w-1/2">
                  &#8226; Mixture of upper and lower case letters
                </div>
                <div className="flex-none w-1/2">
                  &#8226; Mixture of letters and numbers
                </div>
                <div className="flex-none w-1/2">
                  &#8226; At least one special character (e.g. !@#$%^&*)
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

            <button
              className="mt-4 p-2 w-full rounded bg-success text-w1 font-bold"
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
            className="cursor-pointer p-2 w-full rounded bg-g2 text-w1 font-bold text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Signup;
