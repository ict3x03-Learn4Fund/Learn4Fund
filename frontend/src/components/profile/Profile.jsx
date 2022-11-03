import React, { Fragment, useState } from "react";
import {toast} from "react-toastify";
import noimage from "../../assets/vectors/noimage.png";
import imagesService from "../../services/images";
import authService from "../../services/accounts";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../features/user/userActions";
import { logout } from "../../features/user/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";

function Profile() {
  const [file, setFile] = useState(null);
  const formData = new FormData();
  const { userInfo } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();


  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
  }, []);

  useEffect(() => {
    if (userInfo) {
      setAvatar(userInfo.avatarImg);
    }
  }, [setAvatar]);

  const updateProfile = () => {
    console.log(firstName, lastName, email);
    var error = false;
    if (firstName && lastName && email) {
      const normalizedEmail = validator.normalizeEmail(email);
      const escapedFirstName = validator.escape(firstName);
      const escapedLastName = validator.escape(lastName);
      if (!validator.isEmail(normalizedEmail)) {
        toast.error("Invalid email format");
        error = true;
      }
      if (!validator.isLength(escapedFirstName, {min: 2, max: 25}) || !validator.matches(firstName, /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])).)*$/)) {
        toast.error("Invalid first name");
        error = true;
      }
      if (!validator.isLength(escapedLastName, {min: 2, max: 25}) || !validator.matches(lastName, /^((?!([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])).)*$/)) {
        toast.error("Invalid last name");
        error = true;
      }
      if (!error) {
        authService
        .updateDetails(userInfo.id, escapedFirstName, escapedLastName, normalizedEmail)
        .then((res) => {
          if (res.status == 200) {
            toast.success("Details Updated Successfully.");
            dispatch(getUserDetails());
          } else {
            if (res.data.message && res.data.message === Array) {
              res.data.message.map((err) => toast.error(err.msg));
            }
            else{ toast.error("Error updating profile. Try again later.");}
            
          }
        })
        .catch((err) => {
          toast.error("Error updating profile. Try again later.");
          console.log(err.response.data.message);
        });
      }
    }
    else {
      toast.error("Please fill all the fields");
    }
    
  };

  const uploadImage = (e) => {
    e.preventDefault();
    console.log(file);
    if (file.type != "image/jpeg" && file.type != "image/png"){
      toast.error("Please choose only jpeg and png images")
      return
    }
    formData.append("image", file);
    imagesService
      .uploadImage(formData)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          const imgId = response.data.id;
          authService
            .uploadAvatar(userInfo.id, imgId)
            .then(() => {
              toast.success("Successfully uploaded image to this user.");
              setAvatar(response.data.id);
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
        }
      })
      .catch((error) => {
        if (error.response.data.message){
          return toast.error(error.response.data.message)
        }
        toast.error(error.message);
      });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const deleteAccount = () => {
    authService.deleteAcc(userInfo.id).then((res) => {
      if (res.status == 200){
        toast.success("Account Deleted Successfully.")
        dispatch(logout());
        navigate("/login");
        
      } else {
        toast.error("Error deleting your account.")
      }
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
  }

  const updateSubscription = () => {
    const emailSubscription = !userInfo?.emailSubscription
    console.log(emailSubscription)
    authService
      .updateSubscription(userInfo.id, emailSubscription)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Updated subscription status.");
          dispatch(getUserDetails());
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  return (
    <Fragment>
      <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
        <span className="flex w-full font-type1 text-[20px] font-bold">
          My profile
        </span>
        <p className="flex w-full">Manage and protect your account</p>
        <span className="h-[2px] bg-[black] w-full my-2" />

        <div className="flex flex-col flex-wrap w-full h-1/2">
          <div className="flex-row w-1/2 p-2 border-r-2 font-type1 space-y-4">
            <form>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="font-bold">Role</td>
                    <td>{userInfo.role}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">First name</td>
                    <td>
                      <input
                        type="text"
                        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        minLength={2}
                        maxLength={25}
                        onChange={(e) => setFirstName(e.target.value)}
                        defaultValue={userInfo.firstName}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Last name</td>
                    <td>
                      <input
                        type="text"
                        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        minLength={2}
                        maxLength={25}
                        onChange={(e) => setLastName(e.target.value)}
                        defaultValue={userInfo.lastName}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Email</td>
                    <td>
                      <input
                        type="text"
                        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-2 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        defaultValue={userInfo.email}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <input
                className="btn w-full"
                type="button"
                value="Update Details"
                onClick={(e) => updateProfile(e)}
              />
            </form>
          </div>

          <div className="flex w-1/2 h-full justify-evenly">
            <form encType="multipart/form-data" >
              <img
                src={
                  avatar
                    ? `http://localhost:5000/v1/api/images/getImg/${avatar}`
                    : noimage
                }
                alt={"avatar of user"}
                className="w-[140px] h-[140px] m-auto bg-w1 self-center border-2"
                style={{ borderRadius: "100%" }}
              />
              <input
                className="mt-2 block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100 mb-2"
                type="file"
                name="file"
                accept=".jpeg, .png, image/jpeg,image/png"
                onChange={(e) => handleFile(e)}
              ></input>
              <div className="flex-row w-full justify-center self-center">
                <button className="btn w-full" onClick={(e) => uploadImage(e)}>
                  Save Profile picture
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-row flex-nowrap w-full space-y-2 px-2">
          <div className="flex w-full">
            <div className="self-center">
              <b>Two Factor Authentication</b> (
              <span className="text-success">Enable</span>)
            </div>
          </div>
          <div>
            <div className="flex w-full justify-between">
              <div className="self-center">
                <b>Email Subscription</b> (
                <span className="text-red-500" >{userInfo?.emailSubscription ? "On": "Off"}</span>)
              </div>
              <button className="btn" onClick={() => updateSubscription()}>{userInfo?.emailSubscription ? "Toggle Off": "Toggle On"}</button>
            </div>
          </div>
          <div className="mt-5 flex w-full justify-between">
            <div className="self-center">
              <b>Delete my account</b>
            </div>
            <button
              className="btn bg-red-500"
              onClick={(e) => {
                setDeleteModal(true);
              }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
      {deleteModal ? (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg font-medium leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Deactivate account
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All
                          of your data will be permanently removed. This action
                          cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => deleteAccount()}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}

export default Profile;
