import React,{useMemo} from "react";
import '../pages/Header.css';

import { Button} from "@mui/material";
import { useAuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import shared from "../utils/shared";
import { HiShoppingCart } from "react-icons/hi";
import { useCartContext } from "../context/cart";

function Header() {

  const navigate = useNavigate();
  const authContext = useAuthContext();
  const cartContext = useCartContext();
  const logOut = ()=>{
    authContext.signOut();
  }

  const items = useMemo(()=>{
    return shared.NavigationItems.filter(
      (item)=>!item.access.length || item.access.includes(authContext.user.roleId)
    )
  },[authContext.user]);


  return (
    <div className="header">
      <div className="container">
        <div className="header-right">
          {!authContext.user.id && (
            <>
          <Button variant="text" color="error" xl={{textTransform:"capitalize",}} onClick={()=>{
            navigate('/login');
          }} 
          >Login</Button>
          <Button variant="text" color="error" xl={{textTransform:"capitalize",}} onClick={()=>{
            navigate('/register');
          }} 
          >Register</Button>
          
        </>
          )}

          

          {items.map((item,index)=>(
            <Button key={index} variant="text" className="bts" xl={{backgroundColor:"black",textTransform:"capitalize",marginLeft:"50px"}} onClick={()=>{
              navigate(item.route)
            }}>{item.name}</Button>
          ))}

{'    '}
          <Button variant="outlined" color="error" className="button" xl={{textTransform:'capitalize', height: 40,marginLeft:"20px"}}
          startIcon={<HiShoppingCart/>} onClick={() => {
            navigate("/cart-page");
          }}>{cartContext.cartData.length}
          <span
            style={{
              color: "black",
              marginLeft: "4px",
              fontWeight: "normal",
            }}></span>
          Cart</Button> {'    '}
          {authContext.user.id ? (
            <Button
              variant="contained"
              xl={{
                backgroundColor:"black",marginLeft:"20px",
                "&:hover":{
                  backgroundColor: "",
                },
                textTransform:"capitalize",
              }}
              onClick={()=>{
                logOut();
              }}>Logout</Button>
          ):null}
        </div>
      </div>

    </div>

  )
}
export default Header;