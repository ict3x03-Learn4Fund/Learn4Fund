import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

// Mock datasets to render
import dataBrands from "../assets/datasets/brands.json";
import dataProducts from "../assets/datasets/products.json";

// import Swiper core and required modules
import { Navigation, Pagination, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

//Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Subscribe from "../components/banner/Subscribe";
import { BsSearch } from "react-icons/bs";


function Homepage() {
  const [featureBrands, setFeatureBrands] = useState([]);
  const [productsWidth, setProductsWidth] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let brands = [];
    dataBrands.forEach(function (brand) {
      // Show the featured brand in the list
      if (brand.featured) {
        setFeatureBrands(brands.push(brand));
      }
      setFeatureBrands(brands);
    }, false);
  }, []);

  // To change the section width at the start of page render
  useEffect(() => {
    resizeProductsBox();
  }, []);

  // Change the products to scale with gap, did not use grid as it is unstable
  function resizeProductsBox() {
    setProductsWidth(
      (document.getElementById("Products").offsetWidth - 41) / 6
    );
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
    <main className="flex flex-col flex-wrap w-full h-full bg-b1 items-center space-y-[40px] pb-[40px]">
      
      <div className="flex flex-row flex-wrap w-full justify-end mb-2 mt-[24px] px-[40px]">
          <button className="flex w-[40px] h-[40px] bg-black rounded-full p-2 justify-center">
            <BsSearch className="self-center text-w1" />
          </button>
          <input
            className="flex w-1/3 bg-w1 text-black p-2 ml-2 rounded text-center border-2 border-b1"
            placeholder="Search for courses"
          />
      </div>
      <div className="flex h-[385px] w-4/5 bg-w1 border-[1px] border-w2 rounded mt-[24px] p-[9px]">
        <Swiper
          //Swiper modules
          modules={[Navigation, Pagination, Autoplay]}
          speed={400}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{ delay: 2500, disableOnInteraction: true }}
          loop
          pagination={{ clickable: true }}
        >
          <SwiperSlide >Promotion item 1</SwiperSlide>
          <SwiperSlide >Promotion item 2</SwiperSlide>
          <SwiperSlide>Promotion item 3</SwiperSlide>
        </Swiper>
      </div>
      <Subscribe />

      <section id="featurebrands" className="w-full px-[120px]">
        <div className="self-start font-type1 font-bold text-[1rem] leading-[28px] tracking-[0.3px] text-w1">
          Featured Companies
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w2 text-[14px] leading-[16px] font-type1 font-normal">
            Browse the list of companies that we have partnered with
          </p>
          <span
            className="flex font-type1 font-normal text-[14px] text-w2 leading-[22px]"
            onClick={() => navigate("brands")}
          >
            View More
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div className="flex flex-row w-full mt-[12px] space-x-[8px]">
          {featureBrands.map((brand, index) => {
            return (
              <div
                key={index}
                className="cursor-pointer flex flex-col flex-wrap w-1/6 h-[157px] bg-white border-[1px] border-[#E4E5E7] rounded"
                onClick={() => navigate("brands")}
              >
                <img
                  src={brand.image.url}
                  className="flex h-3/5 w-full object-contain"
                  alt={""}
                />
                <div className="flex h-1/5 w-full justify-center pt-[8px] text-[16px] leading-[20px] font-bold font-type1 text-[#242528]">
                  {brand.name}
                </div>
                <div className="flex h-1/5 w-full justify-center text-[12px] leading-[20px] font-normal font-type1 text-[#55585D]">
                  {brand.productCount + " Courses"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="ourproducts" className="w-full px-[120px]">
        <div className="self-start font-type1 font-bold text-[1rem] leading-[28px] tracking-[0.3px] text-w1">
          Featured Courses
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-w1 text-[14px] leading-[16px] font-type1 font-normal">
            Trusted by most IT Specialists in Singapore
          </p>
          <span
            className="flex font-type1 font-normal text-w2 text-[14px] leading-[22px]"
            onClick={() => navigate("products")}
          >
            View More{" "}
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] leading-[28px]" />
          </span>
        </div>
        <div
          id="Products"
          className="flex flex-row flex-wrap w-full mt-[12px] gap-[8px]"
        >
          {dataProducts
            .sort(() => Math.random() - 0.5)
            .map((product, index) => {
              return (
                <div
                  key={index}
                  style={{ width: productsWidth + "px" }}
                  className="cursor-pointer flex flex-col h-[333px] justify-center align-center bg-white border-[1px] border-[#E4E5E7] rounded px-[9px]"
                  onClick={() => navigate("products")}
                >
                  <div className="flex flex-col h-[184px] p-[8px] w-full">
                    <img
                      className={
                        "" + (product.vipPriceFlag && product.bulkDiscountFlag)
                          ? "w-[104px] self-center mb-[6px]"
                          : product.vipPriceFlag || product.bulkDiscountFlag
                          ? "w-[120px] self-center mb-[10px]"
                          : ""
                      }
                      src={product.images[0].url}
                      alt={JSON.stringify(product.metadata)}
                    />
                    {product.vipPriceFlag && (
                      <div className="flex h-fit w-fit bg-[#DBE5FA] px-[4px] rounded-sm">
                        <span className="font-type1 font-bold text-[12px] leading-[20px] text-[#1E4DAF]">
                          VIP Price
                        </span>
                      </div>
                    )}
                    {product.bulkDiscountFlag && (
                      <div className="flex h-fit w-fit bg-[#FFE69C] px-[4px] rounded-sm">
                        <span className="font-type1 font-bold text-[12px] leading-[20px] text-[#6A5001]">
                          Bulk Discount
                        </span>
                      </div>
                    )}
                    {(product.vipPriceFlag || product.bulkDiscountFlag) && (
                      <div className="flex h-fit w-fit bg-[#EFEFF0] px-[4px] rounded-sm">
                        <span className="font-type1 font-bold text-[12px] leading-[20px] text-[#242528]">
                          MOQ: {product.moq}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-nowrap w-full h-[140px] mt-[8px]">
                    {product.highPriceOriginal && (
                      <div className="text-[12px] leading-[20px] text-[#868A92] font-type1 font-normal line-through">
                        {product.highPriceOriginalPretty}
                      </div>
                    )}
                    <div className="flex items-stretch text-[16px] leading-[20px] text-[#2A64DB] font-type1 font-bold">
                      <span className="text-[10px] leading-[12px] top-0 self-start">
                        {product.currencySymbol}
                      </span>{" "}
                      <span>
                        {product.lowPrice && product.lowPrice.toFixed(2)}
                      </span>{" "}
                      {product.highPrice ? (
                        <span className="mx-[4px]">–</span>
                      ) : null}{" "}
                      <span className="text-[10px] leading-[12px] top-0 self-start">
                        {product.highPrice && product.currencySymbol}
                      </span>
                      <span>
                        {product.highPrice && product.highPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-[10px] font-type1 font-normal text-[#242528] text-[14px] leading-[16px]">
                      {product.title}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
}

export default Homepage;
