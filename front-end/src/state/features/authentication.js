import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState : {
      isLoged : window.localStorage.getItem("access_token") || false,
      refresh_token: window.localStorage.getItem("refresh_token") || null,
      user: null
    },
    reducers:{
      setSignUp(state, action){
         
         const data = action.payload
         state.isLoged = window.localStorage.setItem("access_token", data.access_token)
         state.refresh_token = window.localStorage.setItem("refresh_token", data.refresh_token)
      },
       setLogin(state, action){
        const data = action.payload
        state.isLoged = window.localStorage.setItem("access_token", data.access_token)
        state.refresh_token = window.localStorage.setItem("refresh_token", data.refresh_token)
       },
      
      setAuth(state,  action){
         const userData = action.payload
         state.user = userData
      },
      setLogout(state, action){
         state.isLoged = window.localStorage.removeItem("access_token")
         state.isLoged = window.localStorage.removeItem("refresh_token")
         state.user = null
      }
    }
})
export const {setLogin, setSignUp, setLogout, setAuth} = authSlice.actions
export default authSlice.reducer