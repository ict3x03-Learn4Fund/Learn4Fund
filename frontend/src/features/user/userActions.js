import authService from "../../services/accounts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import cartsService from "../../services/carts";

// userAction.js
export const registerUser = createAsyncThunk(
    // action type string
    'user/register',
    // callback function
    async (newUserInfo, { rejectWithValue }) => {
        try {
            const verifyUser = await authService.register(newUserInfo); // change to set local storage at 2fa
            localStorage.setItem('userId', verifyUser._id);
            return verifyUser
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }

    }
)

export const userLogin = createAsyncThunk(
    'user/login',
    async ({ email, password, token }, { rejectWithValue }) => {
        try {
            const verifyUser = await authService.login(email, password);
            await authService.verify2FA({ token: token, userId: verifyUser._id });
            localStorage.setItem('userId', verifyUser._id);
            return verifyUser
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async (arg, { rejectWithValue}) => {
        try {
            // send user's id to retrieve account information
            if(localStorage.getItem('userId')) {
            const data = await authService.getAccount(localStorage.getItem('userId'));
            if(new Date().getTime() > new Date(data.loggedTimestamp).getTime() + 1800000){
                localStorage.removeItem('userId');
                return rejectWithValue('Session expired');
            }
            return data
        }
        return null
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const user2FA = createAsyncThunk(
    'user/auth2FA',
    async ({token}, {getState, rejectWithValue }) => {
        try {
            let {user} = getState()
            const response = await authService.verify2FA({token: token, userId: user.userId});
            return response.data
        } catch (error) {
            console.log(error)
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else if (error.response.data){
                return rejectWithValue(error.response.data)
            } 
            else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const getCartNumber = createAsyncThunk(
    'user/cartNo',
    async (arg, {getState, rejectWithValue}) => {
        try {
            let {user} = getState()
            const response = await cartsService.getTotal(user.userInfo.id)
            if (response.status == 200){
                return response.data.totalNo
            } else {
                return 0
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)