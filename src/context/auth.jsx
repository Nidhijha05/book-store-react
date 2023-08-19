import React, {useState,useEffect, useContext, createContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import shared from "../utils/shared";

const initailUserValue = {
    email: "",
    firstName: "",
    id:0,
    lastName: "",
    password: '',
    role: '',
    roleId:'',
}

const initialState = {
    setUser: ()=>{},
    user: initailUserValue,
    signOut: ()=>{},
}

const authContext = createContext(initialState);

export const AuthWrapper = ({children})=> {
    const[user, _setUser] = useState(initailUserValue);
    const navigate = useNavigate();
    const {pathname} = useLocation();


useEffect(()=>{
    const str = JSON.parse(localStorage.getItem("user")) || initailUserValue;
    if(str.id){
        _setUser(str);
    }
    if(!str.id){
        navigate("/login");
    }
},[]);

useEffect(()=>{
    if(pathname === "/login" && user.id){
        navigate("/");
    }
    if(!user.id){
        return;
    }
    const access = shared.hasAccess(pathname,user);
    if(!access){
        toast.warning("Sorry, you are not authorized to access this page");
        navigate("/");
        return;
    }
},[user,pathname])

const setUser = (user)=>{
    localStorage.setItem("user", JSON.stringify(user));
    _setUser(user);
}

const signOut = ()=>{
    setUser(initailUserValue);
    localStorage.removeItem("user");
    navigate("/login")
}

const value = {
    user,
    setUser,
    signOut,
}

return <authContext.Provider value={value}>{children}</authContext.Provider>
}

export const useAuthContext = ()=>{
    return useContext(authContext);
}