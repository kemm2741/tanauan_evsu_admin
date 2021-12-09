import React, { useState, useEffect } from "react";

// !Base URL
import { baseURL } from "../utils/baseURL";

// Import axios
import axios from "axios";

// Material UI Date Picker
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// React Router
import { useHistory } from "react-router-dom";

// Material UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// Sweet Alert
import Swal from "sweetalert2";

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
  circularContainer: {
    height: "30vh",
    marginTop: 20,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginInline: "auto",
  },
});

export default function CreateJob() {
  const classes = useStyles();
  const history = useHistory();

  //   Initial State
  const intialState = {
    jobTitle: "",
    jobCompany: "",
    jobDescription: "",
  };

  //   Main Data
  const [jobData, setJobData] = useState(intialState);
  const [isLoading, setIsLoading] = useState(false);
  //  Subscribe Emails
  const [subscriberEmails, setSubscriberEmails] = useState([]);

  //   Date Functions
  const [selectedDate, setSelectedDate] = useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //   Image Functions
  const [jobImage, setJobImage] = useState("");
  const handleImageChange = (e) => {
    setJobImage(e.target.files[0]);
  };

  //  Handle Onchange
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value,
    });
  };

  //   Create Job Fucntion
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jobData.jobTitle === "") {
      return Swal.fire("Error", "Please enter valid Job Title", "error");
    }

    if (jobData.jobDescription === "") {
      return Swal.fire("Error", "Please enter valid Job description", "error");
    }

    // if (selectedDate === "") {
    //   return Swal.fire("Error", "Please enter valid Job date", "error");
    // }

    if (jobImage === "") {
      return Swal.fire("Error", "Please enter valid job image", "error");
    }

    const formData = new FormData();
    formData.append("file", jobImage);
    formData.append("upload_preset", "iyvxqf5y");

    // Delete Auth Token From Header
    delete axios.defaults.headers.common["auth-token"];
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dcbmrwiu6/image/upload",
        formData
      );

      const emails = subscriberEmails.map((a) => a.subscriberEmail);

      axios
        .post(`${baseURL}/job`, {
          jobTitle: jobData.jobTitle,
          jobCompany: jobData.jobCompany,
          jobDescription: jobData.jobDescription,
          jobImage: data.url,
          emails,
        })
        .then(() => {
          Swal.fire("Success", "New Job Added", "success");
          history.push("/jobs");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", `${error.response.data.msg}`, "error");
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    // Bring Back Auth Token From Header
    axios.defaults.headers.common["auth-token"] = localStorage.getItem("token");
  };

  // fetch Emails
  const fetchSubscriber = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/subscribe`);
      setSubscriberEmails(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, []);

  return (
    <Container size="sm">
      {isLoading ? (
        <div className={classes.circularContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Typography variant="h5" component="h1" gutterBottom>
            Post New Job
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              className={classes.field}
              onChange={handleOnChange}
              label="Job Title"
              variant="outlined"
              name="jobTitle"
              value={jobData.jobTitle}
              fullWidth
              required
            />

            <TextField
              className={classes.field}
              onChange={handleOnChange}
              label="Job Company Name"
              variant="outlined"
              name="jobCompany"
              value={jobData.jobCompany}
              fullWidth
              required
            />

            <TextField
              className={classes.field}
              onChange={handleOnChange}
              label="Job Description"
              variant="outlined"
              name="jobDescription"
              value={jobData.jobDescription}
              fullWidth
              required
              multiline
              rows={4}
            />

            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.field}
                margin="normal"
                label="Event Schedule"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                variant="outlined"
              />
            </MuiPickersUtilsProvider> */}

            <div className={classes.field}>
              <label htmlFor="contained-button-file">
                <Button
                  style={{ marginRight: "10px" }}
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
            </div>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </Container>
  );
}
