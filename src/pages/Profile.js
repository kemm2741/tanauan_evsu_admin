import React, { useState, useContext } from "react";

// ! Import Base URL
import { baseURL } from "../utils/baseURL";

// React Router Dom
import { useHistory } from "react-router-dom";

// Sweet Alert
import Swal from "sweetalert2";
import Alert from "@material-ui/lab/Alert";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Context
import AuthContext from "../context/auth/authContext";

// Import axios
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(5),
    padding: theme.spacing(4),
  },
  formContainer: {
    width: "530px",
    margin: "0 auto",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginTop: "-40px",
      width: "450px",
      padding: theme.spacing(2),
      marginBottom: "20px",
    },
  },
  formTitle: {
    fontSize: "30px",
  },
  formButton: {
    padding: "10px",
  },
  subscribeButton: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    width: "200px",
    height: "40vh",
    marginInline: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  errorAlert: {
    marginBottom: "25px",
  },
  loadingContainer: {
    width: "400px",
    marginInline: "auto",
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  },
}));

const Profile = () => {
  const history = useHistory();
  const classes = useStyles();
  // initiate Context
  const authContext = useContext(AuthContext);

  // Global Context
  const { logout, loadAdmin, admin } = authContext;

  // Admin State
  const [isLoading, setIsLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminData, setAdminData] = useState({
    ...admin,
    oldPassword: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(adminData);

    // Handling Update
    if (adminData.password.length < 6) {
      return Swal.fire(
        "Error updating",
        "Password length must be greater than 6",
        "error"
      );
    }

    try {
      setIsLoading(true);
      await axios.put(`${baseURL}/changePassword/${admin._id}`, adminData);
      setIsLoading(false);

      history.push("/admin");

      Swal.fire(
        "Update Success",
        `${adminData.userName}'s profile was successfully updated!`,
        "success"
      );
    } catch (error) {
      adminData.password = "";
      adminData.oldPassword = "";
      setIsLoading(false);
      setAdminError(error.response.data.msg);
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "This Admin Account will be deleted adn you will be automatically logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${baseURL}/admin/${admin._id}`).then((res) => {
          // Response delete adimin
          axios
            .post(`${baseURL}/log`, {
              name: adminData.userName,
              logDescription: "Admin account deleted",
            })
            .then((res) => {
              // Response post activity log admin deleted
              logout();
              Swal.fire(
                "Deleted!",
                "Admin account was deleted successfully",
                "success"
              );
            });
        });
      }
    });
  };

  return (
    <div>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.paper}>
          <Grid container>
            <Card className={classes.formContainer}>
              <CardContent>
                <Typography
                  className={classes.formTitle}
                  gutterBottom
                  variant="h4"
                >
                  My Profile
                </Typography>
                <Typography paragraph color="textSecondary" gutterBottom>
                  Update your profile
                </Typography>
              </CardContent>

              {adminError && (
                <Alert className={classes.errorAlert} severity="error">
                  {adminError}
                </Alert>
              )}

              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <TextField
                      value={adminData.email}
                      onChange={handleOnChange}
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <TextField
                      value={adminData.userName}
                      onChange={handleOnChange}
                      name="userName"
                      label="Username"
                      variant="outlined"
                      disabled
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.phoneNumber}
                      onChange={handleOnChange}
                      name="phoneNumber"
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.oldPassword}
                      onChange={handleOnChange}
                      name="oldPassword"
                      label="Enter old Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.password}
                      onChange={handleOnChange}
                      name="password"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <Button
                      className={classes.formButton}
                      onClick={handleSubmit}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Update
                    </Button>
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <Button
                      className={classes.formButton}
                      onClick={deleteAccount}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Delete Account
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Profile;
