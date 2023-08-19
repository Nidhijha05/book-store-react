import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import './App.css';
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Search from './components/Search';
import { AuthWrapper } from './context/auth';
import MyNavigation from './MyNavigation';
import { CartWrapper } from './context/cart';



function App() {
  return (
    <>
    
    <BrowserRouter>
    <AuthWrapper>
    <CartWrapper>
    <Header/>
    <Search/>
    <MyNavigation/>
    <ToastContainer/>
      
      </CartWrapper>
      </AuthWrapper>
    </BrowserRouter>
    </>
  );
}

export default App;