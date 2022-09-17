import React, {useState} from 'react'
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

function App() {
  const [bannerClose, setBannerClose] = useState(false);
  return (
    <>
    {!bannerClose && <Banner closeBanner={setBannerClose}/>}
    <Nav/>
      <Routes>
        <Route exact path="/" element = {<Homepage/>}/>
        <Route exact path="/admin" element = {<Admin/>}/>
        <Route exact path="/donate" element = {<Donations/>}/>
        <Route exact path="/tos" element = {<Toc/>}/>
        <Route exact path="/privacy" element = {<Privacy/>}/>
        <Route exact path="/cookies" element = {<Cookie/>}/>
        <Route exact path="settings" element = {<Settings/>}/>
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
                    Go Back to <u><Link to="/" className='font-bold'>Homepage</Link></u>
                  </p>
                </div>
              </main>
            }
          />
      </Routes>
      <Footer/>
    </>
  )
}

export default App