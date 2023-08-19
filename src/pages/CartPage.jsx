import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate,Link } from "react-router-dom";
import cartService from "../service/cartService";
import { useCartContext } from "../context/cart";
import { Button } from "@mui/material";
import shared from "../utils/shared";
import orderService from"../service/orderService"
import { useAuthContext } from "../context/auth";
import "../pages/CartPage.css";




const CartPage = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    const navigate = useNavigate();
  
    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
  
    const getTotalPrice = (itemList) => {
      let totalPrice = 0;
      itemList.forEach((item) => {
        const itemPrice = item.quantity * parseInt(item.book.price);
        totalPrice = totalPrice + itemPrice;
      });
      setTotalPrice(totalPrice);
    };
  
    useEffect(() => {
      setCartList(cartContext.cartData);
      setItemsInCart(cartContext.cartData.length);
      getTotalPrice(cartContext.cartData);
    }, [cartContext.cartData]);
  
    const removeItem = async (id) => {
      try {
        const res = await cartService.removeItem(id);
        if (res) {
          cartContext.updateCart();
        }
      } catch (error) {
        toast.error("Something went wrong!",{theme:"colored"});
      }
    };
  
    const updateQuantity = async (cartItem, inc) => {
      const currentCount = cartItem.quantity;
      const quantity = inc ? currentCount + 1 : currentCount - 1;
      if (quantity === 0) {
        toast.error("Item quantity should not be zero",{theme:"colored"});
        return;
      }
  
      try {
        const res = await cartService.updateItems({
          id: cartItem.id,
          userId: cartItem.userId,
          bookId: cartItem.book.id,
          quantity,
        });
        if (res) {
          const updatedCartList = cartList.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item
          );
          cartContext.updateCart(updatedCartList);
          const updatedPrice =
            totalPrice +
            (inc
              ? parseInt(cartItem.book.price)
              : -parseInt(cartItem.book.price));
          setTotalPrice(updatedPrice);
        }
      } catch (error) {
        toast.error("Something went wrong!",{theme:"colored"});
      }
    };
  
    const placeOrder = async () => {
      if (authContext.user.id) {
        const userCart = await cartService.getList(authContext.user.id);
        if (userCart.length) {
          try {
            let cartIds = userCart.map((element) => element.id);
            const newOrder = {
              userId: authContext.user.id,
              cartIds,
            };
            const res = await orderService.placeOrder(newOrder);
            if (res) {
              cartContext.updateCart();
              navigate("/");
              toast.success(shared.messages.ORDER_SUCCESS,{theme:"colored"});
            }
          } catch (error) {
            toast.error(`Order cannot be placed ${error}`,{theme:"colored"});
          }
        } else {
          toast.error("Your cart is empty",{theme:"colored"});
        }
      }
    };
  
    return (
      <div className="cart">
        <div className="cart-heading">
                <h1 className="cart-heading-h">
                    Cart Items 
                </h1> 
            </div>
        
        
          <div className="cart-shopping">
            <h2>
             Total items -{ itemsInCart} 
            </h2>
          
            <h4>
              Total Price: {totalPrice}
            </h4>
          </div>

        <div className="cart-item">
          {cartList.map((cartItem)=>{
            return(
              <div className="cart-product" key={cartItem.id}>
                <div className="cart-product-left">
                  <img src={cartItem.book.base64image} alt=""/>
                </div>

                <div className="cart-product-middle">
                  <div className="cart-product-name">
                    {cartItem.book.name}
                  </div>
      
                  <div className="cart-product-btn">
                    <Button variant="contained" sx={{
                      backgroundColor:"#f15d54","&:hover": {
                        backgroundColor: "#f14d54",
                    },
                    }}  onClick={()=>{
                      updateQuantity(cartItem,true)
                    }}>+</Button><span className="quantity">{cartItem.quantity}</span><Button
                    variant="contained"
                    sx={{
                      backgroundColor:"#f15d54","&:hover": {
                        backgroundColor: "#f14d54",
                    },
                    }} 
                    onClick={() => {
                        updateQuantity(cartItem, false)
                    }
                } 
                >
                    -
                </Button>
                  </div>
                </div>

                <div className="cart-product-right">
                <div className="cart-product-name">
                  MRP {cartItem.book.price}
                  </div>
                  <Button variant="text" onClick={()=>{
                    removeItem(cartItem.id)
                  }} sx={{textTransform: "capitalize"}}>Remove</Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-place-order">
          <Button variant="contained" onClick={placeOrder} sx={{
            textTransform: "capitalize",backgroundColor: "black","&:hover": {
              backgroundColor: "green",
          }, width: 120, height:50, borderRadius:0
          }}>Place Order</Button>
        </div>
      </div>
    );
  };
  
                

export default CartPage;