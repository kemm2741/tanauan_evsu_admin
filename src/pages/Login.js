import React, { useState, useEffect, useContext } from "react";

// BASE URL
import { baseURL } from "../utils/baseURL";

// React Router Dom
import { useHistory } from "react-router-dom";

// Import Axios
import axios from "axios";

// Sweet Alert
import Swal from "sweetalert2";
import Alert from "@material-ui/lab/Alert";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// Login Actions
import AuthContext from "../context/auth/authContext";

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    width: "100%",
    maxWidth: "500px",
    marginInline: "auto",
    marginTop: "-50px",
    border: "2.5px #710000 solid",
    padding: "30px 10px 10px 10px",
    boxShadow: "-14px 15px 26px -22px rgba(0,0,0,1)",
  },
  formInput: {
    height: "50px",
    marginBottom: "20px",
  },
  formText: {
    marginBottom: "5px",
  },
  formBtn: {
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: "40px",
    outline: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    backgroundColor: "#710000",
    cursor: "pointer",
    marginTop: "5px",
  },
  qrDiv: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  formContainer: {
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    marginInline: "auto",
    marginTop: "20px",
    padding: " 30px 20px 40px 20px",
  },
  errorAlert: {
    marginBottom: theme.spacing(2),
  },
  loadingContainer: {
    width: "100%",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "100px",
  },
  loginTitle: {
    marginBottom: "10px",
    marginTop: "5px",
  },
  forgotPasswordContainer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
  },
}));

const Login = () => {
  const classes = useStyles();
  let history = useHistory();

  const authContext = useContext(AuthContext);
  const { isAuthenticatedLogin, isLoading, errorLogin, loginAdmin } =
    authContext;

  const initialState = {
    email: "",
    password: "",
  };

  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const [loginData, setLoginData] = useState(initialState);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === "" && loginData.password === "") {
      return Swal.fire(
        "Error Login",
        "Please provide valid email and password",
        "error"
      );
    }

    if (loginData.email === "") {
      return Swal.fire("Error Login", "Email must not be empty!", "error");
    }

    if (loginData.password === "") {
      return Swal.fire("Error Login", "Password must not be empty", "error");
    }

    // No Error Input Login
    loginAdmin(loginData);

    // Reset Input
    setLoginData(initialState);
  };

  useEffect(() => {
    if (isAuthenticatedLogin) {
      // Swal.fire("Success Login", "Welcome to EVSU Alumni Tracer", "success");
      history.push("/");
    }
  }, [isAuthenticatedLogin]);

  return (
    <>
      {isLoading || loadingResetPassword ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className={classes.loginContainer}>
            <div className={classes.qrDiv}>
              <img
                style={{ width: "200px" }}
                src="https://tanauan.evsu.edu.ph/wp-content/uploads/2017/08/favicon.png"
                alt="evsu-logo"
              />
            </div>
            <div>
              <Typography
                className={classes.loginTitle}
                variant="h4"
                align="center"
              >
                EVSU Alumni Tracer
              </Typography>
              <Typography color="textSecondary" paragraph align="center">
                My alma mater implored me to send them a donation. If anything,
                I should write them an equal invitation.
              </Typography>
            </div>
            <form
              className={classes.formContainer}
              noValidate
              autoComplete="off"
            >
              <div className={classes.formText}>
                <Typography variant="h5"> Alumni Tracer </Typography>
                <Typography color="textSecondary" paragraph>
                  Eastern Visayas State University
                </Typography>
              </div>
              {errorLogin && (
                <Alert className={classes.errorAlert} severity="error">
                  {errorLogin}
                </Alert>
              )}
              <TextField
                className={classes.formInput}
                onChange={handleOnChange}
                name="email"
                type="text"
                label="Admin"
                value={loginData.email}
                variant="outlined"
              />
              <TextField
                className={classes.formInput}
                onChange={handleOnChange}
                name="password"
                type="password"
                value={loginData.password}
                label="Password"
                variant="outlined"
              />
              <input
                onClick={handleLogin}
                className={classes.formBtn}
                type="submit"
                value="Login"
              />

              <Grid
                onClick={async () => {
                  const { value: email } = await Swal.fire({
                    title: "Input email address",
                    input: "email",
                    inputLabel: "Your email address",
                    inputPlaceholder: "Enter your email address",
                    confirmButtonColor: "#710000",
                    inputAttributes: {
                      autocomplete: "off",
                    },
                  });

                  if (email?.trim()) {
                    try {
                      setLoadingResetPassword(true);
                      const { data } = await axios.post(
                        `${baseURL}/admin/reset-admin`,
                        { email }
                      );
                      Swal.fire(`${data.msg}`);

                      await axios
                        .post(`${baseURL}/log`, {
                          name: data.email,
                          logDescription: "Resetted Password",
                        })
                        .then((res) => {
                          console.log(res.data);
                        })
                        .catch((err) => console.log(err.response.data.msg));

                      setLoadingResetPassword(false);
                    } catch (err) {
                      Swal.fire(`${err.response.data.msg}`);
                      setLoadingResetPassword(false);
                    }
                  }
                }}
                className={classes.forgotPasswordContainer}
                item
              >
                <Link variant="body2">{"Reset Password?"}</Link>
              </Grid>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
