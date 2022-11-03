import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './index.css';
import Homepage from './routes/Homepage';
import Brands from './routes/Brands';
import Products from './routes/Products';
import Courses from './routes/Courses';
import Nav from './components/nav/Nav';
import ProductPage from './components/product';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={(<div>Please wait...</div>)}>
      <BrowserRouter>
      <Nav/>
      <Routes>
        <Route exact path="/" element = {<Homepage/>}/>
        <Route exact path="brands" element = {<Brands/>}/>
        <Route exact path="products" element = {<Products/>}/>
        <Route exact path="courses" element = {<Courses/>}/>
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
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);