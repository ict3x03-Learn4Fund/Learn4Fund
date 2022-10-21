import React, { useState } from "react";
import { AiOutlineQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai";
import validator from 'validator'
import {BiErrorCircle} from 'react-icons/bi'
import { toast } from "react-hot-toast";

export const CreditCardModal = ({ closeModal }) => {
  const [checkedState, setCheckedState] = useState([true,false]);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [method, selectMethod]= useState("previous")
  const [postalCode, setPostalCode] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  function confirmPayment(){
    if (!validator.isCreditCard(cardNumber)) {
      toast.error('Enter valid CreditCard Number!')
    }
    if(!validator.isPostalCode(postalCode, "SG")){
      toast.error('Enter valid Postal Code!')
    }
  }

  function selectCardType(type) {
    if (type === "visa") {
      setCheckedState([true, false]);
    } else if (type === "mastercard") {
      setCheckedState([false, true]);
    }
  }
  return (
    <div
      className="fixed w-screen h-screen bg-[rgba(100,100,100,0.9)] top-0 left-0 overflow-auto transition ease-in-out delay-300"
      style={{ zIndex: 99 }}
    >
      <div className="flex justify-center items-center h-full w-full">
        <div className="mx-8 rounded-lg w-full h-fit bg-white shadow-lg">
          <div className="flex-row justify-center align-center items-center content-center">
            <div className="font-bold text-center self-center text-2xl px-8 w-full my-8">
              Payment Checkout <AiOutlineCloseCircle className="inline self-center float-right" onClick={()=>closeModal(false)}/>
            </div>
            <div className="flex bg-green-500 p-2 mx-4 my-1 text-white font-semibold text-lg"><input type="radio" checked={method === 'previous'} onClick={()=>selectMethod('previous')} className="mr-2"/> Select previous payment method</div>
            <div className="flex bg-orange-500 p-2 mx-4 my-1 text-white font-semibold text-lg"><input type="radio" checked={method === 'new'} onClick={()=>selectMethod('new')} className="mr-2"/> Choose another method</div>
            
            <div className="flex flex-wrap w-full h-full">
              <div className="w-1/2">
                <div className="border-2 border-blue-500 min-h-[300px] m-4 rounded-lg space-y-4 px- pb-4">
                  <span className="absolute font-bold text-blue-500 bg-white mt-[-15px] mx-4 px-2">
                    Billing address
                  </span>

                <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">First Name</div>
                    <input
                      type="text"
                      name="holder name"
                      required
                      placeholder="First Name"
                      className="p-2 border-2 border-black w-40"
                    />
                  

                    <div className="self-center">Last Name</div>
                    <input
                      type="text"
                      name="holder name"
                      required
                      placeholder="Last Name"
                      className="p-2 border-2 border-black w-40" 
                    />
                  
                </div>

                <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Street Address</div>
                    <input
                      type="text"
                      name="holder name"
                      required
                      placeholder="Drive 3 Street 4"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">House Number</div>
                    <input
                      type="text"
                      name="building number"
                      required
                      placeholder="floor-unit"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">City</div>
                    <input
                      type="text"
                      name="city name"
                      value="Singapore"
                      disabled
                      placeholder="Singapore"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Postal Code</div>
                    <input
                      type="text"
                      name="postal code"
                      value="510000"
                      required
                      placeholder="postal code"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>

                </div>

                


              </div>
              <div className="w-1/2">
                <div className="border-2 border-blue-500 min-h-[300px] m-4 rounded-lg space-y-4 px-4 pb-4">
                  <span className="absolute font-bold text-blue-500 bg-white mt-[-15px] mx-4 px-2">
                    Card Information
                  </span>
                  <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Card Type</div>
                    <input
                      type="checkbox"
                      className="w-[20px] h-[20px] self-center"
                      checked={checkedState[0]}
                      onClick={() => selectCardType("visa")}
                    />
                    <img
                      src={require("../assets/vectors/visa.png")}
                      className="w-[80px] h-[50px]"
                    />
                    <input
                      type="checkbox"
                      className="w-[20px] h-[20px] self-center"
                      checked={checkedState[1]}
                      onClick={() => selectCardType("mastercard")}
                    />
                    <img
                      src={require("../assets/vectors/mastercard.png")}
                      className="w-[80px] h-[50px]"
                    />
</div>
                    <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Holder's Name</div>
                    <input
                      type="text"
                      name="holder name"
                      required
                      placeholder="Card Holder Name"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>

                    <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Card number</div>
                    <input
                      type="number"
                      name="holder name"
                      required
                      maxLength={19}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="p-2 border-2 border-black w-80"
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">Expiration date</div>
                    <input
                      type="text"
                      name="holder name"
                      required
                      placeholder="mm/yyyy"
                      className="p-2 border-2 border-black w-40"
                    />
                    </div>
                    <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                    <div className="self-center w-32">CVV</div>
                    <input
                      type="number"
                      name="holder name"
                      required
                      maxLength={3}
                      placeholder="***"
                      className="p-2 border-2 border-black w-14"
                    />
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="flex flex-wrap w-full h-full mx-4 font-bold px-4">
              <input
                type="checkbox"
                className="w-[20px] h-[20px] self-center mr-4"
                checked={saveInfo}
                onClick={() => setSaveInfo(!saveInfo)}
              />
              <span className="self-center">
                Save payment information for future purchases
                <AiOutlineQuestionCircle className="inline ml-2" />
              </span>
            </div>
          </div>

          <div className="flex w-full flex-wrap px-4 justify-center">
            <button
              className="w-fit rounded-lg text-white bg-green-500 font-bold shadow-lg p-4 my-4"
              onClick={() => confirmPayment()}
            >
              Confirm payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
