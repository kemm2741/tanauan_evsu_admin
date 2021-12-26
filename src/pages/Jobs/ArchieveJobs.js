import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

// ! Import Base URL
import { baseURL } from "../../utils/baseURL";

// Sweet Alert
import Swal from "sweetalert2";

// Momemnt
import moment from "moment";

// Icons
import { GrRevert } from "react-icons/gr";

// Import axios
import axios from "axios";

// Material UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Import matarial table
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

// Image grid
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

const ArchieveJobs = () => {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([
    { title: "Job Title", field: "jobTitle" },
    { title: "Company Name", field: "jobCompany" },
    {
      title: "Job Images",
      field: "jobImage",
      editable: false,
      filtering: false,
      render: (rowData) => {
        const images = rowData.jobImage.map((image) => image.url);
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
      title: "Date Posted",
      field: "date",
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
      const { data } = await axios.get(`${baseURL}/job/archived-job-list`);

      console.log(data);

      setData(data);
      setIsLoading(false);
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
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px" }}>
                <Button
                  onClick={() => {
                    history.push("/jobs");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Active Jobs
                </Button>
                <Button
                  onClick={() => {
                    history.push("/jobs/archieve-jobs");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Archieve Jobs
                </Button>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: () => <GrRevert size={24} />,
            tooltip: "Archieve Course",
            onClick: (event, rowData) => {
              Swal.fire({
                title: "Are you sure you want to activate this job?",
                // text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .post(`${baseURL}/job/update-job-status/`, {
                      jobId: rowData._id,
                    })
                    .then(({ data }) => {
                      console.log(data);
                      fetchJobs();
                    })
                    .catch((err) => {
                      console.log(err);
                      fetchJobs();
                    });
                }
              });
            },
          },
        ]}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 7,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
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

export default ArchieveJobs;
