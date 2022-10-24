import {useEffect, useState, useCallback} from 'react'
import cartsService from "../services/carts";
import { CreditCardModal } from '../modals/CreditCardModal'
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, getCartNumber } from "../features/user/userActions";
import toast from 'react-hot-toast';

const Cart = () => {
  const [showModal, setShowModal] = useState(false)
  const { userInfo, userId } = useSelector((state) => state.user);
  const [cartList, setCartList] = useState([])
  const [checkout, setCheckout] = useState([])
  const dispatch = useDispatch();

  // retrieve cart
const getCart = useCallback(() => {
  if(userInfo){
    cartsService
    .getCart(userId)
    .then((response) => {
      setCartList(response.data.coursesAdded);
      console.log(response.data.coursesAdded)
    })
    .catch((e) => {
      console.log(e);
    });
  }else{
    toast.error("Please login to view your cart")
  }
  
},[userInfo, userId]);

  useEffect(() => {
    window.scrollTo(0, 0)
    getCart();
  }, [userInfo, getCart])

  const [checkedState, setCheckedState] = useState(
    new Array(cartList.length).fill(false)
);

const handleOnChange = (position) => {
  const updatedCheckedState = checkedState.map((item, index) =>
    index === position ? !item : item
  );

  setCheckedState(updatedCheckedState);

};


  
  function checkOutItems(){
    console.log("call stripe api")
    if (checkout.length > 0){
    setShowModal(true)
    }else{
      toast.error('Select items to checkout');
    }

  }

  function removeItem(item, position){
    cartsService
      .deleteCart(userId, item.courseId)
      .then((response) => {
        console.log(response.data);
        setCartList(response.data.coursesAdded);
        const updatedCheckedState = checkedState.map((item, index) =>
    index === position ? !item : item
  );

  setCheckedState(updatedCheckedState);
    if(checkout.includes(item)){
      setCheckout([...checkout.filter((element)=>{return element!==item})])
    }
    
    setCartList([...cartList.filter((element)=>{return element!==item})])
        toast.success("Items successfully deleted from cart.");
      })
      .catch((e) => {
        console.log(e);
        toast.success("Items failed to deleted from cart.");
      });
      dispatch(getCartNumber(userId));
    
  }

  function addToCheckout(item){
    if(checkout.includes(item)){
      setCheckout([...checkout.filter((element)=>{return element!==item})])
    }else{
      setCheckout([...checkout, item])
    }
  }

  

  return (
    <main className="flex w-full h-full min-h-[600px] px-[40px] lg:px-[120px] pb-[24px] bg-b1 ">
      <div className="flex flex-row flex-wrap w-2/3 h-fit mt-[24px] p-[40px] bg-white rounded">
        <div className="flex flex-col w-full">
          <span className="font-type3 font-medium text-[2vw] text-b3 leading-[32px]">
            Shopping Cart List
          </span>
          
          <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2"/>
        </div>
        

        <div className="flex flex-row flex-nowrap w-full">
          <table className='flex-row w-full table-auto text-center border-separate'>
        <thead>
    <tr>
      <th className='border border-b1'>Selection</th>
      <th className='border border-b1'>Course</th>
      <th className='border border-b1'>Quantity</th>
      <th className='border border-b1'>U.P Price</th>
      <th className='border border-b1'>Current Price</th>
      <th className='border border-b1'>Actions</th>

    </tr>
  </thead>
  <tbody>
    {cartList.map((item, index) => (
      <tr key={index}>
      <td><input type="checkbox" className="w-[20px] h-[20px] mt-4" checked={checkedState[index]}
  onChange={() => handleOnChange(index)} onClick={()=>addToCheckout(item)}/></td>
      <td>{item.courseName}</td>
      <td>{item.quantity}</td>
      <td>${item.usualPriceTotal}</td>
      <td>${item.currentPriceTotal}</td>
      <td><button className='btn bg-red-500' onClick={()=>removeItem(item, index)}>delete</button></td>

    </tr>
    ))}
    
    </tbody>
  </table>
          <div>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-1/3 h-fit mt-[24px]">
        
      <div className="flex flex-wrap w-full h-fit bg-white mx-[16px] p-[24px] border-[1px] border-[#E4E5E7] rounded self-start">

        


        <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
        <span className="font-type1 text-[1.4vw] text-b3 font-bold">Shopping Cart </span>
        </div>
        <div className="flex flex-wrap w-full my-4">
            {checkout.map((item, index) => (
              <div key={index} className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">{item.courseName} x{item.quantity}</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">${item.usualPriceTotal}</span>
              </div>
            ))}
            </div>

            <div className="flex flex-wrap w-full">
            <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2"/>
              
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Subtotal</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">${checkout.reduce((partialSum, a) => partialSum + parseFloat(a.usualPriceTotal), 0.00).toFixed(2)}</span>
                </div>
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Discounts</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">- ${checkout.reduce((partialSum, a) => partialSum + parseFloat(a.usualPriceTotal - a.currentPriceTotal), 0.00).toFixed(2)}
                </span>     
                </div>
                <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2"/>
                <div className="flex flex-row justify-between w-full h-fit my-2">
                <span className="font-type1 font-bold text-[1vw] text-black leading-[22px] self-center">Grand Total</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">${checkout.reduce((partialSum, a) => partialSum + parseFloat(a.currentPriceTotal), 0.00).toFixed(2)}</span>
                </div>
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Donated ($1 per $10)</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">${(checkout.reduce((partialSum, a) => partialSum + parseFloat(a.currentPriceTotal), 0.00)/10).toFixed(0)}</span>
                </div>
                
            </div>

        <button
          className="flex w-full h-[40px] rounded-sm bg-green-500 justify-center items-center mt-4"
          onClick={() => checkOutItems()}
        >
          <span className="font-type1 font-bold text-[14px] leading-[22px] text-white">
            Checkout Items
          </span>
        </button>

      </div>
      </div>
      {showModal && <CreditCardModal closeModal={setShowModal}/>}
    </main>
  )
}

export default Cart