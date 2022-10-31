import React, { Fragment, useState } from "react";
import { AiOutlineQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai";
import validator from "validator";
import { BiErrorCircle } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import paymentsService from "../services/payment";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, getCartNumber } from "../features/user/userActions";

export const CreditCardModal = ({
  closeModal,
  totalAmount,
  donation,
  showDonation,
  checkout,
}) => {
  const [checkedState, setCheckedState] = useState([true, false]);
  const { userInfo, userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [payMethod, selectPayMethod] = useState("previous");
  const [billMethod, selectBillMethod] = useState("previous");
  const [postalCode, setPostalCode] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [cardId, setCardId] = useState();
  const [addrId, setAddrId] = useState();

  const getMethods = () => {
    paymentsService
      .getMethods(userId)
      .then((response) => {
        if (response.status == 200) {
          setAddressList(response.data.billAddrs);
          setCardList(response.data.filteredCards);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const prepareCheckoutCart = () => {
    const newCart = [];
    checkout.map((value, index) => {
      const cartItem = { courseId: value.courseId, quantity: value.quantity };
      newCart.push({ cartItem: cartItem });
    });
    return newCart;
  };

  const makePayment = () => {
    const filteredCart = prepareCheckoutCart();
    const payload = {
      accountId: userId,
      donationAmount: donation,
      showDonation: showDonation,
      totalAmount: totalAmount,
      cardId: cardId,
      billAddressId: addrId,
      checkedOutCart: filteredCart,
    };
    console.log(payload);
    paymentsService
      .makePayment(payload)
      .then((response) => {
        if (response.status == 200) {
          toast.success("Payment has been made successfully!");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  useEffect(() => {
    if (userId) {
      dispatch(getUserDetails());
      console.log(totalAmount, donation, checkout);
      getMethods();
      console.log(addressList);
    }
  }, []);

  function confirmPayment() {
    if (payMethod == "new" && !validator.isCreditCard(cardNumber)) {
      toast.error("Enter valid CreditCard Number!");
    }
    if (billMethod == "new" && !validator.isPostalCode(postalCode, "SG")) {
      toast.error("Enter valid Postal Code!");
    }
    console.log("cardId ", cardId);
    console.log("addrId ", addrId);
    makePayment();
  }

  function selectCardType(type) {
    if (type === "visa") {
      setCheckedState([true, false]);
    } else if (type === "mastercard") {
      setCheckedState([false, true]);
    }
  }

  const selectAddr = (addrId) => {
    setAddrId(addrId);
  };

  const selectCard = (cardId) => {
    setCardId(cardId);
  };

  return (
    <div
      className="fixed w-screen h-screen bg-[rgba(100,100,100,0.9)] top-0 left-0 overflow-auto transition ease-in-out delay-300"
      style={{ zIndex: 99 }}
    >
      <div className="flex justify-center items-center h-full w-full">
        <div className="mx-8 rounded-lg w-full h-fit bg-white shadow-lg">
          <div className="flex-row justify-center align-center items-center content-center">
            <div className="font-bold text-center self-center text-2xl px-8 w-full my-8">
              Payment Checkout
              <AiOutlineCloseCircle
                className="inline self-center float-right"
                onClick={() => closeModal(false)}
              />
            </div>
            <div className="flex">
              <div className="w-1/2">
                <div className="flex bg-green-500 p-2 mx-4 my-1 text-white font-semibold text-lg">
                  <input
                    type="radio"
                    checked={billMethod === "previous"}
                    onClick={() => selectBillMethod("previous")}
                    className="mr-2"
                  />{" "}
                  Previous billing address
                </div>
                {billMethod == "previous" ? (
                  <Fragment>
                    {addressList?.map((value, index) => (
                      <div className="flex p-2 mx-4 my-1 border-2 shadow-sm font-semibold text-lg">
                        <input
                          type="radio"
                          checked={addrId === value._id}
                          onClick={() => selectAddr(value._id)}
                          className="mr-2"
                        />
                        <div className="grid grid-rows-2">
                          <h5>{`${value.firstName} ${value.lastName}`}</h5>
                          <h5>{`${value.address} #${value.unit} ${value.city} ${value.postalCode}`}</h5>
                        </div>
                      </div>
                    ))}
                  </Fragment>
                ) : null}

                <div className="flex bg-green-700 p-2 mx-4 my-1 text-white font-semibold text-lg">
                  <input
                    type="radio"
                    checked={billMethod === "new"}
                    onClick={() => selectBillMethod("new")}
                    className="mr-2"
                  />{" "}
                  New Billing Address
                </div>
                {billMethod == "new" ? (
                  <Fragment>
                    <div className="border-2 border-green-500 min-h-[300px] m-4 rounded-lg space-y-4 px- pb-4">
                      <span className="absolute font-bold text-green-500 bg-white mt-[-15px] mx-4 px-2">
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
                      <div className="flex flex-wrap w-full h-full mx-4 font-bold">
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
                  </Fragment>
                ) : null}
              </div>
              <div className="w-1/2">
                <div className="flex bg-orange-500 p-2 mx-4 my-1 text-white font-semibold text-lg">
                  <input
                    type="radio"
                    checked={payMethod === "previous"}
                    onClick={() => selectPayMethod("previous")}
                    className="mr-2"
                  />{" "}
                  Previous payment method
                </div>
                {payMethod == "previous" ? (
                  <Fragment>
                    {cardList?.map((value, index) => (
                      <div className="flex p-2 mx-4 my-1 border-2 shadow-sm font-semibold text-lg">
                        <input
                          type="radio"
                          checked={cardId === value._id}
                          onClick={() => selectCard(value._id)}
                          className="mr-2"
                        />
                        <div className="grid grid-rows-2">
                          <h5>{`${value.name}`}</h5>
                          <h5>{`${value.cardType} **** ${value.last4No}, ${value.expiryDate}`}</h5>
                        </div>
                      </div>
                    ))}
                    <div class="flex p-2 mx-4 my-1 mb-6 ">
                      <label
                        for="confirm_password"
                        class=" self-center text-lg mr-2 font-medium text-gray-900 dark:text-gray-300"
                      >
                        Enter 3 digit CVV:
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        class=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••"
                        required
                      />
                    </div>
                  </Fragment>
                ) : null}

                <div className="flex bg-orange-800 p-2 mx-4 my-1 text-white font-semibold text-lg">
                  <input
                    type="radio"
                    checked={payMethod === "new"}
                    onClick={() => selectPayMethod("new")}
                    className="mr-2"
                  />{" "}
                  New Payment Method
                </div>
                {payMethod == "new" ? (
                  <Fragment>
                    <div className="border-2 border-red-500 min-h-[300px] m-4 rounded-lg space-y-4 px-4 pb-4">
                      <span className="absolute font-bold text-red-500 bg-white mt-[-15px] mx-4 px-2">
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
                        <div className="self-center w-32">Card Number</div>
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
                      <div className="flex flex-wrap w-full h-full mx-4 font-bold">
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
                  </Fragment>
                ) : null}
              </div>
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
