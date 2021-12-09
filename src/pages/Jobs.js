import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

// ! Import Base URL
import { baseURL } from "../utils/baseURL";

// Sweet Alert
import Swal from "sweetalert2";

// Momemnt
import moment from "moment";

// Import axios
import axios from "axios";

// Material UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Import matarial table
import MaterialTable from "material-table";

const Jobs = () => {
  const history = useHistory();
  const [data, setData] = useState();
  const [subscriberEmails, setSubscriberEmails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([
    { title: "Title ", field: "jobTitle", width: "10%" },
    { title: "Company", field: "jobCompany", width: "15%" },
    {
      title: "Description",
      field: "jobDescription",
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
      title: "Job Image",
      field: "jobImage",
      width: "15%",
      editable: false,
      filtering: false,
      render: (rowData) => {
        return (
          <img
            src={
              rowData.jobImage
                ? rowData.jobImage
                : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "contain",
            }}
          />
        );
      },
    },
    {
      title: "Date Posted",
      field: "date",
      width: "10%",
      editable: false,
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      render: (rowData) => (
        <Typography variant="p">{moment(rowData.date).format("LL")}</Typography>
      ),
    },
  ]);

  // fetchJobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      // Jobs Data
      const { data } = await axios.get(`${baseURL}/job`);
      setData(data);
      // Fetch subscribe emails data
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
    fetchJobs();
  }, []);

  return (
    <div>
      <MaterialTable
        isLoading={isLoading}
        title="Posted Jobs"
        columns={columns}
        data={data}
        actions={[
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event) => history.push("/createJob"),
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
          //     const { jobTitle, jobCompany, jobDescription } = newData;
          //     const emails = subscriberEmails.map((a) => a.subscriberEmail);
          //     axios
          //       .post(`${baseURL}/job`, {
          //         jobTitle,
          //         jobCompany,
          //         jobDescription,
          //         emails,
          //       })
          //       .then(() => {
          //         fetchJobs();
          //         Swal.fire("Success", "New Job Posted", "success");
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
                .put(`${baseURL}/job/${oldData._id}`, newData)
                .then(() => {
                  fetchJobs();
                  Swal.fire("Success", "Job was updated", "success");
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
                .delete(`${baseURL}/job/${oldData._id}`)
                .then(() => {
                  fetchJobs();
                  Swal.fire("Success", "Job was deleted", "success");
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

export default Jobs;
