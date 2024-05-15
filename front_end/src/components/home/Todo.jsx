import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserTasks } from "../../state/features/userTasks";
import AddTaskForm from "./Todo/AddTaskForm";
import UpdateTaskForm from "./Todo/UpdateTaskForm";
import { setLogout } from "../../state/features/authentication";
import apiInstance from "../../common/baseUrl";
function Index() {
  const user = useSelector((state) => state.auth?.user);
  const tasks = useSelector((state) => state.userTasks?.tasks);
  const dispatch = useDispatch();

  const [task, setTask] = useState({
    task: "",
    isChecked: false,
    user: user,
  });
  const refresh_token = window.localStorage.getItem("refresh_token");
  const authenticated = window.localStorage.getItem("access_token") || null;
  const [data, setData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [takeActionLoading, setTakeActionLoading] = useState({
    loading: false,
    id: "",
  });

  const [valueToUpdate, setValueToUpdate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const DeleteTask = (id) => {
    setTakeActionLoading((prev) => ({ ...prev, loading: true, id: id }));

    apiInstance
      .delete(`task-detail-view/${id}/`)
      .then(function (response) {
        dispatch(setUserTasks(response.data));

        setTakeActionLoading((prev) => ({ ...prev, loading: false, id: id }));
      })
      .catch(function (error) {
        console.log(error);
        setTakeActionLoading((prev) => ({ ...prev, loading: false, id: id }));
      });
  };

  const handleCheckedChange = (item) => {
    setValueToUpdate({
      ...item,
      isChecked: !item.isChecked,
    });
  };

  const OpenTaskEditForm = (value) => {
    setTask(value);
    setIsOpen(true);
  };

  useEffect(() => {
    if (valueToUpdate) {
      apiInstance
        .put(
          `task-detail-view/${valueToUpdate.id}/`,
          valueToUpdate
        )
        .then((response) => {
          const resData = response.data;
          const changedData = tasks.map((item) => {
            if (item.id === resData.id) {
              return { ...resData };
            } else {
              return item;
            }
          });

          dispatch(setUserTasks(changedData));

          setValueToUpdate("");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [valueToUpdate]);

  const getUserTasks = () => {
    if (user != null) {
      setIsLoading(true);

      setTask((prev) => ({
        ...prev,
        user: user.id,
      }));
      apiInstance
        .get(`get-user-tasks/${user.id}/`)
        .then((response) => {
          dispatch(setUserTasks(response.data));
          setIsLoading(false);
        })
        .catch(function (error) {
          setIsLoading(false);
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getUserTasks();
  }, [user]);

  const logout = () => {
    apiInstance
      .post(
        "logout/",
        { refresh_token: refresh_token },
        
      )
      .then((response) => {
        dispatch(setLogout());
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <ParentContainer>
      {authenticated ? (
        <div>
          <button onClick={logout}>logout</button>
        </div>
      ) : (
        <div className="auth-root-container">
          <Link className="auth-button" to="login">
            Login
          </Link>
          <span>or</span>
          <Link className="auth-button" to="sign-up">
            Register
          </Link>
        </div>
      )}

      <Container>
        <h1>To Do List </h1>
        <div className="wrap">
          {isOpen ? (
            <UpdateTaskForm
              tasks={tasks}
              setIsOpen={setIsOpen}
              user={user}
              update_task={task}
            />
          ) : (
            <AddTaskForm user={user} />
          )}
        </div>
        <>
          {" "}
          {isLoading ? (
            <CircularProgress />
          ) : tasks?.length < 1? (
            <div>
              <span>You have no tasks</span>
            </div>
          ) : (
            <div className="tasks-container">
              {tasks?.map((item, index) => {
                return (
                  <div className="tasks" key={index}>
                    <span
                      className="task-text"
                      style={{
                        textDecoration: item.isChecked && "line-through",
                      }}
                    >
                      {item.task}
                    </span>
                    <div className="buttons-container">
                      <CheckCircleOutlineIcon
                        className="icon"
                        style={{ color: item.isChecked && "green" }}
                        onClick={() => handleCheckedChange(item)}
                      />
                      <EditIcon
                        className="icon"
                        onClick={() => OpenTaskEditForm(item)}
                      />
                      {takeActionLoading.loading === true &&
                      takeActionLoading.id === item.id ? (
                        <CircularProgress className="icon" size="25px" />
                      ) : (
                        <DeleteIcon
                          className="icon"
                          onClick={() => DeleteTask(item.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      </Container>
    </ParentContainer>
  );
}

export default Index;
const ParentContainer = styled.div`
  
  .auth-root-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 6px;
    .auth-button {
      background-color: #f0e1c2;
      padding: 7px 10px;
      border-radius: 5px;
      margin: 0 4px;
      color: #000000;
    }
    span {
      font-size: 1.1rem;
      font-weight: bold;
    }
  }
 
`;
const Container = styled.div`
  display: grid;
  place-items: center;

  .tasks-container {
    margin: auto;
    background-color: rgba(57, 211, 216, 0.1);
    width: 35%;
    padding: 10px;
    border-radius: 5px;
    
  }
  .buttons-container {
    width: 120px;
    display: flex;
    justify-content: space-between;
  }
  .tasks {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    .icon {
      height: 23px;
      width: 23px;
    }
    .icon:hover {
      color: blue;
      cursor: pointer;
    }
    .task-text {
      word-break: break-word;
      width: 280px;
    }
  }
  @media only screen and (max-width: 530px) {
   
    .tasks-container{
      width:90vw;
    }
}
`;
const EditForm = styled.div``;
