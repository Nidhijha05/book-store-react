import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./context/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import User from "./pages/User"
import UpdateProfile from "./pages/UpdateProfile"
import BookListing from "./pages/BookListing";
import CartPage from "./pages/CartPage";
import AddBook from "./pages/AddBook"
import Category from "./pages/Category";
import AddCategory from "./pages/AddCategory";
import EditUser from "./pages/EditUser";



function MyNavigation(){
    const authContext = useAuthContext();

    const Redirect = <Navigate to={"/login"}/>;
    return(
        <Routes>
        <Route path="/" element={authContext.user.id?<BookListing/>: Redirect}/>
        <Route path="/login" element={<Login/>}/>
        <Route path = "/register" element={!authContext.user.id?<Register/>:Redirect}  />
        <Route path = "/book" element={authContext.user.id?<Book/>:Redirect}/> 
        <Route path = "/update-profile" element = {authContext.user.id?<UpdateProfile/>:Redirect}/>
        <Route path = '/' element ={Login} />
        <Route path = "/user" element={authContext.user.id?<User/>:Redirect}/>
        <Route path = "/edit-user/:id" element={authContext.user.id?<EditUser/>:Redirect}/>
        <Route path = "/add-book" element={authContext.user.id?<AddBook/>:Redirect}/>
        <Route path = "/add-book/:id" element={authContext.user.id?<AddBook/>:Redirect}/>
        <Route path = "/add-category/:id" element={authContext.user.id?<AddCategory/>:Redirect}/>
        <Route path = "/add-category" element={authContext.user.id?<AddCategory/>:Redirect}/>
        <Route path = "/category" element={authContext.user.id?<Category/>:Redirect}/>
        <Route path="/cart-page" element={authContext.user.id?<CartPage/>:Redirect}/>
      </Routes>
    )
}

export default MyNavigation;