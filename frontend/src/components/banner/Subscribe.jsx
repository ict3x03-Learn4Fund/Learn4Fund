import React from 'react'
import {AiOutlineBell} from 'react-icons/ai'

const Subscribe = ({setNewsModal}) => {
  return (
    <div className='flex justify-evenly h-[100px] w-full bg-blue-500 px-[120px]' style={{zIndex: 49}}>
            <div className="flex flex-row  items-center w-5/6 font-type1 font-bold text-[1.5vw] text-w1 uppercase">Notify me to new courses and interesting news</div>
            <div className='flex h-[50px] self-center w-1/6'>
            <button className='flex w-fit bg-black rounded hover:bg-grey-700 text-white font-bold border-1 px-4' onClick={()=>{setNewsModal(true)}}><AiOutlineBell className="self-center"/><span className='self-center ml-2'>Notify Me</span></button>
            </div>
        </div>
  )
}

export default Subscribe