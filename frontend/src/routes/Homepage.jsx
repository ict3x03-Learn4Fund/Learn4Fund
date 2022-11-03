import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

// Add the banner images
import Logo1 from "../assets/vectors/coupa-logo.png";
import Logo2 from "../assets/vectors/ivalua-logo.png";
import Logo3 from "../assets/vectors/gep-smart-logo.png";
import Logo4 from "../assets/vectors/microsoft-dynamics-logo.png";
import Logo5 from "../assets/vectors/oracle-logo.png";
import Logo6 from "../assets/vectors/sap-logo.png";
import Logo7 from "../assets/vectors/sap-ariba-logo.png";
import Logo8 from "../assets/vectors/tenderboard-logo.png";

// Mock datasets to render
import dataBrands from "../assets/datasets/brands.json";
import dataProducts from "../assets/datasets/products.json";

function Homepage() {
  const [featureBrands, setFeatureBrands] = useState([]);
  const [productsWidth, setProductsWidth] = useState(0);
  let navigate = useNavigate();

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
    <main className="flex flex-col flex-wrap w-full h-full px-[120px] pb-[119px] bg-[#EFEFF0] items-center">
      <div className="flex h-[385px] w-4/5 bg-white border-[1px] border-[#E4E5E7] rounded mt-[24px] p-[9px]">
        <div className="relative w-full h-full rounded bg-[url(/src/assets/images/bannerbackground.png)] bg-cover">
          <div className="absolute left-[63px] top-[100px] text-[#1E4DAF] font-normal text-[28px] leading-[32px]">
            Punchout integration with all major
          </div>
          <div className="absolute left-[63px] top-[144px] text-[#1E4DAF] font-bold text-[36px] font-roboto leading-[54px]">
            ERPs & eProcurement Solutions
          </div>
          <button className="absolute left-[63px] top-[219px] bg-[#1E4DAF] rounded-3xl text-white font-roboto font-bold text-[24px] leading-[28px] tracking-[0.5px] py-[10px] px-[32px]">
            Learn More
          </button>

          {/* Add company logos */}
          <div className="absolute w-2/5 h-[88px] shadow-banner right-[-8px] top-[85px] rounded-tl-sm bg-white">
            <div className="flex w-full h-full items-center">
              <div className="flex flex-row space-x-[20px] flex-wrap w-full h-1/2 mx-[32px]">
                <img src={Logo1} alt={""} className="w-1/5 object-contain" />
                <img src={Logo2} alt={""} className="w-1/5 object-contain" />
                <img src={Logo3} alt={""} className="w-1/5 object-contain" />
                <img src={Logo4} alt={""} className="w-1/5 object-contain" />
              </div>
            </div>
          </div>
          <div className="absolute w-1/2 h-[88px] shadow-banner right-[-8px] top-[193px] rounded-tl-sm bg-white">
            <div className="flex w-full h-full items-center">
              <div className="flex flex-row space-x-[20px] flex-wrap w-full h-1/2 mx-[32px]">
                <img src={Logo5} alt={""} className="w-1/5 object-contain" />
                <img src={Logo6} alt={""} className="w-1/5 object-contain" />
                <img src={Logo7} alt={""} className="w-1/5 object-contain" />
                <img src={Logo8} alt={""} className="w-1/5 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="featurebrands" className="w-full mt-[40px]">
        <div className="self-start font-roboto font-bold text-[20px] leading-[28px] tracking-[0.3px]">
          Feature Brands
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-[#55585D] text-[14px] leading-[16px] font-roboto font-normal">
            Browse the full catalog of brands today
          </p>
          <span
            className="flex font-roboto font-normal text-[#2A64DB] text-[14px] leading-[22px]"
            onClick={() => navigate("brands")}
          >
            View More{" "}
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] text-[#2A64DB] leading-[28px]" />
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
                <div className="flex h-1/5 w-full justify-center pt-[8px] text-[16px] leading-[20px] font-bold font-roboto text-[#242528]">
                  {brand.name}
                </div>
                <div className="flex h-1/5 w-full justify-center text-[12px] leading-[20px] font-normal font-roboto text-[#55585D]">
                  {brand.productCount + " Products"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="ourproducts" className="w-full mt-[40px]">
        <div className="self-start font-roboto font-bold text-[20px] leading-[28px] tracking-[0.3px]">
          Our Products
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-[#55585D] text-[14px] leading-[16px] font-roboto font-normal">
            Trusted by the best companies in Asia
          </p>
          <span
            className="flex font-roboto font-normal text-[#2A64DB] text-[14px] leading-[22px]"
            onClick={() => navigate("products")}
          >
            View More{" "}
            <MdArrowForwardIos className="self-center w-[14px] h-[14px] ml-[4px] text-[#2A64DB] leading-[28px]" />
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
                        <span className="font-roboto font-bold text-[12px] leading-[20px] text-[#1E4DAF]">
                          VIP Price
                        </span>
                      </div>
                    )}
                    {product.bulkDiscountFlag && (
                      <div className="flex h-fit w-fit bg-[#FFE69C] px-[4px] rounded-sm">
                        <span className="font-roboto font-bold text-[12px] leading-[20px] text-[#6A5001]">
                          Bulk Discount
                        </span>
                      </div>
                    )}
                    {(product.vipPriceFlag || product.bulkDiscountFlag) && (
                      <div className="flex h-fit w-fit bg-[#EFEFF0] px-[4px] rounded-sm">
                        <span className="font-roboto font-bold text-[12px] leading-[20px] text-[#242528]">
                          MOQ: {product.moq}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-nowrap w-full h-[140px] mt-[8px]">
                    {product.highPriceOriginal && (
                      <div className="text-[12px] leading-[20px] text-[#868A92] font-roboto font-normal line-through">
                        {product.highPriceOriginalPretty}
                      </div>
                    )}
                    <div className="flex items-stretch text-[16px] leading-[20px] text-[#2A64DB] font-roboto font-bold">
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
                    <div className="mt-[10px] font-roboto font-normal text-[#242528] text-[14px] leading-[16px]">
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
