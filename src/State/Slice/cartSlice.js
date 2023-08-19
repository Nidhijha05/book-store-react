import {createSlice} from "@reduxjs/toolkit";
import cartService from "../../service/cartService";

const initailCartState = {
    cartData:[],
}

export const cartSlice = createSlice({
    name:"cart",
    initialState:initailCartState,
    reducers:{
        setCartData:(state,action)=>{
            state.cartData = action.payload;
        },
        addtoCart: (state,action)=>{
            state.addtoCart.push(action.payload);
        },
        removeFromCart: (state,action)=>{
            state.cartData=state.cartData.filter((item)=>item.id !==action.payload);
        }

    }

})

export const {setCartData,removeFromCart,addtoCart} = cartSlice.actions;

export const fetchCartData = (userId)=>
    async(dispatch) =>{
        try{
            const res = await cartService.getList(userId);
            dispatch(setCartData(res))
        }catch(error){}
    }


export default cartSlice.reducer;