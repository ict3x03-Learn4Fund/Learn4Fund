import { AiOutlineCloseSquare } from "react-icons/ai"
import { useAuth } from "../hooks/useAuth"
import toast from 'react-hot-toast';

export const NewsLetterModal = ({closeModal}) => {
    const {authed} = useAuth();


    function registerNewsLetter(){
        if (!authed){
            toast.error("Please sign in first")
            return;
        }

        // do sanitisation and check if email is valid

    }

    
    return (
      <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.4)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300" style={{zIndex: 99}}>
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex-column w-1/2 h-fit bg-white rounded-lg shadow-lg m-[16px]">
            <div className="flex w-full rounded-lg h-1/5 px-[16px] my-4">
            <div className="text-yellow-500 font-bold text-center w-full self-center font-type3 text-[24px]">
            Thank You For Subscribing!
            </div>
  
              <button
                className="text-[black] bg-transparent text-[2vw] self-center"
                onClick={() => closeModal(false)}
              >
                <AiOutlineCloseSquare />
              </button>
            </div>

            <div className="flex w-full text-[1vw] flex-wrap px-8">
              <p>Confirm that you have understood the information below: </p>
              <p>Due to the rise of phishing scams (fake emails), we will only send news information to your email.</p>
              <p>Learn4Fund will never ask for your email, password or OTP.</p>
              <p>Unsubscribe to the newsletter under profile settings.</p>
              <p>Please contact us at <a href="mailto:contact@learn4fund.com">contact@learn4fund.com</a>, for further queries.</p>
            </div>
            
            <div className="flex w-full justify-evenly text-[1vw] m-4">
            <button className="bg-red-500 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>closeModal(false)}>
                    Cancel
                </button>
                <button className="bg-b3 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>registerNewsLetter()}>
                    Click Here To Confirm
                </button>
            </div>
          </div>
        </div>
      </div>
    )
  }