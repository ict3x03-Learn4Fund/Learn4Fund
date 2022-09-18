import {useState, useEffect} from 'react'
import { BsAward } from 'react-icons/bs'
import Banner from '../assets/images/donation banner.png'

function Donations() {
  const [donationAmount, setDonationAmount] = useState(0.00)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  function handleDonationChange(event) {
    setDonationAmount(event.target.value)
  }
  function addToCart(){
    console.log("added to cart")
  }
  return (
    <main className="flex w-full h-full px-[40px] lg:px-[120px] pb-[24px] bg-b1 items-center">
      <div className="flex flex-row flex-wrap w-2/3 h-auto mt-[24px] p-[16px] bg-white rounded self-start">
        <div className="flex flex-col w-full">
          <span className="font-type2 font-medium text-[2vw] text-b3 leading-[32px]">
            {'A Learn4Fund donation drive'}
          </span>
          <div className="flex flex-row flex-nowrap w-full m-[2px]">
              <div className="flex w-1/2">
                
                <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                  Funds Raised: &nbsp;
                </span>
                <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                  ${"1000000"}
                </span>
              </div>
      
              <div className="flex w-1/2 justify-end">
              <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                  Fundraising Deadline: &nbsp;
                </span>
                <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                  {'2022-12-31'}
                </span>{" "}
              </div>
          </div>
          
          <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2"/>

        </div>
        <div className="flex flex-col w-full h-[240px] lg:h-[320px] my-[16px]">
          <div className="flex w-full h-full justify-center">
            <img
              src={
                Banner
              }
              alt={""}
            />
          </div>
        </div>
        <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2"/>

        <div className="flex flex-col flex-wrap w-full h-auto align-start self-start content-start justify-start text-start">
          
          
          <div>
            <span className="font-type2 font-normal text-[1vw] leading-[22px]">
              At Learn4Fund, we pledge our support to helping the underpriviledged in Singapore receive the education they deserve. We believe that education is the key to a better future, and we hope to help as many people as we can.
              With your help, we can give the gift of education to those who need it most. Every single dollar counts, and we thank you for your generosity.
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-1/3 h-auto space-y-8 self-start">
        
      <div className="flexcontent-start w-full h-fit bg-white mt-[24px] py-[16px] mx-[16px] px-[24px] border-[1px] border-[#E4E5E7] rounded self-start">

        <div className="flex flex-nowrap w-full">
          <div className="font-type1 w-1/2 font-bold text-[1vw] text-success leading-[22px] self-center">
            Pledge to donate:
          </div>
          
            <div className="flex h-full w-1/2 border-2 justify-center text-center">
              <input
                className="font-type1 font-normal text-[12px] leading-[20px] w-full text-center self-center"
                value={donationAmount}
                onChange={handleDonationChange}
              />
            </div>
            
        </div>
        <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2"/>


        <div className="flex justify-center">

<div className="font-type1 font-bold text-[1vw] leading-[22px] self-center"><input type="checkbox" className="mr-2"/></div>
<div className="font-type1 font-bold text-[1vw] leading-[22px] self-center my-2">Choose to donate anonymously</div>

</div>
        <button
          className="flex w-full h-[40px] rounded-sm bg-b3 justify-center items-center"
          onClick={() => addToCart()}
        >
          <span className="font-type1 font-normal text-[14px] leading-[22px] text-white">
            Add to Cart
          </span>
        </button>
        

      </div>

      <div className="flex flex-row flex-wrap w-full h-auto bg-white rounded mt-[24px] mx-[16px] p-[24px]">
      <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
        <span className="font-type1 text-[1.4vw] text-b3 font-bold">Top Donators </span>
        </div>

        <div className="flex flex-wrap w-full h-fit py-2 content-start">
          <div className="flex-row flex-wrap w-full h-fit text-[1vw]">
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            <BsAward className='self-center text-yellow-500'/>
            Jisoo - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
          <BsAward className='self-center text-gray-500'/>
            Jennie - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
          <BsAward className='self-center text-brown-500'/>
            Lisa - $10
          </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
          <BsAward className='self-center text-brown-500'/>
            Rose - $10
          </div>
          <div>14/9</div>
        </div>
        </div>

        </div>

      <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
        <span className="font-type1 text-[1.4vw] text-b3 font-bold">Recent Donations </span>
        </div>
        
        
        <div className="flex flex-wrap w-full h-[184px] overflow-y-scroll py-2 content-start">
          <div className="flex-row flex-wrap w-full h-fit text-[1vw]">
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Sana - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Momo - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            ****** - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Jeongyeon - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Dahyun - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            ****** - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Jihyo - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Nayeon - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            Mina - $5
        </div>
          <div>14/9</div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">
            John - $5
        </div>
          <div>14/9</div>
        </div>
        </div>
        <div className="flex-row flex-wrap w-full h-fit text-[1vw]">
        <div className="flex w-full justify-between">
          <div className="flex flex-nowrap font-type1 font-bold">******** - $10
          </div>
          <div>14/9</div>
        </div>
        </div>
        </div>
        
      </div>
      </div>
      
    </main>
  )
}

export default Donations