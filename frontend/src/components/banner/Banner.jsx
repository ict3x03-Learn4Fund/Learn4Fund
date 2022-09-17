import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';


const Banner = (props) => {
    const navigate = useNavigate();
    function Close() {
        sessionStorage.getItem("closeBanner", true);
        props.closeBanner(true);
    }
    return (
        <div className='sticky bottom-0 flex h-[80px] w-full bg-black opacity-80 justify-center'>
            <span onClick={()=>{Close()}} className="cursor-pointer absolute right-2 top-2"><AiOutlineCloseCircle className='text-w1 text-[24px] self-center'/></span>
            <div className="cursor-pointer flex flex-col font-type1 font-bold text-[24px] self-center text-w1 w-fit h-fit    " onClick={()=>{navigate('/promo')}}>Redeem 15% Discount Code After Each Purchase, Find Out Here.</div>
        </div>
      )
}

export default Banner
