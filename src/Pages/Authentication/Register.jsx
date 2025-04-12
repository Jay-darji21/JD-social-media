import {
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { registerUserAction } from "../../Redux/Auth/auth.action";
import { useNavigate } from "react-router-dom";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  gender: Yup.string().required("Gender is required"),
});

const Register = ({ setLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  
  useEffect(() => {
    if (auth.jwt) {
      navigate('/');
    }
  }, [auth.jwt, navigate]);

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      setLoading(true);
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = values;
      
      // Remove unwrap() and handle the promise directly
      await dispatch(registerUserAction(registrationData));
      
      setSnackbarMessage("Registration successful! Redirecting to login...");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
      // Reset form after successful registration
      resetForm();
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/auth/signin');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle field-specific errors
      if (error.fieldError) {
        setFieldError(error.fieldError.field, error.fieldError.message);
      }
      
      // Show error message in snackbar
      setSnackbarMessage(error.message || "Registration failed. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-5">
            <div className="space-y-5">
              <div>
                <Field
                  as={TextField}
                  name="firstName"
                  placeholder="First Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={touched.firstName && errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="lastName"
                  placeholder="Last Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={touched.lastName && errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </div>
              <div>
                <Field
                  as={TextField}
                  name="email"
                  placeholder="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                />
              </div>
              <div>
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      error={touched.password && errors.password}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
              </div>
              <div>
                <Field name="confirmPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      fullWidth
                      error={touched.confirmPassword && errors.confirmPassword}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>
              </div>
              <div>
                <Field name="gender">
                  {({ field }) => (
                    <div>
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                      {touched.gender && errors.gender && (
                        <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <Button
                sx={{ padding: ".8rem 0rem" }}
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                className="hover-effect"
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" className="loading-pulse" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
