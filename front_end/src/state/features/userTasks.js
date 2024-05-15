import { createSlice } from "@reduxjs/toolkit";

const UserTasksSlice = createSlice({
   name:"userTasks",
   initialState:{
    tasks :[],
    isLoading:false
   },
   reducers:{
         setUserTasks(state, action){
            const data = action.payload
            state.tasks = data
        },
        addUserTask (state, action){
            const data = action.payload
            state.tasks.push(data)
        },
        setLoading(state, action){
            state.isLoading = action.payload
        }
       
   }
})
export  const {setUserTasks, addUserTask, setLoading} =  UserTasksSlice.actions
export default UserTasksSlice.reducer
