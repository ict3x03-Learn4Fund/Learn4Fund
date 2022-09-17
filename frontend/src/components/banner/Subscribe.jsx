import React from 'react'

const Subscribe = () => {
  return (
    <div className='flex justify-evenly h-[100px] w-full bg-blue-500 px-[120px]'>
            <div className="flex flex-row  items-center w-full font-type1 font-bold text-[1.5vw] text-w1 uppercase">Notify me to new courses and discounts</div>
            <div className='flex h-[50px] self-center'>
              <input className='h-full w-[320px] p-4 rounded-l' placeholder="Email"/>
            <button className='flex-none bg-black rounded-r hover:bg-grey-700 text-white font-bold border-1 px-4'>Notify Me</button>
            </div>
        </div>
  )
}

export default Subscribe