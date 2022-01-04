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

const JobNotification = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const [mainData, setMainData] = useState([]);
  const [jobApplication, setJobApplication] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [userData, setUserData] = useState({});

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
        setMainData(data.jobApp);
        setUserData(data.jobApp.user);

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

  const handleSubmitResume = async () => {
    const resume = jobApplication.resume.map((data) => data.url);
    const email = jobApplication.job.email;
    const jobTitle = jobApplication.job.jobTitle;

    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${baseURL}/admin/send-job-application-resume`,
        {
          resume,
          email,
          jobTitle,
        }
      );
      Swal.fire("Success", "Resume has been sent!", "success");
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobInfo();
  }, []);

  useEffect(() => {
    fetchJobInfo();
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
            <Grid xs={12} md={6} lg={6} item>
              <Card className={classes.formContainer}>
                <CardContent>
                  <Typography
                    className={classes.formTitle}
                    gutterBottom
                    variant="h4"
                    align="center"
                  >
                    Job Application Form
                  </Typography>
                  <Typography
                    paragraph
                    color="textSecondary"
                    align="center"
                    gutterBottom
                  >
                    Applying for {mainData.job?.jobTitle} at {""}
                    {mainData.job?.jobCompany}
                  </Typography>
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

                    <Grid xs={12} sm={12} item>
                      <Button
                        className={classes.formButton}
                        // onClick={handleSubmitResume}
                        onClick={(e) => {
                          e.preventDefault();
                          Swal.fire({
                            title: `You are sending this resume to ${mainData.job?.jobCompany}`,
                            text: "please review resume before sending",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Submit!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleSubmitResume();
                            }
                          });
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Send Resume
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
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default JobNotification;
