import {createSlice} from "@reduxjs/toolkit";
export const initialUserValue = {
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    password: "",
    role: "",
    roleId:"",
}

const initialState = {
    user:initialUserValue,
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action) => {
            state.user=action.payload;
            localStorage.setItem("user",JSON.stringify(action.payload));
        },
        signOut:(state) => {
            state.user = initialUserValue;
            localStorage.removeItem("user");
        } 
    }
})

export const {setUser,signOut} = authSlice.actions;

export default authSlice.reducer;