import {useEffect, useState} from 'react'


const Cart = () => {
  const [cartList, setCartList] = useState([{
    id: 1,
    courseName: 'Course On Web Security',
    quantity: 2,
    usualPrice: '599.90',
    discountedPrice: '199.90',
  },
  {
    id: 2,
    courseName: 'Course On Getting Good Grades',
    quantity: 50,
    usualPrice: '899.90',
    discountedPrice: '799.90',
  },
  {
    id: 3,
    courseName: 'Course On No Sleep',
    quantity: 10,
    usualPrice: '499.90',
    discountedPrice: '299.90',
  }])
  const [checkout, setCheckout] = useState([])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [checkedState, setCheckedState] = useState(
    new Array(cartList.length).fill(false)
);
  
  function checkOutItems(){
    console.log("call stripe api")
  }

  function removeItem(selection){
    setCartList([...cartList.filter((item)=>{return item.id!==selection})])
  }

  function addToCheckout(item){
    if(checkout.includes(item)){
      setCheckout([...checkout.filter((element)=>{return element!==item})])
    }else{
      setCheckout([...checkout, item])
    }
  }

  

  return (
    <main className="flex w-full h-full px-[40px] lg:px-[120px] pb-[24px] bg-b1 ">
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
      <td><input type="checkbox" className="w-[20px] h-[20px]" onClick={()=>addToCheckout(item)}/></td>
      <td>{item.courseName}</td>
      <td>{item.quantity}</td>
      <td>${item.usualPrice}</td>
      <td>${item.discountedPrice}</td>
      <td><button className='btn bg-red-500' onClick={()=>removeItem(item.id)}>delete</button></td>

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
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">{item.courseName}</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">${item.discountedPrice}</span>
              </div>
            ))}
            </div>

            <div className="flex flex-wrap w-full">
            <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2"/>
              
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Discounts</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">$0.00</span>
                </div>
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Donated ($1 per $10)</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">$0.00</span>
                </div>
                <div className="flex flex-row justify-between w-full h-fit">
                <span className="font-type1 font-bold text-[1vw] text-[#55585D] leading-[22px] self-center">Subtotal</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">$0.00</span>
                </div>
                <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2"/>
                <div className="flex flex-row justify-between w-full h-fit my-2">
                <span className="font-type1 font-bold text-[1vw] text-black leading-[22px] self-center">Grand Total</span>
                <span className="font-type1 text-[1vw] text-b1 font-bold">$0.00</span>
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
      
    </main>
  )
}

export default Cart