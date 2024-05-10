import { useState, useEffect } from 'react'

import './App.css'
import Index from './components/home/Todo'
import axios from "axios"
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import SignUp from "./components/authantication/SignUp"
import Login from "./components/authantication/Login"
import { setAuth } from './state/features/authentication';
import { useDispatch } from 'react-redux';
function App() {
  const [user, setUser] = useState("")
  const dispatch = useDispatch()
  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('access_token')}`, // Retrieve token from storage
          },
        });
        setUser(response.data);
        console.log(response.data)
        dispatch(setAuth(response.data))
      } catch (error) {
        console.error('Profile fetch error:', error);
        if (error.response.status == 401){
          window.localStorage.removeItem("access_token")
          window.localStorage.removeItem("refresh_token")
        }
        console.log(error)
        // Redirect to login if the profile fetch fails

        
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
