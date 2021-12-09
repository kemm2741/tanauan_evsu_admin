import React, { useState, useEffect, useCallback } from "react";

// ! Import Base URL
import { baseURL } from "../utils/baseURL";

import { useHistory } from "react-router-dom";

// Momemnt
import moment from "moment";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// Materia Table
import MaterialTable from "material-table";

// Count Up
import CountUp from "react-countup";

// Import axios
import axios from "axios";

// Pie Chart
import { ResponsiveContainer, PieChart, Pie, Sector } from "recharts";

// React Icons
import { RiAdminLine } from "react-icons/ri";
import { ImBooks } from "react-icons/im";
import { FaUserGraduate } from "react-icons/fa";
import { MdEventNote, MdWork, MdEmail } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    border: "1.5px #710000 solid",
    cursor: "pointer",
    transition: "0.2s ease-in-out all",
    "&:hover": {
      backgroundColor: "#710000",
      color: "#fff",
    },
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  dataNumber: {
    fontSize: "22px",
  },
  lineChartDesign: {
    margin: theme.spacing(4),
  },
  employedContainer: {
    marginTop: theme.spacing(10),
  },
  gridItem: {
    display: "block",
    background: "red",
    width: "100%",
    height: "100%",
  },
  pieChartContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Users ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Dashboard = () => {
  const classes = useStyles();

  const history = useHistory();

  const [employedUsers, setEmployedUsers] = useState([]);
  const [unEmployedUsers, setUnEmployedUsers] = useState([]);

  // ALL Data States fetch States
  const [alumniData, setAlumniData] = useState({
    alumni: [],
    isLoading: false,
  });
  const [courseData, setCourseData] = useState({
    course: [],
    isLoading: false,
  });
  const [adminData, setAdminData] = useState({
    admin: [],
    isLoading: false,
  });

  const [eventData, setEventData] = useState({
    event: [],
    isLoading: false,
  });

  const [jobData, setJobData] = useState({
    job: [],
    isLoading: false,
  });

  const [subscriberData, setSubscriberData] = useState({
    subscriber: [],
    isLoading: false,
  });

  // Working and Not Working Data
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  // fetchAlumnis
  const fetchAlumnis = async () => {
    try {
      setAlumniData({
        ...alumniData,
        isLoading: true,
      });
      const { data } = await axios.get(`${baseURL}/user`);
      // setAlumniData(data);

      const workingUsers = data.filter((user) => {
        return user.status === "employed";
      });
      const notWorking = data.filter((user) => {
        return user.status === "unemployed";
      });
      setEmployedUsers(workingUsers);
      setUnEmployedUsers(notWorking);

      // Setting Percent
      const numberOfWorking = workingUsers.length;
      const numberOfNotWorking = notWorking.length;
      setData([
        { name: "Employed Users", value: numberOfWorking },
        { name: "UnEmployed Users", value: numberOfNotWorking },
      ]);
      setAlumniData({
        alumni: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      setAlumniData({
        ...alumniData,
        isLoading: false,
      });
    }
  };

  // fetchCourse
  const fetchCourse = async () => {
    try {
      setCourseData({
        ...courseData,
        isLoading: true,
      });

      const { data } = await axios.get(`${baseURL}/course`);
      // setCourseData(data);

      setCourseData({
        course: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      setCourseData({
        ...data,
        isLoading: false,
      });
    }
  };

  // fetchCourse
  const fetchAdmin = async () => {
    try {
      setAdminData({
        ...adminData,
        isLoading: true,
      });

      const { data } = await axios.get(`${baseURL}/admin`);
      // setAdminData(data);

      setAdminData({
        admin: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);

      setAdminData({
        ...adminData,
        isLoading: false,
      });
    }
  };

  // fetchEvent
  const fetchEvent = async () => {
    try {
      setEventData({
        ...eventData,
        isLoading: true,
      });

      const { data } = await axios.get(`${baseURL}/event`);
      // setEventData(data);

      setEventData({
        event: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      setEventData({
        ...eventData,
        isLoading: false,
      });
    }
  };

  // fetchJob
  const fetchJob = async () => {
    try {
      setJobData({
        ...jobData,
        isLoading: true,
      });

      const { data } = await axios.get(`${baseURL}/job`);

      // setJobData(data);
      setJobData({
        job: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      setJobData({
        ...jobData,
        isLoading: false,
      });
    }
  };

  // fEtch Subscribers
  const fetchSubscriber = async () => {
    try {
      setSubscriberData({
        ...subscriberData,
        isLoading: true,
      });

      const { data } = await axios.get(`${baseURL}/subscribe`);

      // setSubscriberData(data);
      setSubscriberData({
        subscriber: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);

      setSubscriberData({
        ...subscriberData,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchAlumnis();
    fetchCourse();
    fetchAdmin();
    fetchEvent();
    fetchJob();
    fetchSubscriber();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/alumni");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Alumnis
                </Typography>

                {alumniData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={alumniData.alumni?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <FaUserGraduate size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/courses");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Courses
                </Typography>
                {courseData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={courseData.course?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <ImBooks size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/admin");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Admins
                </Typography>

                {adminData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={adminData.admin?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <RiAdminLine size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/events");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Events
                </Typography>

                {eventData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={eventData.event?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <MdEventNote size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/jobs");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Jobs
                </Typography>

                {jobData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={jobData.job?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <MdWork size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={4} item align="center">
          <Paper
            onClick={() => {
              history.push("/subscriber");
            }}
            className={classes.paper}
          >
            <Grid container>
              <Grid xs={6} md={6} lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Subscribed Emails
                </Typography>

                {subscriberData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={subscriberData.subscriber?.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid xs={6} md={6} lg={6} item>
                <MdEmail size={45} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <div className={classes.employedContainer}>
        <Grid container>
          <Grid xs={12} md={8} lg={8} item>
            {/* align="center" */}
            <MaterialTable
              isLoading={alumniData.isLoading}
              title="Employed Graduates"
              columns={[
                { title: "Name", field: "name" },
                { title: "Middle Name", field: "middleName" },
                { title: "Last Name", field: "lastName" },
                { title: "Batch", field: "batch" },
                { title: "Current Work", field: "currentWork" },
              ]}
              data={employedUsers}
            />
          </Grid>

          <Grid xs={12} md={4} lg={4} item>
            <div className={classes.pieChartContainer}>
              {alumniData.isLoading ? (
                <CircularProgress />
              ) : (
                <PieChart width={450} height={400}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx={200}
                    cy={200}
                    innerRadius={70}
                    outerRadius={90}
                    fill="#710000"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  />
                </PieChart>
              )}
            </div>
          </Grid>
        </Grid>
      </div>

      <div className={classes.employedContainer}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8} lg={8} item>
            {/* align="center" */}
            <MaterialTable
              isLoading={alumniData.isLoading}
              title="Unemployed Graduates"
              columns={[
                { title: "Name", field: "name" },
                { title: "Middle Name", field: "middleName" },
                { title: "Last Name", field: "lastName" },
                { title: "Batch", field: "batch" },
              ]}
              data={unEmployedUsers}
            />
          </Grid>

          <Grid xs={12} md={4} lg={4} item>
            {/* align="center" */}
            <div className={classes.eventsContainerDashBoard}>
              <MaterialTable
                alignItems="center"
                isLoading={eventData.isLoading}
                title="Events"
                columns={[
                  { title: "Event", field: "eventTitle" },
                  {
                    title: "Schedule",
                    field: "eventSchedule",
                    editable: false,
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
                ]}
                data={eventData.event}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;
