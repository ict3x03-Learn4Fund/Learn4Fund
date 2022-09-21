
import React from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { useAuth } from '../hooks/useAuth';

export const OTPModal = ({closeModal}) => {
  const {authed} = useAuth();
  return (
    <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex-column w-1/2 h-1/2 bg-white rounded-lg shadow-lg m-[16px]">
          <div className="flex w-full rounded-lg h-1/5 px-[16px]">
          <div className="text-black text-center w-full self-center text-[24px]">
              {'OTP'}
          </div>

            <button
              className="text-[black] bg-transparent text-[24px]"
              onClick={() => closeModal(false)}
            >
              <AiOutlineCloseSquare />
            </button>
          </div>
          
          <div className="flex w-full justify-center text-[1vw] m-4">
            {authed && <button className="bg-red-500 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>closeModal(false)}>
                    Confirm OTP
                </button>}
                
            </div>
        </div>
      </div>
    </div>
  )
}


