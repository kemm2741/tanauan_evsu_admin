// import React, { useState, useEffect } from "react";

// // !Base URL
// import { baseURL } from "../utils/baseURL";

// // Import axios
// import axios from "axios";

// // Material UI Date Picker
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

// // React Router
// import { useHistory } from "react-router-dom";

// // Material UI
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import Container from "@material-ui/core/Container";
// import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
// import { makeStyles } from "@material-ui/core";
// import TextField from "@material-ui/core/TextField";
// import CircularProgress from "@material-ui/core/CircularProgress";

// // Sweet Alert
// import Swal from "sweetalert2";

// const useStyles = makeStyles({
//   field: {
//     marginTop: 20,
//     marginBottom: 20,
//     display: "block",
//   },
//   circularContainer: {
//     height: "30vh",
//     marginTop: 20,
//     width: "100%",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginInline: "auto",
//   },
// });

// export default function CreateEvent() {
//   const classes = useStyles();
//   const history = useHistory();

//   //   Initial State
//   const intialState = {
//     eventTitle: "",
//     eventDescription: "",
//   };

//   //   Main Data
//   const [eventData, setEventData] = useState(intialState);
//   const [isLoading, setIsLoading] = useState(false);
//   //  Subscribe Emails
//   const [subscriberEmails, setSubscriberEmails] = useState([]);

//   //   Date Functions
//   const [selectedDate, setSelectedDate] = useState(
//     new Date("2014-08-18T21:11:54")
//   );

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   //   Image Functions
//   const [eventImage, setEventImage] = useState("");
//   const handleImageChange = (e) => {
//     setEventImage(e.target.files[0]);
//   };

//   //  Handle Onchange
//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setEventData({
//       ...eventData,
//       [name]: value,
//     });
//   };

//   //   Create Event Fucntion
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (eventData.eventTitle === "") {
//       return Swal.fire("Error", "Please enter valid event Title", "error");
//     }

//     if (eventData.eventDescription === "") {
//       return Swal.fire(
//         "Error",
//         "Please enter valid event description",
//         "error"
//       );
//     }

//     if (selectedDate === "") {
//       return Swal.fire("Error", "Please enter valid event date", "error");
//     }

//     if (eventImage === "") {
//       return Swal.fire("Error", "Please enter valid event image", "error");
//     }

//     const formData = new FormData();
//     formData.append("file", eventImage);
//     formData.append("upload_preset", "iyvxqf5y");

//     // Delete Auth Token From Header
//     delete axios.defaults.headers.common["auth-token"];
//     try {
//       setIsLoading(true);
//       const { data } = await axios.post(
//         "https://api.cloudinary.com/v1_1/dcbmrwiu6/image/upload",
//         formData
//       );

//       const emails = subscriberEmails.map((a) => a.subscriberEmail);

//       axios
//         .post(`${baseURL}/event`, {
//           eventTitle: eventData.eventTitle,
//           eventDescription: eventData.eventDescription,
//           eventSchedule: selectedDate,
//           eventImage: data.url,
//           emails,
//         })
//         .then(() => {
//           Swal.fire("Success", "New Event Added", "success");
//           history.push("/events");
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           console.log(error);
//           Swal.fire("Error", `${error.response.data.msg}`, "error");
//           setIsLoading(false);
//         });
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//     // Bring Back Auth Token From Header
//     axios.defaults.headers.common["auth-token"] = localStorage.getItem("token");
//   };

//   // fetch Emails
//   const fetchSubscriber = async () => {
//     try {
//       const { data } = await axios.get(`${baseURL}/subscribe`);
//       setSubscriberEmails(data);
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubscriber();
//   }, []);

//   return (
//     <Container size="sm">
//       {isLoading ? (
//         <div className={classes.circularContainer}>
//           <CircularProgress />
//         </div>
//       ) : (
//         <>
//           <Typography variant="h5" component="h1" gutterBottom>
//             Create a New Event
//           </Typography>
//           <form noValidate autoComplete="off" onSubmit={handleSubmit}>
//             <TextField
//               className={classes.field}
//               onChange={handleOnChange}
//               label="Event Title"
//               variant="outlined"
//               name="eventTitle"
//               value={eventData.eventTitle}
//               fullWidth
//               required
//             />
//             <TextField
//               className={classes.field}
//               onChange={handleOnChange}
//               label="Event Description"
//               variant="outlined"
//               name="eventDescription"
//               value={eventData.eventDescription}
//               fullWidth
//               required
//               multiline
//               rows={4}
//             />

//             <MuiPickersUtilsProvider utils={DateFnsUtils}>
//               <KeyboardDatePicker
//                 className={classes.field}
//                 margin="normal"
//                 label="Event Schedule"
//                 format="MM/dd/yyyy"
//                 value={selectedDate}
//                 onChange={handleDateChange}
//                 KeyboardButtonProps={{
//                   "aria-label": "change date",
//                 }}
//                 variant="outlined"
//               />
//             </MuiPickersUtilsProvider>

//             <div className={classes.field}>
//               <label htmlFor="contained-button-file">
//                 <Button
//                   style={{ marginRight: "10px" }}
//                   variant="contained"
//                   color="primary"
//                   component="span"
//                 >
//                   Upload Image
//                 </Button>
//               </label>
//               <input
//                 accept="image/png, image/gif, image/jpeg"
//                 className={classes.input}
//                 id="contained-button-file"
//                 multiple
//                 onChange={handleImageChange}
//                 type="file"
//               />
//             </div>

//             <Button
//               type="submit"
//               color="primary"
//               variant="contained"
//               endIcon={<KeyboardArrowRightIcon />}
//             >
//               Submit
//             </Button>
//           </form>
//         </>
//       )}
//     </Container>
//   );
// }

// ?
import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

//! Base IR;
import { baseURL } from "../utils/baseURL";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";

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
});

const CreateEvent = () => {
  const classes = useStyles();

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
  const [type, setType] = useState("sentToAll");

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
          label: course.courseName,
        };
      });
      setOptions(courseOption);
    } catch (error) {
      console.log(error);
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

  return (
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
        <MenuItem value="sentToAll">Sent To All</MenuItem>
        <MenuItem value="selectedSend"> Selected Send </MenuItem>
      </TextField>

      {type === "selectedSend" && (
        <Select
          isMulti
          placeholder="Courses' event"
          className={classes.selectedCourse}
          options={options}
        />
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          console.log(selectedCourse);
        }}
      >
        HELLOO
      </button>

      <Editor
        editorState={editorState}
        onEditorStateChange={(content) => setEditorState(content)}
      />
    </Card>
  );
};

export default CreateEvent;
