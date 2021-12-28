import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

// ! Base URL
import { baseURL } from "../utils/baseURL";

import { GrRevert } from "react-icons/gr";

// Rechart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Import Sweet Alert
import Swal from "sweetalert2";

// Import Axios
import axios from "axios";

// Import matarial table
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";

// Page Helper Component
import CourseHelper from "./PageHelper/CourseHelper";

const useStyles = makeStyles((theme) => ({
  chipButton: {
    marginRight: "10px",
  },
}));

const Courses = () => {
  const classes = useStyles();
  const history = useHistory();

  const [data, setData] = useState();
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
    {
      title: "Graduated With This Course",
      field: "usersEnrolled",
      editable: false,
      filtering: false,
    },
  ]);

  // fEtch Course
  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/course`);

      console.log(data);

      const mainData = data.map((item) => {
        return {
          ...item,
          usersEnrolled: item.users.length,
        };
      });
      // ! Logging the Data Input -------------
      console.log(mainData);
      setData(mainData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <div>
      {!isLoading && (
        <ResponsiveContainer width="100%" aspect={4 / 1}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseAbbreviation" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="usersEnrolled"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <MaterialTable
        isLoading={isLoading}
        title="EVSU Courses"
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 20,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        actions={[
          {
            icon: () => <GrRevert size={24} />,
            tooltip: "Archieve Course",
            onClick: (event, rowData) => {
              Swal.fire({
                title: "Are you sure you want to archieve this course?",
                // text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .delete(`${baseURL}/course/${rowData._id}`)
                    .then(({ data }) => {
                      console.log(data);
                      fetchCourse();
                    })
                    .catch((err) => {
                      console.log(err);
                      fetchCourse();
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
                    history.push("/archieve-course");
                  }}
                  variant="contained"
                  color="primary"
                >
                  Archieve Course
                </Button>

                <Button
                  className={classes.chipButton}
                  onClick={() => {
                    history.push("/course");
                  }}
                  variant="contained"
                  color="primary"
                >
                  Active Course
                </Button>
              </div>
            </div>
          ),
        }}
        detailPanel={(rowData) => {
          return (
            <CourseHelper
              graduates={rowData.users}
              courseName={rowData.courseName}
            />
          );
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              axios
                .post(`${baseURL}/course`, newData)
                .then((res) => {
                  setTimeout(() => {
                    fetchCourse();
                    Swal.fire(
                      "Success",
                      "Course added successfully",
                      "success"
                    );
                    resolve();
                  }, 1000);
                })
                .catch((err) => {
                  console.log(err);
                  resolve();
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              axios
                .put(`${baseURL}/course/${oldData._id}`, newData)
                .then((res) => {
                  setTimeout(() => {
                    fetchCourse();
                    Swal.fire("Success", "Success updating course", "success");
                    resolve();
                  }, 1000);
                })
                .catch((err) => {
                  console.log(err);
                  resolve();
                });
            }),
        }}
      />
    </div>
  );
};

export default Courses;
