import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai';

const Banner = (props) => {
    return (
        <div className='flex h-[80px] w-full bg-g2'>
            <span onClick={()=>{props.closeBanner(true)}} className="absolute right-2 top-2"><AiOutlineCloseCircle className='text-w1 text-[24px] self-center'/></span>
            <div className="flex flex-col justify-center items-center w-full font-type1 font-bold text-[24px] text-w1">Redeem 15% Discount Code After Each Purchase, Find Out How.</div>
        </div>
      )
}

export default Banner
