import React, {useState} from "react";

function ChangePassword() {
    const [passwordStrength, setPasswordStrength] = useState(100);
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Change Password
      </span>
      <p className="flex w-full">
        For your account's security, do not share your password with anyone else
      </p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      <div className="flex-row flex-nowrap w-full space-y-2 p-2">
        <div className="flex w-full">
          <div className="self-center px-2 w-[200px]">
            <b>New Password</b>
          </div>
          <input className="input" type="password" placeholder="new password"/>
        </div>
        <div className="flex w-full">
          <div className="self-center px-2 w-[200px]">
            <b>Confirm Password</b>
          </div>
          <input className="input" type="password" placeholder="confirm password"/>
        </div>
        <div className="flex w-full">
          <div className="self-center px-2 w-[200px]">
            <b>Verification Code</b>
          </div>
          <input className="input" type="password" placeholder="OTP"/>
          <button className="btn mx-4">Generate </button>
        </div>
        <div className="flex flex-col flex-wrap ml-2 my-2 w-1/3">
                        <div className="flex w-full">password strength: {passwordStrength}%</div>
                        <div className="flex w-full border-2 border-g2">
                        <span className="flex-none text-center  h-full py-[6px] bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 ease-in" style={{width: passwordStrength+'%'}}></span>
                    </div>
                    </div>
                    <div className="flex flex-row flex-wrap w-full bg-white rounded p-2 my-2">
            <div className="flex-none w-full"><b>Password Conditions</b></div>
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
        <div className="flex w-full">
          <button className="btn bg-black mt-8">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
