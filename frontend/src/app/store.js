// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'

const store = configureStore({
  reducer: {
    user: userReducer
  }
})
export default store