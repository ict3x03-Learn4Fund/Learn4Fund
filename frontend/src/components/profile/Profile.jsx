import React, { useState } from "react";
import toast from "react-hot-toast";
import noimage from "../../assets/vectors/noimage.png";
import imagesService from "../../services/images";
import authService from "../../services/accounts";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../features/user/userActions";
import { useEffect } from "react";

function Profile() {
  const [file, setFile] = useState(null);
  const formData = new FormData();
  const { userInfo, userId } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo && userId) {
      dispatch(getUserDetails());
    }
  }, [userId]);

  useEffect(() => {
    if (userInfo) {
      setAvatar(userInfo.avatarImg);
    }
  }, [setAvatar]);

  const uploadImage = (e) => {
    e.preventDefault();
    console.log(file);
    formData.append("image", file);
    imagesService
      .uploadImage(formData)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          const imgId = response.data.id;
          authService
            .uploadAvatar(userId, imgId)
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
        toast.error(error.message);
      });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        My profile
      </span>
      <p className="flex w-full">Manage and protect your account</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      <div className="flex flex-col flex-wrap w-full">
        <div className="flex-row w-1/2 h-full p-2 border-r-2 font-type1 space-y-4 my-4">
          <div>
            <b>Role</b> Member
          </div>

          <div>
            <b>First name:</b> {userInfo.firstName}
          </div>
          <div>
            <b>Last Name</b> {userInfo.lastName}
            <span className="link">Change?</span>
          </div>
          <div>
            <b>Email</b> {userInfo.email}
            <span className="link">Change?</span>
          </div>
        </div>

        <div className="flex w-1/2 h-full justify-evenly">
          <form>
            <img
              src={
                avatar
                  ? `http://localhost:5000/v1/api/images/getImg/${avatar}`
                  : noimage
              }
              alt={"avatar of user"}
              className="w-[100px] h-[100px] mr-[8px] bg-w1 self-center border-2"
              style={{ borderRadius: "100%" }}
            />
            <input
              className="mb-2 file-input file-input-md file-input-bordered file-input-primary w-full max-w-xs"
              type="file"
              name="file"
              onChange={(e) => handleFile(e)}
            ></input>
            <div className="flex-row justify-center self-center">
              <button className="btn" onClick={(e) => uploadImage(e)}>
                Import New Image
              </button>
              <span className="flex">Image can change once a week</span>
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
              <span className="text-red-500">Off</span>)
            </div>
            <button className="btn">On/Off</button>
          </div>
        </div>
        <div>
          <div className="flex w-full justify-between">
            <div className="self-center">
              <b>Show Donation Amounts</b> (
              <span className="text-red-500">Off</span>)
            </div>
            <button className="btn">On/Off</button>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="self-center">
            <b>Delete my account</b>{" "}
          </div>
          <button className="btn bg-red-500">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
