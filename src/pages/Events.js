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
import MaterialTable, { MTableToolbar } from "material-table";
import TextField from "@material-ui/core/TextField";

// Import Axios
import axios from "axios";

// Material UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";

// Import image grid
import Carousel from "react-material-ui-carousel";

const useStyles = makeStyles((theme) => ({
  lineChartDesign: {
    margin: theme.spacing(3),
  },
  paper: {
    width: "170px",
    height: "150px",
    display: "block",
    marginInline: "auto",
  },
  carouselImage: {
    objectFit: "cover",
  },
  chipButton: {
    marginRight: "10px",
  },
}));

const Events = () => {
  const classes = useStyles();
  const history = useHistory();

  const [columns, setColumns] = useState([
    {
      title: " Event Title",
      field: "eventTitle",
    },
    {
      title: "Event Image",
      field: "eventImage",
      editable: false,
      filtering: false,

      render: (rowData) => {
        const images = rowData.eventImage.map((image) => image.url);
        return (
          <Carousel>
            {images.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        );
      },
    },
    {
      title: "Event Schedule",
      field: "eventSchedule",
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

  // fetch Events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/event`);
      setData(data);
      console.log(data);

      setIsLoading(false);
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
      <MaterialTable
        isLoading={isLoading}
        title="Evsu Events"
        columns={columns}
        data={data}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px" }}>
                <Button
                  onClick={() => {
                    history.push("/events");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Active Events
                </Button>
                <Button
                  onClick={() => {
                    history.push("/events/archieve-events");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Archieve Events
                </Button>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event) => history.push("/createEvent"),
          },
          {
            icon: "edit",
            tooltip: "Edit Event",
            onClick: (event, rowData) => {
              history.push(`/event-edit/${rowData._id}`);
            },
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
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .delete(`${baseURL}/event/${oldData._id}`)
                .then(() => {
                  fetchEvents();
                  Swal.fire("Success", "Event was archieve", "success");
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

function Item(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <img
        className={classes.carouselImage}
        style={{ width: "100%", height: "100%" }}
        src={props.item}
        alt={props.item}
      />
    </Paper>
  );
}

export default Events;
