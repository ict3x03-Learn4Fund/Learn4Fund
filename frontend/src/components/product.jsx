import React, { useEffect, useState } from "react";
import { BsDash, BsPlus } from "react-icons/bs";
import dataProducts from "../assets/datasets/products.json";
// TODO: temporary carousell images
import subimage1 from "../assets/images/Group 1338.png";
import subimage2 from "../assets/images/Group 1340.png";
import subimage3 from "../assets/images/Product img thumbnail 2.png";

import { useParams, useNavigate } from "react-router-dom";

function ProductPage() {
  const parse = require("html-react-parser");
  const [quantitySelected, setQuantitySelected] = useState(0);
  const { productid } = useParams();
  let navigate = useNavigate();

  let [productDetails, setProductDetails] = useState({});
  productDetails = dataProducts.find((element) => element.id === productid);

  // Add quantity to const variable
  function handleChange(event) {
    setQuantitySelected(event.target.value);
  }

  // Check if there is any cart items in session storage
  useEffect(() => {
    let sessionItems = sessionStorage.getItem("cartItems");
    if (sessionItems > 0) {
      setQuantitySelected(sessionItems);
    } else {
      setQuantitySelected(0);
    }
  }, []);

  // save quantity to cart
  function addToCart() {
    console.log("save to cart");
    sessionStorage.setItem("cartItems", quantitySelected);
    navigate(0);
  }

  return (
    <main className="flex w-full h-full px-[120px] pb-[119px] bg-[#EFEFF0] items-center">
      <div className="flex flex-row flex-wrap w-2/3 h-auto mt-[24px] p-[16px] bg-white space-y-[8px] self-start">
        <div className="flex flex-col w-full border-b-[1px]">
          <span className="font-roboto font-medium text-[24px] leading-[32px]">
            {productDetails.title}
          </span>
          <div className="flex flex-row flex-nowrap w-full h-[56px] py-[4px]">
            <img
              src={
                productDetails &&
                productDetails.metadata &&
                productDetails.metadata.brandImage
              }
              className="w-[100px] max-h-[48px] rounded"
              alt={""}
            />
            <div className="flex flex-col flex-nowrap mx-[16px]">
              <div className="flex">
                <span className="font-roboto font-normal text-[12px] leading-[20px] text-[#55585D]">
                  Model: &nbsp;
                </span>
                <span className="font-roboto font-normal text-[12px] leading-[20px] text-[#2A64DB]">
                  {productDetails &&
                    productDetails.metadata &&
                    productDetails.metadata.brand}
                </span>{" "}
              </div>
              <div>
                <span className="font-roboto font-normal text-[12px] leading-[20px] text-[#55585D]">
                  Brand: &nbsp;
                </span>
                <span className="font-roboto font-normal text-[12px] leading-[20px] text-[#2A64DB]">
                  {productDetails &&
                    productDetails.metadata &&
                    productDetails.metadata.model}
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-[425px] mt-[16px] border-b-[1px]">
          <div className="flex w-full h-5/6 justify-center">
            <img
              src={
                productDetails &&
                productDetails.images[0] &&
                productDetails.images[0].url
              }
              alt={""}
            />
          </div>
          <div className="flex flex-row w-full h-1/6 justify-center items-center space-x-[8px]">
            <img
              src={subimage1}
              alt={""}
              className="w-[50px] h-[50px] border-[1px] border-[#2A64DB]"
            />
            <img
              src={subimage3}
              alt={""}
              className="w-[50px] h-[50px] border-[1px] border-[#E4E5E7]"
            />
            <img
              src={subimage2}
              alt={""}
              className="w-[50px] h-[50px] border-[1px] border-[#E4E5E7]"
            />
          </div>
        </div>
        <div className="flex flex-col flex-wrap w-full h-auto align-start self-start content-start justify-start text-start my-[16px]">
          <span className="font-roboto font-bold text-[20px] leading-[28px] tracking-[0.3px] text-[#242528]">
            Product Description
          </span>
          <span className="font-roboto font-bold text-[16px] leading-[20px] my-[16px] text-[#55585D]">
            Specification
          </span>
          <div>
            <span className="font-roboto font-normal text-[14px] leading-[22px]">
              {parse(productDetails.descriptionHtml)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap content-start w-1/3 h-[250px] bg-white mt-[24px] py-[16px] mx-[16px] px-[24px] border-[1px] border-[#E4E5E7] rounded self-start">
        <div className="flex w-full h-fit">
          <span className="self-start font-roboto font-bold text-[20px] leading-[28px] text-[#2A64DB] tracking-[0.3px]">
            {productDetails.currencySymbol}
          </span>
          <span className="font-roboto font-medium text-[#2A64DB] text-[30px] leading-[38px]">
            {productDetails.lowPrice && productDetails.lowPrice.toFixed(2)}
          </span>{" "}
          {productDetails.highPrice ? (
            <span className="mx-[4px]">–</span>
          ) : null}
          <span className="self-start font-roboto font-bold text-[20px] leading-[28px] text-[#2A64DB] tracking-[0.3px]">
            {productDetails.highPrice && productDetails.currencySymbol}
          </span>
          <span className="font-roboto font-medium text-[#2A64DB] text-[30px] leading-[38px]">
            {productDetails.highPrice && productDetails.highPrice.toFixed(2)}
          </span>
        </div>
        <hr className="items-start h-auto w-full border-dashed border-b-[1px] border-[#E4E5E7] shadow-price-quote" />
        <div className="flex flex-row flex-nowrap w-full my-[24px] h-[32px]">
          <div className="flex font-roboto font-bold text-[14px] text-[#55585D] leading-[22px] self-center">
            Quantity:
          </div>
          <div className="flex mx-[8px]">
            <div
              className="cursor-pointer flex w-[31px] h-full border-[1px] justify-center"
              onClick={() =>
                quantitySelected > 0
                  ? setQuantitySelected(parseInt(quantitySelected) - 1)
                  : null
              }
            >
              <BsDash className="text-[#2A64DB] self-center" />
            </div>
            <div className="flex w-[55px] h-full border-[1px] justify-center">
              <input
                className="font-roboto font-normal text-[12px] leading-[20px] w-full h-full text-center self-center"
                type="number"
                value={quantitySelected}
                onChange={handleChange}
              />
            </div>
            <div
              className="cursor-pointer flex w-[31px] h-full border-[1px] justify-center"
              onClick={() =>
                setQuantitySelected(parseInt(quantitySelected) + 1)
              }
            >
              <BsPlus className="text-[#2A64DB] self-center" />
            </div>
          </div>
        </div>
        <button
          className="flex w-full h-[40px] rounded-sm bg-[#2A64DB] justify-center items-center"
          onClick={() => addToCart()}
        >
          <span className="font-roboto font-normal text-[14px] leading-[22px] text-white">
            Add to Cart
          </span>
        </button>
        <button
          className="flex w-full h-[40px] rounded border-[1px] border-[#D7D8DB] justify-center items-center mt-[8px]"
          onClick={() => alert("Not Coded Yet")}
        >
          <span className="font-roboto font-normal text-[14px] leading-[22px] text-[#2A64DB]">
            Add to Favourites
          </span>
        </button>
      </div>
    </main>
  );
}

export default ProductPage;
