import { useEffect, useState } from "react";
import cartsService from "../services/carts";
import {toast} from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CreditCardModal } from "../modals/CreditCardModal";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import { useNav } from "../hooks/useNav";
import { getCartNumber } from "../features/user/userActions";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const [checkout, setCheckout] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [donation, setDonation] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [totalAmount, setTotalAmount] = useState();
  const { userInfo } = useSelector((state) => state.user);
  const {setTab} = useNav();
  const [checkedState, setCheckedState] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTab("cart")
    if (userInfo) {
      getCart();
    } else {
      toast.error("Please login to view cart");
    }
  }, []);

  useEffect(() => {
    getCart();
    dispatch(getCartNumber(localStorage.getItem("userId")));
  },[showModal]);


  useEffect(() => {
    setCheckedState(new Array(cartList.length).fill(false));
  }, cartList);

  useEffect(() => {}, [cartList]);

  // retrieve cart
  const getCart = () => {
    cartsService
      .getCart(userInfo.id)
      .then((response) => {
        console.log(response.data);
        setCartList(response.data.coursesAdded);
        setDonation(response.data.donationAmt);
        setShowDonation(response.data.showDonation);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  };

  function checkOutItems() {
    if (checkout.length > 0 || donation > 0) {
      // save card and return id
      // save address and return address
      // create transaction
      setTotalAmount(
        (
          checkout.reduce(
            (partialSum, a) => partialSum + parseFloat(a.currentPriceTotal),
            0.0
          ) + parseFloat(donation)
        ).toFixed(2)
      );
      console.log(totalAmount, "\n", donation, "\n", checkout);
      setShowModal(true);
    } else {
      toast.error("Select items to checkout");
    }
  }

  // retrieve cart
  const deleteCart = (courseId) => {
    cartsService
      .deleteCart(userInfo.id, courseId)
      .then((response) => {
        setCartList(response.data.coursesAdded);
        toast.success("Items successfully deleted from cart.");
      })
      .catch((e) => {
        console.log(e);
        toast.success("Items failed to deleted from cart.");
      });
  };

  function removeItem(item, position) {
    deleteCart(item.courseId);
    setCheckout([])
  }

  function addToCheckout(item) {
    if (checkout.includes(item)) {
      setCheckout([
        ...checkout.filter((element) => {
          return element !== item;
        }),
      ]);
    } else {
      setCheckout([...checkout, item]);
    }
    console.log("checkout: ", checkout);
  }

  const removeDonations = () => {
    cartsService
      .clearDonationsInCart(userInfo.id)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Donations cleared");
          getCart();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <main className="flex w-full h-full min-h-[600px] px-[40px] lg:px-[120px] pb-[24px] bg-b1 ">
      <div className="flex flex-row flex-wrap w-2/3 h-fit mt-[24px] p-[40px] bg-white rounded">
        <div className="flex flex-col w-full">
          <span className="font-type3 font-medium text-[2vw] text-b3 leading-[32px]">
            Shopping Cart List
          </span>

          <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2" />
        </div>

        <div className="flex flex-row flex-nowrap w-full">
          <table className="flex-row w-full table-auto text-center border-separate">
            <thead>
              <tr>
                <th className="border border-b1">Selection</th>
                <th className="border border-b1">Course</th>
                <th className="border border-b1">Quantity</th>
                <th className="border border-b1">U.P Price</th>
                <th className="border border-b1">Current Price</th>
                <th className="border border-b1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      className="w-[20px] h-[20px]"
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                      onClick={() => addToCheckout(item)}
                    />
                  </td>
                  <td>{item.courseName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.usualPriceTotal}</td>
                  <td>${item.currentPriceTotal}</td>
                  <td>
                    <button
                      className="btn bg-red-500"
                      onClick={() => removeItem(item, index)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div></div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-1/3 h-fit mt-[24px]">
        <div className="flex flex-wrap w-full h-fit bg-white mx-[16px] p-[24px] border-[1px] border-[#E4E5E7] rounded self-start">
          <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
            <span className="font-type1 text-[1.4vw] text-b3 font-bold">
              Shopping Cart{" "}
            </span>
          </div>
          <div className="flex flex-wrap w-full my-4">
            {checkout.map((item, index) => (
              <div
                key={index}
                className="flex flex-row justify-between w-full h-fit"
              >
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
                  {item.courseName}
                </span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">
                  ${item.currentPriceTotal}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap w-full">
            <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2" />

            <div className="flex flex-row justify-between w-full h-fit">
              <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
                Subtotal
              </span>
              <span className="font-type1 text-[1vw] text-b1 font-bold">
                $
                {checkout
                  .reduce(
                    (partialSum, a) =>
                      partialSum + parseFloat(a.usualPriceTotal),
                    0.0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex flex-row justify-between w-full h-fit">
              <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
                Discounts
              </span>
              <span className="font-type1 text-[1vw] text-b1 font-bold">
                - $
                {checkout
                  .reduce(
                    (partialSum, a) =>
                      partialSum +
                      parseFloat(a.usualPriceTotal - a.currentPriceTotal),
                    0.0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex flex-row justify-between w-full h-fit">
              <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
                Total After Discount
              </span>
              <span className="font-type1 text-[1vw] text-b1 font-bold">
                $
                {checkout
                  .reduce(
                    (partialSum, a) =>
                      partialSum + parseFloat(a.currentPriceTotal),
                    0.0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex flex-row justify-between w-full h-fit">
              <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">
                Donations made
              </span>
              <div>
                {donation != 0 ? (
                  <RemoveCircleOutlinedIcon
                    fontSize="small"
                    className="hover:text-red-500 justify-center"
                    onClick={() => removeDonations()}
                  ></RemoveCircleOutlinedIcon>
                ) : null}

                <span className="font-type1 text-[1vw] text-b1 font-bold">
                  ${donation}.00
                </span>
              </div>
            </div>
            <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2" />
            <div className="flex flex-row justify-between w-full h-fit my-2">
              <span className="font-type1 font-bold text-[1vw] text-black leading-[22px] self-center">
                Grand Total
              </span>
              <span className="font-type1 text-[1vw] text-b1 font-bold">
                $
                {(
                  checkout.reduce(
                    (partialSum, a) =>
                      partialSum + parseFloat(a.currentPriceTotal),
                    0.0
                  ) + donation
                ).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="flex w-full h-[40px] rounded-sm bg-red-500 justify-center items-center"
            onClick={() => checkOutItems()}
          >
            <span className="font-type1 font-bold text-[14px] leading-[22px] text-white">
              Checkout Items
            </span>
          </button>
        </div>
      </div>
      {showModal && (
        <CreditCardModal
          closeModal={setShowModal}
          totalAmount={totalAmount}
          donation={donation}
          showDonation={showDonation}
          checkout={checkout}
        />
      )}
    </main>
  );
};

export default Cart;
