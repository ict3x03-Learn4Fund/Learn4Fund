import { AiOutlineCloseSquare } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";

export const PromotionModal = ({closeModal}) => {
  const {authed} = useAuth();
  const navigate = useNavigate();
  function goToSignup(){
    navigate('/signup');
    closeModal(false);
  }
    return (
      <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.4)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300" style={{zIndex: 99}}>
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex-column w-1/2 h-fit bg-white rounded-lg shadow-lg m-[16px]">
            <div className="flex w-full rounded-lg h-1/5 px-[16px] my-4">
            <div className="text-yellow-500 font-bold text-center w-full self-center font-type3 text-[24px]">
            More Discounts 4 Our Members!
            </div>
  
              <button
                className="text-[black] bg-transparent text-[2vw] self-center"
                onClick={() => closeModal(false)}
              >
                <AiOutlineCloseSquare />
              </button>
            </div>

            <div className="flex w-full text-[1vw] flex-wrap px-8 m-4">
              <p>We have a special discount for our members! Sign up now and receive the member price for all courses!</p>
              <p>In light of phishing scams (fake emails), discounts are automatically applied upon checkout.</p>
              <p>Please contact us at <a href="mailto:contact@learn4fund.com">contact@learn4fund.com</a>, for further details or transaction errors.</p>
            </div>
            <div className="flex w-full justify-center text-[1vw] m-4">
            {authed && <button className="bg-red-500 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>closeModal(false)}>
                    Okay
                </button>}
                {!authed && <button className="bg-b3 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>goToSignup()}>
                    Sign up
                </button>}
            </div>
              
          </div>
        </div>
      </div>
    )
  }