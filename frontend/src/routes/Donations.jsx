import { useEffect, useRef, useState } from "react";
import {toast} from "react-toastify";
import { BsAward } from "react-icons/bs";
import Banner from "../assets/images/donation banner.png";
import cartsService from "../services/carts";
import { useDispatch, useSelector } from "react-redux";
import donationsService from "../services/donations";
import { useNav } from "../hooks/useNav";

function Donations() {
  const { userInfo } = useSelector((state) => state.user);
  const [showDonation, setShowDonation] = useState("on");
  const [top5List, setTop5List] = useState([]);
  const [top10List, setTop10List] = useState([]);
  const [total, setTotal] = useState(0);
  const offerAmtRef = useRef(0.0);
  const { setTab } = useNav();

  const dispatch = useDispatch();
  
  useEffect(() => {
    window.scrollTo(0, 0);
      getTop5();
      getTop10();
      getTotal();
      window.scrollTo(0, 0);
    setTab("donate");
  },[]);



  const getTop5 = () => {
    donationsService.getTop5().then((response) => {
      if (response.status == 200) {
        setTop5List(response.data);
      }
    });
  };

  const getTop10 = () => {
    donationsService.getTop10().then((response) => {
      if (response.status == 200) {
        setTop10List(response.data);
      }
    });
  };

  const getTotal = () => {
    donationsService.getTotal().then((response) => {
      if (response.status == 200){
        setTotal(response.data.total)
      }
    })
  }

  function handleDonationChange(e) {
    if (e.key !== "Backspace") {
      if (offerAmtRef.current.value.includes(".")) {
        if (offerAmtRef.current.value.split(".")[1].length >= 2) {
          var num = parseFloat(offerAmtRef.current.value);
          var cleanNum = num.toFixed(2);
          offerAmtRef.current.value = cleanNum;
          e.preventDefault();
        }
      }
    }
  }

  const handleAnnonymous = (e) => {
    if (e.target.value === "on") {
      e.target.value = "off";
    } else {
      e.target.value = "on";
    }
    setShowDonation(e.target.value);
  };

  function addToCart() {
    if(offerAmtRef.current.value >9999999){
      toast.info('Please enter a valid amount less than 10 million') 
    }
    if (userInfo) {
      addDonation();
    } else {
      toast.error("Please login to continue");
    }
  }

  const addDonation = () => {
    let showName = false;
    if (showDonation == "on") {
      showName = false;
    } else {
      showName = true;
    }
    cartsService
      .addDonationToCart(userInfo.id, offerAmtRef.current.value, showName)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          toast.success("Donations added into cart.");
        } else {
          toast.error(response.data);
        }
      })
      .catch((e) => {
        toast.error("Error adding donations")
      });
  };

  return (
    <main className="flex w-full h-full px-[40px] lg:px-[120px] pb-[24px] bg-b1 items-center">
      <div className="flex flex-row flex-wrap w-2/3 h-[600px] mt-[24px] p-[40px] bg-white rounded">
        <div className="flex flex-col w-full">
          <span className="font-type3 font-medium text-[2vw] text-b3 leading-[32px]">
            {"A Learn4Fund donation drive"}
          </span>
          <div className="flex flex-row flex-nowrap w-full m-[2px]">
            <div className="flex w-1/2">
              <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                Funds Raised: &nbsp;
              </span>
              <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                ${total}
              </span>
            </div>

            <div className="flex w-1/2 justify-end">
              <span className="font-type1 font-normal text-[1.5vw] lg:text-[1rem] leading-[20px] text-[#55585D]">
                Fundraising Deadline: &nbsp;
              </span>
              <span className="font-type1 font-bold text-[1.5vw] lg:text-[1rem] leading-[20px]">
                {"2022-12-31"}
              </span>{" "}
            </div>
          </div>

          <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2" />
        </div>
        <div className="flex flex-col w-full h-[240px] lg:h-[320px] my-[16px]">
          <div className="flex w-full h-full justify-center">
            <img src={Banner} alt={""} />
          </div>
        </div>
        <hr className="flex flex-wrap w-full border-1 border-[black] self-center m-2" />

        <div className="flex flex-col flex-wrap w-full h-auto align-start self-start content-start justify-start text-start">
          <div>
            <span className="font-type2 font-normal text-[1vw] leading-[22px]">
              At Learn4Fund, we pledge our support to helping the
              underpriviledged in Singapore receive the education they deserve.
              We believe that education is the key to a better future, and we
              hope to help as many people as we can. With your help, we can give
              the gift of education to those who need it most. Every single
              dollar counts, and we thank you for your generosity.
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-1/3 h-[600px] mt-[24px]">
        <div className="flex flex-wrap w-full h-fit bg-white mx-[16px] p-[24px] border-[1px] border-[#E4E5E7] rounded self-start">
          <div className="flex flex-nowrap w-full">
            <div className="font-type1 w-1/2 font-bold text-[1vw] text-success leading-[22px] self-center">
              Pledge to donate:
            </div>

            <div className="flex h-full w-1/2 border-2 border-b2 justify-center text-center">
              <input
                className="font-type1 font-normal text-[1.5vw] leading-[20px] w-full  text-center self-center"
                type="number"
                step=".01"
                ref={offerAmtRef}
                defaultValue={offerAmtRef.current}
                onKeyDown={(e) => {
                  handleDonationChange(e);
                }}
              />
            </div>
          </div>
          <hr className="flex flex-wrap w-full border-1 border-[#55585D] self-center my-2" />

          <div className="font-type1 font-bold text-[1vw] leading-[22px] self-center">
            <input
              type="checkbox"
              defaultChecked
              className="mr-2 self-center"
              onChange={(e) => handleAnnonymous(e)}
            />
          </div>
          <div className="font-type1 font-bold text-[1vw] leading-[22px] self-center my-2">
            Choose to donate anonymously
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

        <div className="flex flex-row flex-wrap w-full h-auto bg-white rounded mx-[16px] p-[24px]">
          <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
            <span className="font-type1 text-[1.4vw] text-b3 font-bold">
              Top Donators{" "}
            </span>
          </div>

          <div className="flex flex-wrap w-full h-fit py-2 content-start">
            <div className="flex-row flex-wrap w-full h-fit text-[1vw]">
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  <BsAward className="self-center text-yellow-500" />
                  {top5List.length >= 1
                    ? `${top5List[0].name} - $${top5List[0].amount}`
                    : null}
                </div>
                <div>{top5List.length >= 1 ? `${top5List[0].date}` : null}</div>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  <BsAward className="self-center text-gray-500" />
                  {top5List.length >= 2
                    ? `${top5List[1].name} - $${top5List[1].amount}`
                    : null}
                </div>
                <div>{top5List.length >= 2 ? `${top5List[1].date}` : null}</div>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  <BsAward className="self-center text-brown-500" />
                  {top5List.length >= 3
                    ? `${top5List[2].name} - $${top5List[2].amount}`
                    : null}
                </div>
                <div>{top5List.length >= 3 ? `${top5List[2].date}` : null}</div>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  <BsAward className="self-center text-brown-500" />
                  {top5List.length >= 4
                    ? `${top5List[3].name} - $${top5List[3].amount}`
                    : null}
                </div>
                <div>{top5List.length >= 4 ? `${top5List[3].date}` : null}</div>
              </div>
              <div className="flex w-full justify-between">
                <div className="flex flex-nowrap font-type1 font-bold">
                  <BsAward className="self-center text-brown-500" />
                  {top5List.length >= 5
                    ? `${top5List[4].name} - $${top5List[4].amount}`
                    : null}
                </div>
                <div>{top5List.length >= 5 ? `${top5List[4].date}` : null}</div>
              </div>
            </div>
          </div>

          <div className="flex w-full h-fit border-b-[2px] border-b3 shadow-price-quote">
            <span className="font-type1 text-[1.4vw] text-b3 font-bold">
              Recent Donations{" "}
            </span>
          </div>

          <div className="flex flex-wrap w-full h-[184px] overflow-y-auto py-2 content-start">
            <div className="flex-row flex-wrap w-full h-fit text-[1vw] ">
              {top10List.map((value) => (
                <div className="flex w-full justify-between">
                  <div className="flex flex-nowrap font-type1 font-bold">
                    {value.name} - ${value.amount}
                  </div>
                  <div>{value.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Donations;
