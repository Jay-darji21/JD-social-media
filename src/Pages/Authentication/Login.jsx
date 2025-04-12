import { 
  Button, 
  IconButton, 
  InputAdornment, 
  TextField, 
  Alert, 
  Snackbar, 
  CircularProgress 
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../Redux/Auth/auth.action";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const initialValue = { email: "", password: "" };
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must contain at least 6 characters")
    .required("Enter your password"),
});

const Login = ({ setLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  
  // Check if user is already logged in
  useEffect(() => {
    if (auth.token) {
      navigate('/');
    }
  }, [auth.token, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const result = await dispatch(loginUserAction(values));
      
      // If we get here, login was successful
      setSnackbarMessage("Login successful! Redirecting...");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Login failed:', error);
      setSnackbarMessage(error.message || "Login failed. Please check your credentials.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="space-y-5">
              <div>
                <Field
                  as={TextField}
                  name="email"
                  placeholder="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
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
                  "Login"
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
