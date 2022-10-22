// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { userLogin, registerUser, getUserDetails, user2FA } from './userActions'

// initialize userToken from local storage
const userId = localStorage.getItem('userId')
  ? localStorage.getItem('userId')
  : null

const initialState = {
  loading: false,
  userInfo: null, // for user object
  userId, // for storing the user Id
  error: null,
  success: false, // for monitoring the registration process.
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
        localStorage.removeItem('userId') // deletes token from storage
        state.loading = false
        state.userInfo = null
        state.userId = null
        state.error = null
      },
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
        state.loading = true
        state.error = null
      },
      [userLogin.fulfilled]: (state, { payload }) => {
        state.loading = false
        state.userInfo = payload
        state.userToken = payload.userToken
      },
      [userLogin.rejected]: (state, { payload }) => {
        state.loading = false
        state.error = payload
      },
    // register user
    [registerUser.pending]: (state) => {
        state.loading = true
        state.error = null
      },
      [registerUser.fulfilled]: (state, { payload }) => {
        state.loading = false
        state.success = true // registration successful
        state.userInfo = payload // REMOVE later
      },
      [registerUser.rejected]: (state, { payload }) => {
        state.loading = false
        state.error = payload
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
      },
      [user2FA.fulfilled]: (state, { payload }) => {
        state.loading = false
        state.userInfo = payload
      },
      [user2FA.rejected]: (state, { payload }) => {
        state.loading = false
      },
  },
})

// export actions
export const { logout } = userSlice.actions
export default userSlice.reducer