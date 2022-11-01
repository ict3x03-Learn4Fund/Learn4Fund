// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { useRef } from 'react'
import { userLogin, registerUser, getUserDetails, user2FA, getCartNumber } from './userActions'


const initialState = {
  loading: false,
  qrUrl: null, // for generator qr code for authentication
  userInfo: null, // for user object
  error: null,
  success: false, // for monitoring the registration process.
  otpSuccess: false,
  otpError: false,
  cartNo: 0,
  stateErrorMsg: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSignupState: (state) => {
      state.success = false
      state.error = null
      state.qrUrl = null
    },
    logout: (state) => {
      localStorage.removeItem('userId') // deletes token from storage
      state.loading = false
      state.userInfo = null
      state.error = null
      state.cartNo = 0
      state.success = false
      state.otpSuccess = false
      state.otpError = false
      state.qrUrl = null
      state.stateErrorMsg = null
    },
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
      state.loading = true
      state.success = false
      state.error = false
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.success = true
      state.userId = payload._id
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false
      state.success = false
      state.error = true
      state.stateErrorMsg = payload
    },
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true
      state.success = false
      state.error = false
      state.qrUrl = null
      state.userId = null
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.success = true
      state.userId = payload._id
      state.qrUrl = payload.secret
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false
      state.success = false
      state.error = true
      state.stateErrorMsg = payload
    },

    [getUserDetails.pending]: (state) => {
      state.loading = true
    },
    [getUserDetails.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
    },
    [getUserDetails.rejected]: (state, { payload }) => {
      state.loading = false
    },

    [user2FA.pending]: (state) => {
      state.loading = true
      state.otpError = false
      state.otpSuccess = false
    },
    [user2FA.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.otpSuccess = true
      state.userInfo = payload
    },
    [user2FA.rejected]: (state, { payload }) => {
      state.otpSuccess = false
      state.otpError = true
      state.loading = false
      state.stateErrorMsg = payload
    },

    [getCartNumber.pending]: (state) => {
      state.loading = true
    },
    [getCartNumber.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.cartNo = payload
    },
    [getCartNumber.rejected]: (state, { payload }) => {
      state.loading = false
    },
  },
})

// export actions
export const { logout, clearSignupState } = userSlice.actions
export default userSlice.reducer