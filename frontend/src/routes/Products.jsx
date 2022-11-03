import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import dataProducts from "../assets/datasets/products.json";

function Products() {
  let navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [productsWidth, setProductsWidth] = useState(0);

  // Change the products to scale with gap, did not use grid as it is unstable
  function resizeProductsBox() {
    setProductsWidth(
      Math.floor((document.getElementById("AllProducts").offsetWidth - 48) / 5)
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

  // Add the sort condition and randomise if relevance is chosen
  function arrangeProducts(option) {
    if (option === 1) {
      return dataProducts.sort((a, b) => (a.lowPrice < b.lowPrice ? 1 : -1));
    } else if (option === 2) {
      return dataProducts.sort((a, b) => (a.lowPrice > b.lowPrice ? 1 : -1));
    }
    return dataProducts.sort(() => Math.random() - 0.5);
  }

  return (
    <main className="flex flex-row flex-wrap w-full h-full px-[120px] pb-[119px] bg-[#EFEFF0] items-center">
      <div className="flex flex-col flex-wrap w-1/6 h-full mt-[24px] self-start">
        <span className="font-roboto font-bold text-[20px] leading-[28px] tracking-[0.3px] text-[#242528]">
          Products
        </span>
        <span className="font-roboto font-normal text-[14px] leading-[22px] text-[#868A92]">
          10 results
        </span>
      </div>
      <div className="flex flex-row flex-wrap w-5/6 h-full mt-[24px]">
        <span className="font-roboto font-normal text-[14px] leading-[22px] text-[#868A92] w-full">
          Page 1 of 1 about 10 results
        </span>
        <div className="flex flex-row flex-nowrap w-fit h-[32px] bg-white items-center font-roboto font-normal text-[12px] leading-[20px] mt-[8px]">
          <div
            className="flex border-[1px] border-[#D9D9D9] rounded-l-sm py-[6px] px-[16px]"
            style={
              selectedTab === 0
                ? {
                    borderColor: "#2A64DB",
                    color: "#2A64DB",
                    backgroundColor: "#EEF3FC",
                  }
                : {}
            }
            onClick={() => {
              setSelectedTab(0);
            }}
          >
            Relevance
          </div>
          <div
            className="flex border-[1px] border-[#D9D9D9] rounded-sm py-[6px] px-[16px]"
            style={
              selectedTab === 1
                ? {
                    borderColor: "#2A64DB",
                    color: "#2A64DB",
                    backgroundColor: "#EEF3FC",
                  }
                : {}
            }
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            Price: High to Low
          </div>
          <div
            className="flex border-[1px] border-[#D9D9D9] rounded-r-sm py-[6px] px-[16px]"
            style={
              selectedTab === 2
                ? {
                    borderColor: "#2A64DB",
                    color: "#2A64DB",
                    backgroundColor: "#EEF3FC",
                  }
                : {}
            }
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            Price: Low to High
          </div>
        </div>

        <div className="flex w-full flex-wrap mt-[16px]">
          <div
            id="AllProducts"
            className="flex flex-row flex-wrap w-full gap-[8px]"
          >
            {arrangeProducts(selectedTab).map((product, index) => {
              return (
                <div
                  key={index}
                  style={{ width: productsWidth + "px" }}
                  className="cursor-pointer flex flex-col h-[333px] justify-center align-center bg-white border-[1px] border-[#E4E5E7] rounded px-[9px]"
                  onClick={() => navigate("/products/" + product.id)}
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
                      <span className="mx-[4px]">–</span>{" "}
                      <span className="text-[10px] leading-[12px] top-0 self-start">
                        {product.currencySymbol}
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
        </div>
      </div>
    </main>
  );
}

export default Products;
