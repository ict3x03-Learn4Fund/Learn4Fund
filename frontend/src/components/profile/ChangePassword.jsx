import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BsShieldLockFill } from "react-icons/bs";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getCartNumber, user2FA, getUserDetails } from "../../features/user/userActions";
import authService from "../../services/accounts";
import validator from "validator";

function ChangePassword() {
  const { userId } = useSelector(
    (state) => state.user
  );

  const [errorMsg] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [fufillPassword, setFufillPassword] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [accountForm, setAccountForm] = useState({
    password: "",
    password2: "",
  });

  const { password, password2 } = accountForm;
  const [otp, setOtp] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


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
    setModalOpen(true);
  };



  function handleOtp(event) {
    setOtp(event.target.value);
  }

  // for otp submit
  const submitForm = (data) => {
    if (userId && otp && password) {
      if (!validator.isAlphanumeric(userId) && !validator.isLength(userId, { min: 24, max: 24 })) {
        toast.error("Request denied");
        return;
      }
      else {
        const payload = { userId: userId, token: otp }
        console.log(payload)
        authService.verify2FA(payload).then((response) => {
          console.log("status", response.status)
          if (response.status == 200) {
            console.log(userId, password)
            authService.normalChangePass(userId, password).then((res) => {
              if (res.status == 200) {
                toast.success("Password changed successfully!")
                setModalOpen(false)
              }
              else {
                toast.error(res.data.message);
              }
            }).catch((err) => {
              toast.error(err.response.data.message);
              // console.log(err.response.data.message)
            })

          } else {
            toast.error(response.data.message);
          }
        }).catch((err) => {
          toast.error(err.response.data.message)
        })
      }
    }
    else {
      if (password) {
        toast.error("Request denied");
      }
      else {
        toast.error("Enter all fields");
      }
    }

  };

  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start ">
      <span className="flex w-full font-type1 text-[20px] font-bold ">
        Change Password
      </span>
      <p className="flex w-full">
        For your account's security, do not share your password with anyone else
      </p>
      <span className="h-[2px] bg-[black] w-full my-2" />
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-row flex-nowrap w-full space-y-2 p-2 justify-center ">
          <div className="flex w-full">
            <div className="self-center px-2 w-[200px]">
              <b>New Password</b>
            </div>
            <input required
              className="input"
              type="password"
              {...register("password", {
                pattern: /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]))^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$)/,
              })}
              placeholder="Enter password"
              id="password"
              name="password"
              value={password}
              onChange={checkPassword}
            />
          </div>
          {errors.password && (
            <div>
              <p style={{ color: "red" }}>
                Invalid password
              </p>
            </div>
          )}
          <div className="flex w-full">
            <div className="self-center px-2 w-[200px]">
              <b>Confirm Password</b>
            </div>
            <input required
              className="input"
              type="password"
              {...register("password2", {
                validate: (val) => {
                  if (watch("password") != val) {
                    return "Passwords do not match";
                  }
                },
              })}
              value={password2}
              placeholder="Confirm password"
              onChange={confirmPasswordCheck}
            />
          </div>
          {errors.password2 && (
            <div>
              <p style={{ color: "red" }}>
                Passwords do not match
              </p>
            </div>
          )}

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

          <div className="flex w-1/2">
            <button className="w-full btn bg-black mt-8">Confirm</button>
          </div>
        </div>
      </form>
      {modalOpen ? (
        <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
          <div className="flex  justify-center items-center h-full w-full">
            <div className="flex-column w-1/3 h-auto bg-white rounded-lg shadow-lg m-[16px]">
              <div className="flex w-full rounded-lg h-1/5 px-[16px]">
                <div className="ml-2 mt-2 text-black text-center w-full self-center text-[24px]">
                  2 Factor Authentication
                </div>

                <button
                  className="text-[black] bg-transparent text-[24px]"
                  onClick={() => setModalOpen(false)}
                >
                  <AiOutlineCloseSquare />
                </button>
              </div>
              <form
                onSubmit={handleSubmit(submitForm)}
                className="mx-5, my-5 flex justify-center"
              >
                <div className="flex flex-col items-center  rounded-lg">
                  <div className="flex flex-nowrap w-full justify-center mt-4">
                    <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                      <div className="flex w-full h-full content-center justify-center">
                        <BsShieldLockFill className="self-center text-w1" />
                      </div>
                    </span>
                    <input
                      className="flex w-3/4 h-[40px] input"
                      maxLength={6} // Code is 6 digits
                      type="password"
                      {...register("code", {
                        required: true,
                        pattern: /^[0-9]*$/,
                      })} // [Validation] Number only
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
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChangePassword;
