import React, { createContext, useContext, useEffect, useState } from "react";
import cartService from "../service/cartService";
import { useAuthContext } from "./auth";
import authService from "../service/authService";

const initialCartDetails = {
    cartData: [],
    updateCart: [],
    emptyCart: [],
}

export const cartContext = createContext(initialCartDetails);

export const CartWrapper = ({ children }) => {
    const authContext = useAuthContext();
    const [cartData, setCartData] = useState([]);


    const emptyCart = () => {
        setCartData([]);
    }

    const updateCart = (updatedCartData) => {
        if (updatedCartData) {
            setCartData(updatedCartData);
        } else if (authContext.user.id) {
            cartService.getList(authContext.user.id).then((res) => setCartData(res));
        }
    }
    useEffect(() => {
        updateCart();
    }, [authContext.user.id]);

    const value = {
        cartData,
        updateCart,
        emptyCart,
    }
    return (
        <cartContext.Provider value={value}> {children}</cartContext.Provider>
    )
}

export const useCartContext = () => {
    return useContext(cartContext);
};
