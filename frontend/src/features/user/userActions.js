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
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const verifyUser = await authService.login(email, password);
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
    async (arg, {getState, rejectWithValue}) => {
        try {
            let {user} = getState()
            console.log("user: ",user)
            const userId = localStorage.getItem("userId")
            // send user's id to retrieve account information
            const data = await authService.getAccount(user.userId);
            return data
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
    async (arg, { getState, rejectWithValue }) => {
        try {
            let {user} = getState()
            console.log("hello ",arg)
            const response = await authService.verify2FA(arg);
            localStorage.setItem('userId', response._id)
            return response
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

export const getCartNumber = createAsyncThunk(
    'user/cartNo',
    async (arg, {getState, rejectWithValue}) => {
        try {
            let {user} = getState()
            const userId = localStorage.getItem("userId")
            return await cartsService.getTotal(userId)
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)