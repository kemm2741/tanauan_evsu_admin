import React, { useState, useEffect } from "react";

// ! Import BaseURL
import { baseURL } from "../utils/baseURL";

// SweetAlert
import Swal from "sweetalert2";

// Material Form
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

// Import matarial table
import MaterialTable from "material-table";

// Import axios
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(3),
  },
  circularContainer: {
    width: "100%",
    height: "30vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Admin = () => {
  const classes = useStyles();

  const initialState = {
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  };
  const [admin, setAdmin] = useState(initialState);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  const [columns, setColumns] = useState([
    { title: "Name", field: "userName" },
    { title: "Email", field: "email" },
    { title: "Contact Number", field: "phoneNumber" },
  ]);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateUser, setIsLoadingCreateUser] = useState(false);

  // Fetch Admins
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/admin`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Destructuring Data
    const { userName, email, phoneNumber, password } = admin;

    // Check if all fields are filled
    if (!userName && !email && !phoneNumber && !password) {
      return Swal.fire(
        "Error",
        "Please fill the form with valid data",
        "error"
      );
    }

    if (!userName) {
      return Swal.fire("Error", "Please enter username", "error");
    }

    if (!email) {
      return Swal.fire("Error", "Please enter email", "error");
    }

    if (!phoneNumber) {
      return Swal.fire("Error", "Please enter phoneNumber", "error");
    }

    if (password.length < 6) {
      return Swal.fire("Error", "Atleast 6 charcters long", "error");
    }

    // Post Request to Create Admin
    try {
      setIsLoadingCreateUser(true);

      const { data } = await axios.post(`${baseURL}/admin`, {
        userName,
        email,
        phoneNumber,
        password,
      });

      Swal.fire("Success", `${data.msg}`, "success");
      fetchAdmins();

      setIsLoadingCreateUser(false);
    } catch (error) {
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      setIsLoadingCreateUser(false);
    }

    // Reset State
    setAdmin(initialState);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={3}>
        {isLoadingCreateUser ? (
          <div className={classes.circularContainer}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Grid container>
              <Card className={classes.formContainer}>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    Create Admin
                  </Typography>
                  <Typography paragraph color="textSecondary" gutterBottom>
                    Create a new admin.
                  </Typography>
                </CardContent>
                <form noValidate autoComplete="off">
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={12} item>
                      <TextField
                        onChange={handleOnChange}
                        value={admin.userName}
                        name="userName"
                        label="Username"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <TextField
                        onChange={handleOnChange}
                        value={admin.email}
                        name="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <TextField
                        onChange={handleOnChange}
                        value={admin.phoneNumber}
                        name="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <TextField
                        onChange={handleOnChange}
                        value={admin.password}
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
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
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid item xs={12} md={8} lg={9}>
        <MaterialTable
          isLoading={isLoading}
          title="Admins"
          columns={columns}
          data={data}
          options={{
            exportButton: false,
            filtering: true,
            pageSize: 10,
            toolbar: true,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Admin;
