import React, { Fragment, useState, useEffect } from "react";
import { AiOutlineQuestionCircle, AiOutlineCloseCircle } from "react-icons/ai";
import validator from "validator";
import { toast } from "react-toastify";
import paymentsService from "../services/payment";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../services/accounts";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsShieldLockFill } from "react-icons/bs";
import { useCreditCardValidator } from "react-creditcard-validator";

export const CreditCardModal = ({
  closeModal,
  totalAmount,
  donation,
  showDonation,
  checkout,
}) => {
  const [checkedState, setCheckedState] = useState([true, false]);
  const { userInfo } = useSelector((state) => state.user);

  //for otp modal
  const [otp, setOtp] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [payMethod, selectPayMethod] = useState("previous");
  const [billMethod, selectBillMethod] = useState("previous");
  const [cardList, setCardList] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [cardId, setCardId] = useState();
  const [addrId, setAddrId] = useState();
  const [existLast4No, setExistLast4No] = useState();
  const [existCardType, setExistCardType] = useState();
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  let cardType = "";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    getMethods();

    return () => {
      // Anything in here is fired on component unmount.
      document.body.style.overflow = "unset";
    };
  }, []);

  const getMethods = () => {
    paymentsService
      .getMethods(userInfo.id)
      .then((response) => {
        if (response.status == 200) {
          setAddressList(response.data.billAddrs);
          setCardList(response.data.filteredCards);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          return toast.error(error.response.data.message);
        } else {
          return toast.error(error.message);
        }
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

  const makePayment = async () => {
    const filteredCart = prepareCheckoutCart();
    if (checkedState[0] == true) {
      cardType = "VisaCard";
    } else {
      cardType = "MasterCard";
    }
    let reqLast4No = "";
    let reqCardType = "";
    if (existCardType) {
      reqCardType = existCardType;
    } else {
      reqCardType = cardType;
    }
    if (existLast4No) {
      reqLast4No = existLast4No;
    } else {
      reqLast4No = cardNumber.slice(-4);
    }

    const payload = {
      accountId: userInfo.id,
      donationAmount: donation,
      showDonation: showDonation,
      totalAmount: totalAmount,
      cardId: cardId,
      billAddressId: addrId,
      checkedOutCart: filteredCart,
      last4No: reqLast4No,
      cardType: reqCardType,
    };
    await paymentsService
      .makePayment(payload)
      .then((response) => {
        if (response.status == 200) {
          setModalOpen(false);
          closeModal(false);
          toast.success("Payment has been made successfully!");
          // await timeout(100);
          // window.location.reload(false);
        } else {
          toast.error("Payment failed!");
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  function handleOtp(event) {
    setOtp(event.target.value);
  }

  function confirmPayment() {
    if (payMethod == "previous" && !cardId && !addrId) {
      toast.error(
        "Please select an address and payment method to proceed with payment."
      );
      return;
    }
    if (payMethod == "previous" && !cardId) {
      toast.error("Please select a payment method to proceed with payment");
      return;
    }
    if (billMethod == "previous" && !addrId) {
      toast.error("Please select a billing address to proceed with payment");
      return;
    }
    if (
      payMethod == "new" &&
      typeof erroredInputs.cardNumber !== "undefined" &&
      typeof erroredInputs.cvc !== "undefined" &&
      typeof erroredInputs.expiryDate !== "undefined"
    ) {
      toast.error("Error filling up card details.");
      return;
    }
    if (payMethod == "previous" && cvv.length != 3) {
      toast.error("Please enter the 3 digit cvv.");
      return;
    }
    setModalOpen(true);
  }

  // for otp submit
  const submitOtpForm = () => {
    const payload = { userId: userInfo.id, token: otp };
    authService
      .verify2FA(payload)
      .then((response) => {
        if (response.status == 200) {
          setLoading(true);
          makePayment();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          return toast.error(error.response.data.message);
        }  else {
          return toast.error(error.message);
        }
      });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //Handle form for address
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    unit: "",
    city: "",
    postalCode: "",
  });
  const [saveAddrStatus, setSaveAddrStatus] = useState();
  const { firstName, lastName, address, unit, city, postalCode } = addressForm;

  const onChangeAddr = (e) => {
    setAddressForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onAddrSubmit = (data) => {
    if (billMethod == "new" && !validator.isPostalCode(postalCode, "SG")) {
      toast.error("Enter valid Postal Code!");
      return;
    }
    paymentsService
      .addAddr(userInfo.id, addressForm)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Successfully save new address.");
          setAddrId(res.data.id);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  //Handle form for card
  const [cardForm, setCardForm] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
  });
  const [saveCardStatus, setSaveCardStatus] = useState();
  const { name, cardNumber, expiryDate } = cardForm;

  const onChangeCard = (e) => {
    setCardForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onCardSubmit = (data) => {
    if (checkedState[0] == true) {
      cardType = "VisaCard";
    } else {
      cardType = "MasterCard";
    }
    const request = { name, cardNo: cardNumber, cardType, expiryDate };
    paymentsService
      .addCard(userInfo.id, request)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Successfully save new card.");
          setCardId(res.data.id);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const selectAddr = (addrId) => {
    setAddrId(addrId);
  };

  const selectCard = (card) => {
    setCardId(card._id);
    setExistCardType(card.cardType);
    setExistLast4No(card.last4No);
  };

  function selectCardType(type) {
    if (type === "visa") {
      // cardType = "Visa Card"
      setCheckedState([true, false]);
    } else if (type === "mastercard") {
      setCheckedState([false, true]);
      // cardType = "Master Card"
    }
  }

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  /////////// Input Validations
  const {
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
    meta: { erroredInputs },
  } = useCreditCardValidator();

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
                    <form onSubmit={handleSubmit(onAddrSubmit)}>
                      <div className="border-2 border-green-500 min-h-[300px] m-4 rounded-lg space-y-4 px- pb-4">
                        <span className="absolute font-bold text-green-500 bg-white mt-[-15px] mx-4 px-2">
                          Billing address
                        </span>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">First Name</div>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            required
                            placeholder="First Name"
                            className="p-2 border-2 border-black w-40"
                            onChange={onChangeAddr}
                          />
                          <div className="self-center">Last Name</div>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            required
                            placeholder="Last Name"
                            className="p-2 border-2 border-black w-40"
                            onChange={onChangeAddr}
                          />
                        </div>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">Street Address</div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            value={address}
                            placeholder="Drive 3 Street 4"
                            className="p-2 border-2 border-black w-80"
                            onChange={onChangeAddr}
                          />
                        </div>

                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">House Number</div>
                          <input
                            type="text"
                            id="unit"
                            name="unit"
                            required
                            max="20"
                            placeholder="Unit No"
                            className="p-2 border-2 border-black w-80"
                            onChange={onChangeAddr}
                            value={unit}
                          />
                        </div>

                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">City</div>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            max="20"
                            value={city}
                            placeholder="Singapore"
                            className="p-2 border-2 border-black w-80"
                            onChange={onChangeAddr}
                          />
                        </div>

                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">Postal Code</div>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={postalCode}
                            required
                            min="6"
                            max="6"
                            placeholder="postal code"
                            className="p-2 border-2 border-black w-80"
                            onChange={onChangeAddr}
                          />
                        </div>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold">
                          <input
                            type="checkbox"
                            className="w-[20px] h-[20px] self-center mr-4"
                            id="saveAddrStatus"
                            name="saveAddrStatus"
                            defaultChecked={saveAddrStatus}
                            onChange={(e) => setSaveAddrStatus(!saveAddrStatus)}
                          />
                          <span className="self-center">
                            Save billing address for future purchases
                            <AiOutlineQuestionCircle className="inline ml-2" />
                          </span>
                        </div>
                        {saveAddrStatus ? (
                          <input
                            type="submit"
                            className="btn ml-4 w-3/4 bg-green-800"
                            value="Save Address"
                          />
                        ) : null}
                      </div>
                    </form>
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
                          onClick={() => selectCard(value)}
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
                        max="3"
                        class=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••"
                        required
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value);
                        }}
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
                    <form onSubmit={handleSubmit(onCardSubmit)}>
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
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChangeCard}
                            required
                            placeholder="Card Holder Name"
                            className="p-2 border-2 border-black w-80"
                          />
                        </div>

                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">Card Number</div>
                          <input
                            type="number"
                            id="cardNumber"
                            name="cardNumber"
                            required
                            maxLength={19}
                            // onChange={onChangeCard}
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="p-2 border-2 border-black w-80"
                            defaultValue={cardNumber}
                            {...getCardNumberProps({onChange: (e) => onChangeCard(e)})}
                          />
                          <span className="text-red-500 self-center">
                            {erroredInputs.cardNumber &&
                              erroredInputs.cardNumber}
                          </span>
                        </div>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">
                            Expiration date
                          </div>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            required
                            placeholder="mm/yyyy"
                            defaultValue={expiryDate}
                            onChange={onChangeCard}
                            className="p-2 border-2 border-black w-40"
                            {...getExpiryDateProps({
                              onChange: (e) => onChangeCard(e),
                            })}
                          />
                          <span className="text-red-500 self-center">
                            {erroredInputs.expiryDate &&
                              erroredInputs.expiryDate}
                          </span>
                        </div>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold space-x-4">
                          <div className="self-center w-32">CVV</div>
                          <input
                            type="password"
                            name="holder name"
                            required
                            maxLength={3}
                            placeholder="***"
                            className="p-2 border-2 border-black w-14"
                            {...getCVCProps()}
                          />

                          <span className="text-red-500 self-center">
                            {erroredInputs.cvc && erroredInputs.cvc}
                          </span>
                        </div>
                        <div className="flex flex-wrap w-full h-full mx-4 font-bold">
                          <input
                            type="checkbox"
                            defaultChecked={saveCardStatus}
                            onChange={(e) => setSaveCardStatus(!saveCardStatus)}
                            className="w-[20px] h-[20px] self-center mr-4"
                          />
                          <span className="self-center">
                            Save card details for future purchases
                            <AiOutlineQuestionCircle className="inline ml-2" />
                          </span>
                        </div>
                        {saveCardStatus ? (
                          <input
                            type="submit"
                            className="btn ml-4 w-3/4 bg-red-800"
                            value="Save Card"
                          />
                        ) : null}
                      </div>
                    </form>
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
      {modalOpen ? (
        <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
          <div className="flex  justify-center items-center h-full w-full">
            <div className="flex-column w-1/3 h-auto bg-white rounded-lg shadow-lg m-[16px]">
              <div className="flex w-full rounded-lg h-1/5 px-[16px]">
                <div className="ml-2 mt-2 text-black text-center w-full self-center text-[24px]">
                  2 Factor Authentication
                </div>

                <button
                  className="text-[black] bg-transparent text-[24px]"
                  onClick={() => setModalOpen(false)}
                >
                  <AiOutlineCloseSquare />
                </button>
              </div>
              <form
                onSubmit={handleSubmit(submitOtpForm)}
                className="mx-5, my-5 flex justify-center"
              >
                <div className="flex flex-col items-center  rounded-lg">
                  <div className="flex flex-nowrap w-full justify-center mt-4">
                    <span className="self-center w-1/4 h-[40px] bg-b1 rounded-l">
                      <div className="flex w-full h-full content-center justify-center">
                        <BsShieldLockFill className="self-center text-w1" />
                      </div>
                    </span>
                    <input
                      className="flex w-3/4 h-[40px] input"
                      maxLength={7} // Code is 7 digits
                      type="password"
                      {...register("code", {
                        required: true,
                        pattern: /^[0-9]*$/,
                      })} // [Validation] Number only
                      placeholder="Token"
                      value={otp}
                      onChange={handleOtp}
                    />
                  </div>
                  <h2>Enter token from your authentication app</h2>
                  <div className="flex flex-nowrap w-full justify-center mt-4">
                    {errors.code && (
                      <div>
                        <p style={{ color: "red" }}>
                          <b>Invalid format, numbers only</b>
                        </p>
                      </div>
                    )}
                  </div>
                  {loading ? (
                    <div
                      class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  ) : null}
                  <div className="flex flex-col w-full space-y-2 mt-6">
                    <button
                      className="p-2 w-full rounded bg-success text-w1 font-bold"
                      type="submit"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
