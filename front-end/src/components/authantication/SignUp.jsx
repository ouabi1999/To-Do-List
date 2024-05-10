import {React, useState} from 'react'
import {Box , Button, TextField} from '@mui/material';
import styled from 'styled-components';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import LinearProgress from '@mui/material/LinearProgress';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios"
import { useFormik , ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { setSignUp } from '../../state/features/authentication';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "12346@4jk",
    confirmPassword:"",
  });

  const handleSubmit = (values) => {
    setIsLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/register/", {
        password: values.password,
        fullName: values.fullName,
        email: values.email,
      })
      .then((response) => {
        dispatch(setSignUp(response.data));
        window.location.href = "/"
        setIsLoading(false);
        
      })
      .catch((error) => {
        setHasError(true)
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(true);
  };
  const handleMouseDownPassword = () => {
    setShowPassword(false);
  };

  const handle_Click_Confirm_Show_Password = () => {
    setConfirmShowPassword(true);
  };
  const handle_Mouse_Down_Confirm_Password = () => {
    setConfirmShowPassword(false);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    fullName: Yup.string().required("Required"),
    //gender: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword:Yup.string().required("Required").oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: formData,
    validationSchema,

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const HideError = () => {
    setHasError(false);
  };

  return (
    <Container onSubmit={formik.handleSubmit}>
      <h1>Register</h1>
      <Wrapper>
        <TextField
          name="fullName"
          id="outlined-error"
          label="Full Name"
          variant="filled"
          onChange={formik.handleChange}
          value={formik.values.fullName}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName }
        />

        <TextField
          error={formik.touched.email && Boolean(formik.errors.email)}
          type="text"
          id="outlined-error"
          label="Email"
          name="email"
          variant="filled"
          backgroundColor="warning"
          onChange={formik.handleChange}
          value={formik.values.email}
          helperText={formik.touched.email && formik.errors.email}
          

        />
        <FormControl variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            type={showPassword ? "text" : "password"}
            id="filled-adornment-password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
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
          <FormHelperText className='error'> 
            {formik.touched.password && formik.errors.password}
          </FormHelperText>
        </FormControl>
        <FormControl variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Confirm Password</InputLabel>
          <FilledInput
            id="outlined-error"
            name="confirmPassword"
            onChange={formik.handleChange}
            type={confirmShowPassword ? "text" : "password"}
            value={formik.values.confirmPassword}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handle_Click_Confirm_Show_Password}
                  onMouseDown={handle_Mouse_Down_Confirm_Password}
                  edge="end"
                >
                  {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText className='error'> 
            {formik.touched.confirmPassword && formik.errors.confirmPassword}
          </FormHelperText>
        </FormControl>
        <FormHelperText className='error'> 
            {hasError && "user with this email already exists, try another email."}
          </FormHelperText>
      </Wrapper>

      <Button disabled={isLoading} type="submit" variant="contained">
        <div>
          <span>Register</span>
          {isLoading && <LinearProgress color="secondary" />}
        </div>
      </Button>
    </Container>
  );
}

export default SignUp;
const Container = styled.form`
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
  .error{
    color:#f12727
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
`;
