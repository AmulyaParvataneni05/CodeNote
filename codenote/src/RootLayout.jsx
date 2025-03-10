import React from 'react'
import Header from './Components/header/Header';
import Footer from './Components/footer/Footer'
import {Outlet} from 'react-router-dom';
function RootLayout() {
  return (
    <div>
        <Header />
        <div style = {{minHeight : "110vh"}} className='container'>
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default RootLayout;