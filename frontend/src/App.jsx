import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./routes/Homepage";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import Login from "./routes/Login";
import Login2FA from "./routes/Login2FA";
import Signup from "./routes/Signup";
import Toc from "./policies/Toc";
import Privacy from "./policies/Privacy";
import Cookie from "./policies/Cookie";
import Cart from "./routes/Cart";
import Settings from "./routes/Settings";
import Banner from "./components/banner/Banner";
import Donations from "./routes/Donations";
import Admin from "./routes/Admin";
import { Provider } from "react-redux";
import store from "./app/store";
import { NavProvider } from "./hooks/useNav";
import Catalog from "./routes/Catalog";
import CourseInfo from "./components/catalog/CourseInfo";
import { PromotionModal } from "./modals/PromotionModal";
import { NewsLetterModal } from "./modals/NewsLetterModal";

import { Toaster } from "react-hot-toast";
import { OTPModal } from "./modals/OTPModal";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [bannerClose, setBannerClose] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [newsModal, setNewsModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  const modalValue = useRef(false);

  useEffect(() => {
    modalValue.current = toggleModal;
  }, [toggleModal]);

  useEffect(() => {
    if (sessionStorage.getItem("closeBanner") === true) {
      setBannerClose(true);
    }
    if (window.innerWidth <= 1025) setShowMobileWarning(true);
  }, []);
  return (
    <Provider store={store}>
      <NavProvider>
        
          <>
            <Nav />
            <Routes>
              <Route
                exact
                path="/"
                element={<Homepage setNewsModal={setNewsModal} />}
              />
              <Route exact path="donate" element={<Donations />} />
              <Route exact path="tos" element={<Toc />} />
              <Route exact path="privacy" element={<Privacy />} />
              <Route exact path="cookies" element={<Cookie />} />
              <Route element={<ProtectedRoute />}>
                <Route exact path="settings" element={<Settings />} />
                <Route exact path="login2FA" element={<Login2FA />} />
                <Route exact path="admin" element={<Admin />} />
              </Route>
              <Route exact path="cart" element={<Cart />} />
              <Route exact path="login" element={<Login />} />
              <Route exact path="signup" element={<Signup />} />
              <Route exact path="courses" element={<Catalog />} />
              <Route exact path="courses/:courseID" element={<CourseInfo />} />
              <Route exact path="promo" element={<Homepage />} />

              <Route
                path="*"
                element={
                  <main className="p-8 bg-rose-200 h-screen">
                    <div className="bg-rose-400 p-8">
                      <p className="font-bold text-white">
                        URL not found - 404 code
                      </p>
                      <p>
                        Go back to{" "}
                        <u>
                          <Link to="/" className="font-bold">
                            Main Page
                          </Link>
                        </u>
                      </p>
                      <p>
                        If you suspect this is a bug, please contact us at{" "}
                        <a
                          href="mailto:learn4fund@gmail.com"
                          className="font-bold"
                        >
                          learn4fund@gmail.com
                        </a>
                      </p>
                    </div>
                  </main>
                }
              />
            </Routes>

            {!bannerClose && (
              <Banner
                closeBanner={setBannerClose}
                setPromoModal={setToggleModal}
              />
            )}
            {toggleModal && <PromotionModal closeModal={setToggleModal} />}
            {newsModal && <NewsLetterModal closeModal={setNewsModal} />}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
            <Footer />
          </>
        
      </NavProvider>
    </Provider>
  );
}

export default App;
