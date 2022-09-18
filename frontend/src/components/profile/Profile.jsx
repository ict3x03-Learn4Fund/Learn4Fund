import React from "react";
import noimage from "../../assets/vectors/noimage.png";

function profile() {
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
            <b>Name</b> John Doe
          </div>
          <div>
            <b>Email</b> test****@gmail.com{" "}
            <span className="link">
              Change?
            </span>
          </div>
          <div>
            <b>Phone Number</b> (+65) 9*****54{" "}
            <span className="link">
              Change?
            </span>
          </div>
        </div>

        <div className="flex w-1/2 h-full justify-evenly">
          <img
            src={noimage}
            alt={"avatar of user"}
            className="w-[100px] h-[100px] mr-[8px] bg-w1 self-center border-2"
            style={{ borderRadius: "100%" }}
          />
          <div className="flex-row justify-center self-center">
            <button className="btn">
              Import New Image
            </button>
            <span className="flex">Image can change once a week</span>
          </div>
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
          <b>Email Subscription</b> (<span className="text-red-500">Off</span>)
          </div>
          <button className="btn">On/Off</button>
          </div>
        </div>
        <div>
        <div className="flex w-full justify-between">
        <div className="self-center">
          <b>Show Donation Amounts</b> (
          <span className="text-red-500">Off</span>)</div>
          <button className="btn">On/Off</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default profile;
