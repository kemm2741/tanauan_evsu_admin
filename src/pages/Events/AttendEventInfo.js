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
}));

const AttendEventInfo = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const [eventData, setEventData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});

  //   Fetch Event
  const fetchEventInfo = async () => {
    try {
      setIsLoading(true);

      const { data, status } = await axios.post(
        `${baseURL}/event/user-attend-event-info`,
        {
          atttendId: id,
        }
      );

      setEventData(data.event);
      setUserData(data.user);

      console.log(data.user);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventInfo();
  }, []);

  useEffect(() => {
    fetchEventInfo();
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
            <Grid xs={12} md={12} lg={12} item>
              <Card className={classes.formContainer}>
                <CardContent>
                  <Typography
                    align="center"
                    className={classes.formTitle}
                    gutterBottom
                    variant="h4"
                  >
                    Attending at {eventData.eventTitle}
                  </Typography>
                  {/* <Typography paragraph color="textSecondary" gutterBottom>
                    Review profile
                  </Typography> */}
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

                    <Grid xs={12} sm={12} item>
                      <TextField
                        value={userData.yearGraduated}
                        label="Year Graduated"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    {/* <Grid xs={12} sm={6} item>
                      <TextField
                        value={userData.course.courseName}
                        label="Course"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid> */}

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

                    {/* <Grid xs={12} sm={12} item>
                    <Button
                      // className={classes.formButton}
                      // onClick={deleteAccount}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Delete Resume
                    </Button>
                  </Grid> */}
                  </Grid>
                </form>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default AttendEventInfo;
