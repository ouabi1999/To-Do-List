import React, {useEffect, useState} from 'react'
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { setUserTasks } from '../../../state/features/userTasks';
import styled from 'styled-components';
import apiInstance from '../../../common/baseUrl';
function UpdateTaskForm({user , update_task, tasks, setIsOpen}) {
    const dispatch = useDispatch()
    const [task, setTask] = useState(update_task);
    
    
    const [takeActionLoading, setTakeActionLoading] = useState({
        louding: false,
        id: "",
    });
    useEffect(() => {
       setTask(update_task)
    }, [update_task])
    
    const handleEditChange = (e) => {
        setTask({ ...task, task: e.target.value }); 
        }; 
        
    const updateTask = () => {
        const abortControler = new AbortController();
        const signal = abortControler.signal;
        setTakeActionLoading((prev) => ({ ...prev, loading: true, id: update_task.id }));
        apiInstance
          .put(`task-detail-view/${update_task.id}/`, task)
          .then((response) => {
            const resData = response.data;
            const changedData= tasks.map((item) => {
              if (item.id === resData.id) {
                return { ...resData };
              } else {
                return item;
              }
            });
    
            dispatch(setUserTasks(changedData))
            setTask((prev) => ({ ...prev, isChecked: false, task: "" }));
            setIsOpen(false);
            setTakeActionLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setTakeActionLoading(false);
          });
      };
  return (
    <Container>
      <div className='headline-text'>
        <span> Edit your task</span>
      </div>
      <div className='child-container'>
      <input
        name="edit"
        value={task.task}
        onChange={handleEditChange}
        type="text"
        required
        placeholder="Update Task"
      />
      <button className='update-button' type="button" onClick={updateTask}>
        Update{" "}
      </button>
      </div>
    </Container>
  );
}

export default UpdateTaskForm

const Container = styled.div`
     background-color:#fff;

     width:100%;
     margin-bottom:12px;
     
     .child-container{
        display:flex;
        justify-content:space-between;
        width:100%;
        padding-bottom:10px;
        input{
            width:24rem;
            margin-left:4px;
         }
     }
     .headline-text{
      color:#000;
      background:#0daada;
      padding:10px;
      margin-bottom:10px;

     }
     .update-button{
      background-color:#0b5211;
      border-radius:6px;
      outline-style:none;
      margin-right:4px;
      margin-left:4px;
      
    }
    input{
      outline:none;
      border:1px solid lightblue;
      border-radius:4px;
      background:#ccc9c9;
      color:#000;
      padding:12px 5px;

    }

`