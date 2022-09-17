import React, {useState, useEffect} from 'react'
import {Routes,
    Route,
    Link} from "react-router-dom"
    import Homepage from './routes/Homepage';
    import Brands from './routes/Brands';
    import Products from './routes/Products';
    import Nav from './components/nav/Nav';
    import ProductPage from './components/product';
import Footer from './components/footer/Footer';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Toc from './policies/Toc';
import Privacy from './policies/Privacy';
import Cookie from './policies/Cookie';
import Cart from './routes/Cart';
import Settings from './routes/Settings';
import Banner from './components/banner/Banner';
import Donations from './routes/Donations';
import Admin from './routes/Admin';
import {AuthProvider, RequireAuth} from "./hooks/useAuth";
import { NavProvider } from './hooks/useNav';

function App() {
  const [bannerClose, setBannerClose] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("closeBanner") === true) {
      setBannerClose(true);
    }
  },[])
  return (
    <AuthProvider>
    <NavProvider>
    <Nav/>
      <Routes>
        <Route exact path="/" element = {<Homepage/>}/>
        <Route exact path="admin" element = {<Admin/>}/>
        <Route exact path="donate" element = {<Donations/>}/>
        <Route exact path="tos" element = {<Toc/>}/>
        <Route exact path="privacy" element = {<Privacy/>}/>
        <Route exact path="cookies" element = {<Cookie/>}/>
        <Route exact path="cart" element = {<Cart/>}/>

        <Route exact path="settings" element = {<RequireAuth><Settings/></RequireAuth>}/>
        <Route exact path="brands" element = {<Brands/>}/>
        <Route exact path="login" element = {<Login/>}/>
        <Route exact path="signup" element = {<Signup/>}/>
        <Route exact path="products" element = {<Products/>}/>
        <Route exact path="products/:productid" element = {<ProductPage/>}/>

        <Route
            path="*"
            element={
              <main className='p-8 bg-rose-200 h-screen'>
                <div className='bg-rose-400 p-8'>
                  <p className='font-bold text-white'>URL not found - 404 code</p>
                  <p>
                    Go back to <u><Link to="/" className='font-bold'>Main Page</Link></u>
                  </p>
                  <p>
                    If you suspect this is a bug, please contact us at <a href="mailto:learn4fund@gmail.com" className='font-bold'>learn4fund@gmail.com</a>
                  </p>
                </div>
              </main>
            }
          />
      </Routes>
    {!bannerClose && <Banner closeBanner={setBannerClose}/>}
      <Footer/>
      </NavProvider>
    </AuthProvider>
  )
}

export default App