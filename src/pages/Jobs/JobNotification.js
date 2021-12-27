import React, { useEffect, useState } from "react";

// ! Import Base URL
import { baseURL } from "../../utils/baseURL";

import { useParams, useHistory } from "react-router-dom";

// Import axios
import axios from "axios";

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

// Image Viewer
import ImageViewer from "../../utils/ImageViwer";

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

const JobNotification = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const [jobApplication, setJobApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState([]);

  //   fetch job apply info
  const fetchJobInfo = async () => {
    try {
      setIsLoading(true);

      const { data, status } = await axios.get(
        `${baseURL}/job/get-job-apply-info/${id}`
      );

      if (status === 200) {
        const { resume } = data.jobApp;
        setJobApplication(data.jobApp);

        console.log(data.jobApp);

        setImages(
          resume.map((resum, index) => {
            if (index === 0) {
              return {
                url: resum.url,
                active: true,
              };
            } else {
              return {
                url: resum.url,
                active: false,
              };
            }
          })
        );

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSubmitResume = async (e) => {
    e.preventDefault();

    const email = jobApplication.job.email;
    const jobTitle = jobApplication.job.jobTitle;
    const resume = jobApplication.resume.map((data) => data.url);

    console.log(resume);

    try {
      const { data } = await axios.post(
        `${baseURL}/admin/send-job-application-resume`,
        {
          resume,
          email,
          jobTitle,
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobInfo();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.paper}>
          <Grid container>
            <Grid xs={12} md={6} lg={6} item>
              <Card className={classes.formContainer}>
                <CardContent>
                  <Typography
                    className={classes.formTitle}
                    gutterBottom
                    variant="h4"
                  >
                    Job Application Profile
                  </Typography>
                  <Typography paragraph color="textSecondary" gutterBottom>
                    Review profile
                  </Typography>
                </CardContent>

                <form noValidate autoComplete="off">
                  <Grid container spacing={2}>
                    <Grid xs={12} item>
                      <TextField
                        // value={adminData.email}
                        // onChange={handleOnChange}
                        name="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>

                    <Grid xs={12} item>
                      <TextField
                        // value={adminData.userName}
                        // onChange={handleOnChange}
                        name="userName"
                        label="Username"
                        variant="outlined"
                        disabled
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <TextField
                        // value={adminData.phoneNumber}
                        // onChange={handleOnChange}
                        name="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <TextField
                        // value={adminData.oldPassword}
                        // onChange={handleOnChange}
                        name="oldPassword"
                        label="Enter old Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <TextField
                        // value={adminData.password}
                        // onChange={handleOnChange}
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
                        onClick={handleSubmitResume}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Approve Resume
                      </Button>
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

            <Grid xs={12} md={6} lg={6} item>
              <Card className={classes.formContainer}>
                <CardContent>
                  <Typography
                    className={classes.formTitle}
                    gutterBottom
                    variant="h4"
                  >
                    Resume
                  </Typography>
                </CardContent>

                <ImageViewer setImages={setImages} images={images} />
                {/* <img src={jobApplication.resume[0].url} alt="profile-image" /> */}
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default JobNotification;
