// ?
import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import Swal from "sweetalert2";

//! Base URL;
import { baseURL } from "../utils/baseURL";

import { useHistory } from "react-router-dom";

// Base 64
import base64 from "../utils/base64";
import ImageGallery from "../utils/ImageGallery";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Material UI Date Picker
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Import react select
import Select from "react-select";

// Import axios
import axios from "axios";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "20px 10px",
    minHeight: 700,
  },
  title: {
    fontSize: 14,
  },
  field: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  selectedCourse: {
    marginBottom: "15px",
  },
  submitButton: {
    marginTop: "30px",
    marginLeft: "5px",
  },
  editorContainer: {
    border: "1px #111 solid",
    width: "100%",
  },
  circularContainer: {
    width: "100%",
    height: "30vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const CreateEvent = () => {
  const classes = useStyles();
  const history = useHistory();

  const intialState = {
    eventTitle: "",
    eventDescription: "",
  };

  const [editorState, setEditorState] = useState(null);
  const [eventData, setEventData] = useState(intialState);

  // Couse options
  const [options, setOptions] = useState([]);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Selected Courses
  const [selectedCourse, setSelectedCourses] = useState([]);
  const [type, setType] = useState(true);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Fetch Course
  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/course`);
      const courseOption = data.map((course) => {
        return {
          value: course._id,
          label: `${course.courseName} (${course.courseAbbreviation})`,
        };
      });
      setOptions(courseOption);
    } catch (error) {
      console.log(error);
    }
  };

  //   Date Functions
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Image Upload Change
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const { files } = e.target;
    for (let file of files) {
      setImages([...images, { file, based: base64(file) }]);
    }
  };

  // Rich Text
  const settingUpRichText = () => {
    const html = "<span></span>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };

  // Submit Event
  const submitEvent = async () => {
    const form = new FormData();

    const description = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";

    const course = selectedCourse.map((data) => data.value);

    if (selectedDate === "") {
      return Swal.fire("error", "Date must not be empty", "error");
    }

    if (eventData.eventTitle === "") {
      return Swal.fire("error", "Title must not be empty", "error");
    }

    if (description === "") {
      return Swal.fire("error", "Title must not be empty", "error");
    }

    if (!type) {
      if (course.length < 1) {
        return Swal.fire("error", "Please select a course", "error");
      }
    }

    if (images.length < 1) {
      return Swal.fire("error", "Image is required at least 1", "error");
    }

    form.append("eventSchedule", selectedDate);
    form.append("eventTitle", eventData.eventTitle);
    form.append("eventDescription", description);
    form.append("type", type);
    form.append("course", JSON.stringify(course));

    for (let image of images) {
      form.append("images", image.file);
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(`${baseURL}/event`, form);
      console.log(data);
      setIsLoading(false);
      Swal.fire("Success", "Successfully created a new event", "success");
      history.push("/events");
    } catch (error) {
      setIsLoading(false);
      Swal.fire("Error", `${error.response.data.msg}`, "error");
    }
  };

  // Rich Text Use Effect
  useEffect(() => {
    settingUpRichText();
  }, []);

  // Courses Use Effect
  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={classes.circularContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Card className={classes.root} variant="outlined">
            <h2 align="center"> Add Event </h2>
            <TextField
              onChange={handleOnChange}
              label="Event Title"
              variant="outlined"
              name="eventTitle"
              // value={eventData.eventTitle}
              fullWidth
              required
            />

            <TextField
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              name="sendDetails"
              className={classes.field}
              label="Courses"
              variant="outlined"
              fullWidth
              select
            >
              <MenuItem value={true}>Sent To All</MenuItem>
              <MenuItem value={false}> Selected Send </MenuItem>
            </TextField>

            {!type ? (
              <Select
                menuPortalTarget={document.body}
                isMulti
                onChange={(val) => {
                  setSelectedCourses(val);
                }}
                // name="selectedCourse"
                placeholder="Courses' event"
                className={classes.selectedCourse}
                options={options}
              />
            ) : null}

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.field}
                disablePast
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
            </MuiPickersUtilsProvider>

            <Grid container spacing={3}>
              <Grid item sm={4} xs={12}>
                <ImageGallery images={images} setImages={setImages} />
              </Grid>

              <Grid item sm={8} xs={12}>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={(content) => setEditorState(content)}
                />
              </Grid>
            </Grid>

            <Button
              onClick={() => {
                submitEvent();
              }}
              className={classes.submitButton}
              size="medium"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Card>
        </>
      )}
    </>
  );
};

export default CreateEvent;
