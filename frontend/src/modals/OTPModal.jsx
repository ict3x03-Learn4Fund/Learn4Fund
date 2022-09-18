
import React from 'react'

export const OTPModal = ({closeModal}) => {
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
          
            
        </div>
      </div>
    </div>
  )
}


