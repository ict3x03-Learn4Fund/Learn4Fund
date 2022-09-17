import React, { useLayoutEffect, useState } from "react";

import dataBrands from "../assets/datasets/brands.json";
import noImage from "../assets/vectors/noimage.png";
import { useNavigate } from "react-router-dom";

function Brands() {
  const [brandsWidth, setBrandsWidth] = useState(0);
  const navigate = useNavigate();
  // show all alphabets
  // const alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','S','T','U','V','W','X','Y','Z']
  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "H",
    "I",
    "L",
    "M",
    "N",
    "S",
    "T",
    "V",
    "W",
  ];

  function resizeProductsBox() {
    setBrandsWidth((document.getElementById("AllBrands").offsetWidth - 41) / 6);
  }

  // Display brands from same category: alphabet
  function getBrands(arr, alphabet) {
    let newArray = [];
    newArray = arr.filter((element) => {
      if (element.name[0] === alphabet) {
        return element;
      }
      return null;
    });
    return newArray;
  }
  // Resize the width if the window is changed
  useLayoutEffect(() => {
    function updateSize() {
      resizeProductsBox();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <main className="flex flex-col flex-wrap w-full h-full px-[120px] pb-[119px] bg-[#EFEFF0] items-center">
      {alphabets.map((alphabet, index1) => {
        return (
          <div
            key={index1}
            className="flex flex-col w-full mt-[24px] mb-[40px]"
          >
            <div className="flex w-[94px] h-[48px] rounded bg-[#E4E5E7] justify-center items-center">
              <span className="font-type1 font-bold text-[20px] leading-[28px] tracking-[0.3px]">
                {alphabet}
              </span>
            </div>
            <div
              id="AllBrands"
              className="flex flex-row flex-wrap w-full gap-[8px]"
            >
              {getBrands(dataBrands, alphabet).map((brand, index) => {
                return (
                  <div
                    key={index}
                    style={{ width: brandsWidth + "px" }}
                    className="cursor-pointer flex flex-col flex-wrap h-[157px] bg-white border-[1px] border-[#E4E5E7] rounded"
                    onClick={() => navigate("/products")}
                  >
                    <img
                      src={
                        brand.image && brand.image.url
                          ? brand.image.url
                          : noImage
                      }
                      className="flex h-3/5 w-full object-contain"
                      alt={""}
                    />
                    <div className="flex h-1/5 w-full justify-center pt-[8px] text-[16px] leading-[20px] font-bold font-type1 text-[#242528]">
                      {brand.name}
                    </div>
                    <div className="flex h-1/5 w-full justify-center text-[12px] leading-[20px] font-normal font-type1 text-[#55585D]">
                      {(brand.productCount ? brand.productCount : "N.A") +
                        " Products"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default Brands;
