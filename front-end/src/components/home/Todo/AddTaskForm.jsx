import React, {useState, useEffect} from 'react'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { addUserTask } from '../../../state/features/userTasks';
import styled from 'styled-components';
function AddTaskForm({user}) {
    const dispatch = useDispatch()
    const [task, setTask] = useState({
        task: "",
        isChecked: false,
        user: user?.id,
      });
    const isLoged = useSelector(state => state.auth.isLoged)
    const [checkIsLogedIn , setCheckIsLogedIn] = useState(true)

    const handleChange = (e) => {
      setTask((prev) => ({
        user: prev.user,
        isChecked: prev.isChecked,
        [e.target.name]: e.target.value,
      }));
      
    };
  const HideCheckLoginError = ()=>{
    setCheckIsLogedIn(true)
  }
  const addTask = () => {
    
   if (isLoged != false ){

      if (task.task != ""){

     
    axios
      .post("http://127.0.0.1:8000/api/task-view/", task)
      .then(function (response) {
        console.log(response);
        dispatch(addUserTask(response.data));
        setTask((prev) => ({ ...prev, isChecked: false, task: "" }));
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{
      setCheckIsLogedIn(null)
    }
    }else{
      setCheckIsLogedIn(false)
  }
}
  useEffect(() => {
    setTask(prev => ({
     ...prev,
     user:user?.id
    }))
    
    
 }, [user])
  return (
    <PrentContainer>
      <Container>
        <div className='input-container'> 
          <input
            type="text"
            name="task"
            onChange={handleChange}
            onMouseDown={HideCheckLoginError}
            value={task.task}
            required
            placeholder="Add Task"
          />
          {checkIsLogedIn == false && (
            <span className="isLogedInError">You have to sign in first</span>
          )}
          {checkIsLogedIn == null && (
            <span className="isLogedInError">text field should not be empty</span>
          )}
        </div>
        <div>
        <button type="button" onClick={addTask}>
          Add{" "}
        </button>
        </div>
      </Container>
    </PrentContainer>
  );
}

export default AddTaskForm;
const PrentContainer = styled.div`
  .isLogedInError {
    color: #ff1100;
    font-size: 14px;
    margin-top: 5px;
  }
`;
const Container = styled.div`
 display:flex;
 padding:10px;
 .input-container{
  display:flex;
  flex-direction:column;
 }
 input {
   
    margin-right: 6px;
    
      outline:none;
      border:1px solid lightblue;
      border-radius:4px;
      background:#ccc9c9;
      color:#000;
      padding:11px 5px;
      width:30em;

    }
  button{
      background-color:#ce0291e4;
      border-radius:6px;
      outline-style:none;
      margin-right:4px;
      margin-left:4px;
      
      
  }


`;