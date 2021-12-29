import React, { useState, useEffect } from "react";
// Import Sweet Alert
import Swal from "sweetalert2";
import { GrRevert } from "react-icons/gr";

import MaterialTable, { MTableToolbar } from "material-table";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

// ! Base URL
import { baseURL } from "../utils/baseURL";
import { makeStyles } from "@material-ui/core/styles";

// Axios
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  chipButton: {
    marginRight: "10px",
  },
}));

const ArchieveCourses = () => {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [columns, setColumns] = useState([
    { title: "Courses", field: "courseName" },
    { title: "Course ABV", field: "courseAbbreviation" },
    {
      title: "Date Created",
      field: "date",
      type: "date",
      editable: false,
      dateSetting: {
        format: "dd/MM/yyyy",
      },
    },
    // {
    //   title: "Graduated With This Course",
    //   field: "usersEnrolled",
    //   editable: false,
    //   filtering: false,
    // },
  ]);

  const fetchArchieveCourses = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/course/get-archived`);
      setData(data);
      console.log(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.msg);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchieveCourses();
  }, []);

  return (
    <MaterialTable
      isLoading={isLoading}
      title="Archieve Evsu Courses"
      columns={columns}
      data={data}
      options={{
        exportButton: true,
        filtering: true,
        pageSize: 12,
        toolbar: true,
        actionsColumnIndex: -1,
        addRowPosition: "first",
      }}
      actions={[
        {
          icon: () => <GrRevert size={24} />,
          tooltip: "Active Course",
          onClick: (event, rowData) => {
            Swal.fire({
              title: "Are you sure you want to activate this course?",
              // text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes",
            }).then((result) => {
              if (result.isConfirmed) {
                axios
                  .post(`${baseURL}/course/course-to-active`, {
                    course_id: rowData._id,
                  })
                  .then(({ data }) => {
                    console.log(data);
                    fetchArchieveCourses();
                  })
                  .catch((err) => {
                    fetchArchieveCourses();
                    console.log(err);
                  });
              }
            });
          },
        },
      ]}
      components={{
        Toolbar: (props) => (
          <div>
            <MTableToolbar {...props} />
            <div style={{ padding: "0px 10px" }}>
              <Button
                className={classes.chipButton}
                onClick={() => {
                  history.push("/courses");
                }}
                variant="contained"
                color="primary"
              >
                Active Course
              </Button>

              <Button
                className={classes.chipButton}
                onClick={() => {
                  history.push("/archieve-course");
                }}
                variant="contained"
                color="primary"
              >
                Archieve Course
              </Button>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default ArchieveCourses;
