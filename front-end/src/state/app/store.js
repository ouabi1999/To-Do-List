import {configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authentication"
import userTasksReducer from "../features/userTasks"

export const store = configureStore({
     reducer:{
        auth: authReducer,
        userTasks: userTasksReducer
     },
})