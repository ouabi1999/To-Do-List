import { React, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import styled from "styled-components";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from '@mui/material/LinearProgress';

import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/features/authentication";
import axios from "axios";
import { useFormik , ErrorMessage } from 'formik';
import * as Yup from 'yup';
import apiInstance from "../../common/baseUrl";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const handleSubmit = (values) => {
    setIsLoading(true);
    apiInstance
      .post("login/", values)
      .then((response) => {
        dispatch(setLogin(response.data));
        setIsLoading(false);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setHasError(true);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(true);
  };

  const handleMouseDownPassword = () => {
    setShowPassword(false);
  };

  const HideError = () => {
    setHasError(false);
  };


  const validationSchema =  Yup.object({
    password: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
  })

  const formik = useFormik({
    initialValues: formData,
    validationSchema,

    onSubmit: (values) => {
      
      handleSubmit(values)
    }
  });

  return (
    <Container onSubmit={formik.handleSubmit}>
      <h1>Login</h1>
      <Wrapper>
        <TextField
          onMouseDown={HideError}
          onKeyDown={HideError}
          id="outlined-error"
          label="Email"
          name="email"
          variant="filled"
          backgroundColor="warning"
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <FormControl variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            onMouseDown={HideError}
            onKeyDown={HideError}
            type={showPassword ? "text" : "password"}
            id="filled-adornment-password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText className="error" id="my-helper-text">
            {formik.touched.password && formik.errors.password}
          </FormHelperText>

          {hasError && formik.touched.password && (
          <div>
            <FormHelperText className="error" id="my-helper-text">
              Password or email are not valid
            </FormHelperText>
          </div>
        )}
        </FormControl>
       
      </Wrapper>
      <Button  disabled ={isLoading} type="submit" variant="contained">
         <div>
        <span>
            Login
        </span>
        {isLoading &&(

        <LinearProgress color="secondary"  />
        )}
        </div>
      </Button>
    </Container>
  );
}

export default Login;

const Container = styled.form`
  .error{
    color:#fd2323
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-top: 50px;
  gap: 10px;
  background-color: #ffff;
  width: 30vw;
  min-width: 320px;
  border-radius: 6px;
  padding: 10px;
  h1 {
    color: #000;
  }
  #outlined-error {
    border-radius: inherit;
    width: calc(30vw - 100px);
    min-width: calc(320px - 100px);
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  .login-error {
    color: #f51f1f;
  }
`;
