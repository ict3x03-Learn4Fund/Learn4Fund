import React from "react";
import { AiOutlineTwitter, AiOutlinePhone } from 'react-icons/ai';
import { BiDonateHeart } from "react-icons/bi";
import { BsInstagram, BsYoutube } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/vectors/networking.png";
import SGflag from "../../assets/vectors/singaporeflag.png";


function Footer() {
  const navigate = useNavigate();
  return (
    <footer id="Footer">
      <div className="flex flex-row flex-wrap bg-w2 py-4">
        <div className="flex-none w-1/3 order-none grow-0 space-y-4 self-center">

          <div className="flex flex-row w-full justify-center">
            <button className="flex btn" onClick={() => { navigate('/donate') }}><BiDonateHeart className="self-center mr-4" />Make a Donation</button>
          </div>

          <div className="flex justify-center text-center px-8">
            The Titans community has raised over SGD$1,000,000 and donated courses to the underpriviledged in Singapore since 2019.
          </div>


        </div>
        <div className="flex flex-wrap w-1/3 align-center order-1 grow-0 justify-center">
          <div className="flex flex-col w-full h-3/4 justify-center items-center">
            <img src={logo} className="flex h-[50px] stroke-w1 self-center" alt="Teamwork icons created by Becris - Flaticon" />

            <span className=" font-type4 mt-2">Learn4Fund</span>
            <span className="text-indigo-700 font-bold font-type5">Titans</span>
          </div>
          <div className="flex flex-row w-full justify-center p-2 gap-2 self-center">
            <a href="#" className="hover:text-purple-500 hover:bg-white hover:rounded-full">
              <BsInstagram />
            </a>
            <a
              href="https://www.youtube.com/user/MOESpore"
              className="hover:text-[red]"
              target="_blank"
              rel="noreferrer"
            >
              <BsYoutube />
            </a>
            <a
              href="https://twitter.com/moesg?lang=en"
              className="hover:text-[cyan]"
              target="_blank"
              rel="noreferrer"
            >
              <AiOutlineTwitter />
            </a>
            <a href="https://github.com/ict3x03-Learn4Fund" className="hover:text-black hover:bg-indigo-400 hover:rounded-full">
              <FaGithub />
            </a>
          </div>
        </div>
        <div className="flex-none w-1/3 order-2 grow-0 space-y-4 self-center">
          <div className="flex-none justify-center text-center">
            <b>Purpose & Mission</b>
            <div className="flex justify-center text-center text-[12px] mt-2 px-4">
              At Learn4Fund, we are dedicated to providing you with the best
              possible service. We are committed to protecting your privacy and
              security. We will only use the information we collect about you
              lawfully (in accordance with the Data Protection Act 1998).
            </div>
          </div>
          <div className="flex w-full text-[12px] text-center justify-evenly">
            <b>Terms and conditions</b>
            <a href="/tos" className="link">Terms of Service</a>
          </div>
          <div className="flex w-full text-[12px] text-center justify-evenly">
            <b>User Policies</b>
            <a href="/privacy" className="link">Privacy Policy</a>
            <a href="/cookies" className="link">Cookie Policy</a>
          </div>
        </div>
      </div>


      <div className="flex flex-wrap w-full text-white justify-center bg-black py-[8px]">
        <div className="flex flex-row flex-wrap w-full justify-between px-[40px]">
          <div className="flex">
            <div className="flex flex-row flex-wrap w-[91px] h-[22px]">
              <img
                src={SGflag}
                className="w-[20px] h-[14px] top-[4px] mr-[8px] self-center"
                alt={""}
              />
              <p className="flex w-[63px] h-[22px] left-[28px] text-[14px] font-normal leading-[22px] font-roboto">
                Singapore
              </p>
            </div>
            <div className="flex flex-row flex-wrap w-[120px] h-[22px] ml-[32px]">
              <AiOutlinePhone className="w-[18px] h-[18px] mr-[8px] self-center" />
              <p className="w-[94px] h-[22px] text-[14px] font-normal leading-[22px] font-roboto">
                +65 9797 9797
              </p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap w-auto h-[22px] ml-[32px] self-end">
            <p className="flex h-[22px] left-[28px] text-[14px] font-normal leading-[22px] font-roboto">
              Currency
            </p>
            <HiCurrencyDollar className="w-[18px] h-[18px] mx-[8px] self-center" />

            <p className="flex h-[22px] left-[28px] text-[14px] font-bold leading-[22px] font-roboto">
              SGD
            </p>
          </div>
        </div>
        <small>&copy; Titans. All rights reserved.</small>

      </div>

    </footer>
  );
}

export default Footer;
