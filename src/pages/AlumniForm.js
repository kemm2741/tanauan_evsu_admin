import React, { useState, useEffect } from "react";

// ! Import Base URL
import { baseURL } from "../utils/baseURL";

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
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

// Material UI Icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

// Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Check Box
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

// Import axios
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: "700px",
    margin: "0px auto 50px auto",
    border: "3.5px #710000 solid",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      width: "420px",
      marginBottom: "20px",
    },
  },
  logo: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  formTitle: {
    textAlign: "center",
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
}));

function AlumniForm() {
  const classes = useStyles();

  const [loadingCourse, setLoadingCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const initalState = {
    name: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    sex: "",
    batch: "",
    course: "",
    status: "",
    currentWork: "",
    monthlyIncome: "",
    yearlyIncome: "",
    jobExperience: "",
  };
  const [userData, setUserData] = useState(initalState);

  // Image Function Upload
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Email Subscription Function
  const [subscriberEmail, setSubscriberEmail] = useState(false);
  const [isLoadingSubscriber, setIsloadingSubscriber] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Creating User from database
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      middleName,
      lastName,
      email,
      phoneNumber,
      age,
      sex,
      batch,
      course,
      status,
      currentWork,
      monthlyIncome,
      yearlyIncome,
      jobExperience,
    } = userData;

    if (name === "") {
      return Swal.fire("Error ", "Please Enter name", "error");
    }

    if (middleName === "") {
      return Swal.fire("Error ", "Please enter Middle Name", "error");
    }

    if (lastName === "") {
      return Swal.fire("Error ", "Please enter Last Name", "error");
    }

    if (email === "") {
      return Swal.fire("Error ", "Please enter Email", "error");
    }

    if (phoneNumber === "") {
      return Swal.fire("Error ", "Please enter Mobile#", "error");
    }

    if (age === "") {
      return Swal.fire("Error ", "Please enter your age", "error");
    }

    if (sex === "") {
      return Swal.fire("Error ", "Please enter sex", "error");
    }

    if (batch === "") {
      return Swal.fire("Error ", "Please enter your batch", "error");
    }

    if (course === "") {
      return Swal.fire("Error ", "Please enter your course", "error");
    }

    if (status === "") {
      return Swal.fire("Error ", "Please enter your course", "error");
    }

    if (currentWork === "") {
      return Swal.fire(
        "Error ",
        "Please enter your work if none please write none",
        "error"
      );
    }

    if (monthlyIncome === "") {
      return Swal.fire("Error ", "Please enter monthly income", "error");
    }

    if (yearlyIncome === "") {
      return Swal.fire("Error ", "Please enter yearly income", "error");
    }

    if (jobExperience === "") {
      return Swal.fire(
        "Error ",
        "Please enter your first job experience",
        "error"
      );
    }

    if (image === "") {
      return Swal.fire("Error ", "Please select image", "error");
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "iyvxqf5y");

    // Delete Auth Token From Header
    delete axios.defaults.headers.common["auth-token"];
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dcbmrwiu6/image/upload",
        formData
      );
      createUser(course, data.url);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    // Bring Back Auth Token From Header
    axios.defaults.headers.common["auth-token"] = localStorage.getItem("token");
  };

  const createUser = async (course, image) => {
    try {
      const mainData = {
        ...userData,
        image,
      };
      // console.log(mainData);
      const { data } = await axios.post(`${baseURL}/user`, mainData);

      const userId = data._id;
      await axios.put(`${baseURL}/course/addUser/${course}`, {
        users: userId,
      });
      setIsLoading(false);
      Swal.fire(
        "Success",
        "Thank you for answering the survey form",
        "success"
      );
      // Reset DATA
      setUserData(initalState);
    } catch (error) {
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      console.log(error);
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Check box
  const [isCheck, setIsCheck] = useState(true);
  const handleChange = (event) => {
    setIsCheck(!isCheck);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    handleClose();
    try {
      setIsloadingSubscriber(true);
      await axios.post(`${baseURL}/subscribe`, {
        subscriberEmail,
      });

      setIsloadingSubscriber(false);
      Swal.fire("Success", "Your email is now subscribed", "success");
    } catch (error) {
      setIsloadingSubscriber(false);
      Swal.fire("Error", `${error.response.data.msg}`, "error");
    }
  };

  // Fetch Courses
  const fetchCourse = async () => {
    try {
      setLoadingCourse(true);
      const { data } = await axios.get(`${baseURL}/course`);
      setCourseData(data);
      setLoadingCourse(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <>
      {isLoading || loadingCourse || isLoadingSubscriber ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Grid container>
            <Card className={classes.formContainer}>
              <CardContent>
                {/* <div className={classes.logo}>
                  <img
                    style={{ width: "160px" }}
                    src="https://tanauan.evsu.edu.ph/wp-content/uploads/2017/08/favicon.png"
                    alt="evsu logo"
                  />
                </div> */}
                <Typography
                  className={classes.formTitle}
                  gutterBottom
                  variant="h4"
                >
                  Alumni Tracer Form
                </Typography>
                {/* <Typography paragraph color="textSecondary" gutterBottom>
                
                </Typography> */}
              </CardContent>
              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.name}
                      onChange={handleOnChange}
                      name="name"
                      label="Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.middleName}
                      onChange={handleOnChange}
                      name="middleName"
                      label=" Middle Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={userData.lastName}
                      onChange={handleOnChange}
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={userData.email}
                      onChange={handleOnChange}
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={userData.phoneNumber}
                      onChange={handleOnChange}
                      name="phoneNumber"
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.age}
                      onChange={handleOnChange}
                      name="age"
                      label="Age"
                      variant="outlined"
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.sex}
                      onChange={handleOnChange}
                      name="sex"
                      label="Sex"
                      variant="outlined"
                      fullWidth
                      select
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.batch}
                      onChange={handleOnChange}
                      name="batch"
                      label="Batch Graduated"
                      variant="outlined"
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.course}
                      onChange={handleOnChange}
                      name="course"
                      label="Course"
                      variant="outlined"
                      fullWidth
                      select
                    >
                      {courseData.map((course, index) => (
                        <MenuItem key={index} value={course._id}>
                          {course.courseName} ({course.courseAbbreviation})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.status}
                      onChange={handleOnChange}
                      name="status"
                      label="Status"
                      variant="outlined"
                      fullWidth
                      select
                    >
                      <MenuItem key={1} value="employed">
                        Employed
                      </MenuItem>
                      <MenuItem key={2} value="unemployed">
                        Unemployed
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.currentWork}
                      onChange={handleOnChange}
                      name="currentWork"
                      label="Current Work"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.monthlyIncome}
                      onChange={handleOnChange}
                      name="monthlyIncome"
                      label="Monthly Income"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    <TextField
                      value={userData.yearlyIncome}
                      onChange={handleOnChange}
                      name="yearlyIncome"
                      label="Yearly Income"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      onChange={handleOnChange}
                      label="Life Status"
                      value={userData.jobExperience}
                      name="jobExperience"
                      variant="outlined"
                      multiline
                      rows={7}
                      fullWidth
                      //   required
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item>
                    {/* <Typography paragraph> Upload Image</Typography>
                    <input
                      // style={{ width: "100%" }}
                      onChange={handleImageChange}
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                    /> */}

                    <label htmlFor="contained-button-file">
                      <Button
                        style={{ marginBottom: "10px" }}
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload Image
                      </Button>
                    </label>
                    <input
                      accept="image/png, image/gif, image/jpeg"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      onChange={handleImageChange}
                      type="file"
                    />
                  </Grid>

                  {/* <Grid style={{ cursor: "pointer" }} xs={12} sm={12} item>
                    <Typography paragraph>
                      Read Terms and Conditions here
                    </Typography>
                  </Grid> */}

                  {/* <Grid xs={12} sm={12} item>
                    <FormControlLabel
                      style={{ marginTop: "-30px" }}
                      control={
                        <Checkbox
                          checked={isCheck}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label="I Agree at Terms and Conditions"
                    />
                  </Grid> */}

                  <Grid xs={12} sm={12} item>
                    <Button
                      className={classes.formButton}
                      onClick={handleSubmit}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!isCheck ? true : false}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {/* <Button
                className={classes.subscribeButton}
                onClick={handleClickOpen}
                variant="contained"
                color="secondary"
              >
                Subscribe To Us
              </Button> */}
            </Card>
          </Grid>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To get notification at EVSU Tracer, please enter your email
                address here. We will send you updates and events occasionally.
                Thank you!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                onChange={(e) => {
                  setSubscriberEmail(e.target.value);
                }}
                label="Email Address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubscribe} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default AlumniForm;
