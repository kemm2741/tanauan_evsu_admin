import React, { useEffect, useState } from "react";

// ! Import Base URL
import { baseURL } from "../../utils/baseURL";

import { useParams, useHistory } from "react-router-dom";

// Import axios
import axios from "axios";

// Sweet Alert
import Swal from "sweetalert2";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(5),
    padding: theme.spacing(4),
  },
  formContainer: {
    width: "80%",
    border: "2px #710000 solid",
    margin: "0 auto",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),

    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "-40px",
      width: "100%",
      padding: theme.spacing(2),
      marginBottom: "70px",
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
  profileImageContainer: {
    width: "100%",
    display: "block",
    margin: "0 auto",
    marginBottom: "15px",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "block",
    margin: "0 auto",
  },
  accountRemovedText: {
    width: "100%",
    textAlign: "center",
  },
}));

const NewSignUp = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  //   Fetch Newly Signed Up User
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axios.get(
        `${baseURL}/user/get-user-information/${id}`
      );

      console.log(data);

      if (status === 200) {
        setUserData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleApprovedAccount = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${baseURL}/user/update-status-user`, {
        userId: id,
        status: "active",
      });
      setIsLoading(false);
      fetchUserInfo();
      Swal.fire("Success", "User account is now approved", "success");
      history.push("/alumni");
    } catch (error) {
      setIsLoading(false);
      Swal.fire("Error", `${error.response.data.msg}`, "error");
    }
  };

  const deleteUserAccount = async (e) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${baseURL}/user/deleting-pending-request`,
        {
          userId: id,
          cloudinary_id: userData.profile.cloudinary_id,
        }
      );
      setIsLoading(false);
      setUserData(null);
      Swal.fire("Success", "User account is now deleted", "success");
      // history.push("/dashboard");
    } catch (error) {
      setIsLoading(false);
      Swal.fire("Error", `${error.response.data.msg}`, "error");
    }
  };

  useEffect(() => {
    fetchUserInfo();
    return () => {
      setUserData(null);
    };
  }, []);

  useEffect(() => {
    fetchUserInfo();
    return () => {
      setUserData(null);
    };
  }, [id]);

  return (
    <>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.paper}>
          <Grid container>
            {userData ? (
              <Grid xs={12} md={12} lg={12} item>
                <Card className={classes.formContainer}>
                  <CardContent>
                    {userData.status === "active" ? (
                      <>
                        <Typography
                          className={classes.formTitle}
                          gutterBottom
                          align="center"
                          variant="h4"
                        >
                          Account is actived
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          className={classes.formTitle}
                          gutterBottom
                          align="center"
                          variant="h4"
                        >
                          Newly Signed Up Alumni
                        </Typography>
                        <Typography
                          paragraph
                          color="textSecondary"
                          gutterBottom
                          align="center"
                        >
                          Review profile
                        </Typography>
                      </>
                    )}
                  </CardContent>
                  <form noValidate autoComplete="off">
                    <Grid
                      justify="center"
                      alignItems="center"
                      className={classes.profileImageContainer}
                      xs={5}
                      item
                    >
                      <img
                        className={classes.profileImage}
                        src={userData?.profile?.url}
                        alt="profile-pic"
                      />
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.firstname}
                          label="First Name"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.middlename}
                          label="Middle Name"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.lastname}
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.placeOfBirth}
                          label="Place of Birth"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.yearGraduated}
                          label="Year Graduated"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.course.courseName}
                          label="Course"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.presentOccupation}
                          label="Present Occupation"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.companyAddress}
                          label="Company Address"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.email}
                          label="Email"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} sm={6} item>
                        <TextField
                          value={userData.phone}
                          label="Contact"
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      {userData.status === "pending" && (
                        <>
                          <Grid xs={12} sm={6} item>
                            <Button
                              className={classes.formButton}
                              onClick={handleApprovedAccount}
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                            >
                              Approved Account
                            </Button>
                          </Grid>

                          <Grid xs={12} sm={6} item>
                            <Button
                              className={classes.formButton}
                              onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "Account will be deleted!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteUserAccount();
                                  }
                                });
                              }}
                              type="submit"
                              variant="contained"
                              color="primary"
                              fullWidth
                            >
                              Delete Account
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </form>
                </Card>
              </Grid>
            ) : (
              <div className={classes.accountRemovedText}>
                <h1> Account has been removed! </h1>
              </div>
            )}
          </Grid>
        </div>
      )}
    </>
  );
};

export default NewSignUp;
