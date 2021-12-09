import React, { useState, useEffect } from "react";

// React Router
import { useHistory } from "react-router";

// ! Base URL
import { baseURL } from "../utils/baseURL";

// Sweet Alert
import Swal from "sweetalert2";

// Momemnt
import moment from "moment";

// Import matarial table
import MaterialTable from "material-table";
import TextField from "@material-ui/core/TextField";

// Import Axios
import axios from "axios";

// Material UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  lineChartDesign: {
    margin: theme.spacing(3),
  },
}));

const Events = () => {
  const classes = useStyles();
  const history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: " Event Title",
      field: "eventTitle",
      width: "20%",
    },
    {
      title: "Event Image",
      field: "eventImage",
      editable: false,
      width: "15%",
      render: (rowData) => {
        return (
          <img
            src={
              rowData.eventImage
                ? rowData.eventImage
                : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      title: "Event Description",
      field: "eventDescription",
      width: "50%",
      filtering: false,
      editComponent: (props) => (
        <TextField
          placeholder="Event Description"
          type="text"
          value={props.value ? props.value : ""}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          variant="outlined"
          multiline
          fullWidth
          rows={7}
        />
      ),
    },
    {
      title: "Event Schedule",
      field: "eventSchedule",
      width: "15%",
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      render: (rowData) => (
        <Typography variant="p">
          {moment(rowData.eventSchedule).format("LL")}
        </Typography>
      ),
    },
    {
      title: "Date Posted",
      field: "date",
      width: "15%",
      editable: false,
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      // render: (rowData) => (
      //   <Typography variant="p">
      //     {moment(rowData.date).format("llll")}
      //   </Typography>
      // ),
    },
  ]);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriberEmails, setSubscriberEmails] = useState([]);

  // fetch Events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/event`);
      setData(data);
      console.log(data);
      fetchSubscriber();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
    fetchEvents();
  }, []);

  return (
    <div>
      {/* <div className={classes.lineChartDesign}></div> */}
      <MaterialTable
        isLoading={isLoading}
        title="Evsu Events"
        columns={columns}
        data={data}
        actions={[
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event) => history.push("/createEvent"),
          },
        ]}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 6,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        editable={{
          // onRowAdd: (newData) =>
          //   new Promise((resolve, reject) => {
          //     const { eventSchedule, eventTitle, eventDescription } = newData;

          //     const emails = subscriberEmails.map((a) => a.subscriberEmail);

          //     console.log(eventSchedule, eventTitle, eventDescription, emails);

          //     axios
          //       .post(`${baseURL}/event`, {
          //         eventSchedule,
          //         eventTitle,
          //         eventDescription,
          //         emails,
          //       })
          //       .then(() => {
          //         fetchEvents();
          //         Swal.fire("Success", "New Event Added", "success");
          //         resolve();
          //       })
          //       .catch((error) => {
          //         console.log(error);
          //         resolve();
          //       });
          //   }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              axios
                .put(`${baseURL}/event/${oldData._id}`, newData)
                .then(() => {
                  fetchEvents();
                  Swal.fire(
                    "Success",
                    "Event was updated successfully",
                    "success"
                  );
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  resolve();
                });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .delete(`${baseURL}/event/${oldData._id}`)
                .then(() => {
                  fetchEvents();
                  Swal.fire("Success", "Event was deleted", "success");
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  resolve();
                });
            }),
        }}
      />
    </div>
  );
};

export default Events;
