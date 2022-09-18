import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [newUser, setNewUser] = useState({id:null});
  const [passwordStrength, setPasswordStrength] = useState(100);

  function onSubmit(){
   //check email
   //check phone number
  }

  // TODO: add captcha
  
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-fit py-20 bg-[url('assets/images/background.jpg')] bg-cover bg-no-repeat backdrop-blur-sm">
        <div className="flex flex-col items-center w-1/2 h-fit p-2 bg-w2 rounded-lg border-2 border-black">
          <span className="font-type2 text-2xl">
            Register an account with us
          </span>
          <div className="flex flex-wrap w-full justify-center mt-4">
            <div className="flex w-1/2">
                <div className="flex flex-col w-full">
                    <div className="flex pr-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/3 text-center text-[1vw] bg-g1 h-full text-w1 rounded-l py-2">First Name</span>
                        <input className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" placeholder="Chuck"/>
                    </div>
                    <div className="flex pr-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/3 text-center text-[1vw] bg-g1 h-full text-w1 rounded-l py-2">Last Name</span>
                        <input className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" placeholder="Norris"/>
                    </div>
                    <div className="flex pr-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/3 text-center text-[1vw] bg-g1 h-full text-w1 rounded-l py-2">Email</span>
                        <input className="flex-none w-2/3 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" placeholder="ChuckWood@gmail.com"/>
                    </div>
                    
                </div>
            </div>
            <div className="flex flex-col  w-1/2">
            <div className="flex pl-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-[1vw] text-w1 rounded-l py-2">Password</span>
                        <input className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" type="password" placeholder="*************"/>
                    </div>
                    
                    <div className="flex pl-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-[1vw] text-w1 rounded-l py-2">Confirm Password</span>
                        <input className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" type="password" placeholder="*************"/>
                    </div>
                    <div className="flex pl-2 my-2">
                        <span className="flex-none font-type1 order-1 w-1/2 text-center bg-g1 h-full text-[1vw] text-w1 rounded-l py-2">Phone Number</span>
                        <input className="flex-none w-1/2 h-full order-2 border-2 border-g3 rounded-r text-center text-[1vw]" type="mobile" placeholder="961233432"/>
                    </div>
                    {/* <div className="flex flex-col flex-wrap ml-2 my-2">
                        <div className="flex w-full">password strength: {passwordStrength}%</div>
                    </div> */}
            </div>
            <div className="flex flex-row flex-wrap w-full bg-white rounded p-2 my-2 text-[1vw]">
            <div className="flex-none w-full"><b>Password Conditions</b></div>
                <div className="flex-none w-1/2">
                &#8226; At least 8 characters
                    </div>
                    <div className="flex-none w-1/2">
                    &#8226; Mixture of upper and lower case letters
                    </div>
                    <div className="flex-none w-1/2">
                &#8226; Mixture of letters and numbers
                    </div>
                    
                    
            </div>
            <div className="flex flex-row w-full justify-center"><input type="checkbox" className="mr-2"/> <Link to='/policy' className="hover:text-orange-500">Accept our Terms and Conditions</Link></div>
            <div className="flex flex-row w-full justify-center"><input type="checkbox" className="mr-2"/> <label>Subscribe to Newsletter</label></div>
          </div>
          
          <button className="mt-4 p-2 w-full rounded bg-orange-500 text-w1 font-bold">
            Activate OTP
          </button>

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
