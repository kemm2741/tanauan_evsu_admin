import React, { useState, useEffect } from "react";

// ! Import Base URL
import { baseURL } from "../utils/baseURL";

// Momemnt
import moment from "moment";

// Import axios
import axios from "axios";

// Material UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// Import matarial table
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => {
  return {
    loginNameUser: {
      textTransform: "capitalize",
    },
  };
});

const Logs = () => {
  const classes = useStyles();
  // Main Data
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Subscriber Emails
  const [subscriberEmails, setSubscriberEmails] = useState();

  const [columns, setColumns] = useState([
    {
      title: "Admin Name",
      field: "name",
      //  width: "25%"
      render: (rowData) => (
        <Typography className={classes.loginNameUser} variant="p">
          {rowData.name}
        </Typography>
      ),
    },
    {
      title: "Activity Log",
      field: "logDescription",
      // width: "50%",
      filtering: false,
    },
    {
      title: "Date",
      field: "date",
      // width: "25%",
      editable: false,
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      render: (rowData) => (
        <Typography variant="p">
          {moment(rowData.date).format("LLLL")}
        </Typography>
      ),
    },
  ]);

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // Jobs Data
      const { data } = await axios.get(`${baseURL}/log`);
      setData(data);
      // Fetch subscribe emails data
      // fetchSubscriber();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // ? fetch Emails
  // const fetchSubscriber = async () => {
  //   try {
  //     const { data } = await axios.get("http://localhost:5000/api/subscribe");
  //     setSubscriberEmails(data);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <MaterialTable
        isLoading={isLoading}
        title="Activity Logs"
        columns={columns}
        data={data}
        options={{
          // exportButton: true,
          filtering: true,
          pageSize: 9,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
      />
    </div>
  );
};

export default Logs;
