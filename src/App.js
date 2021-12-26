import React, { useContext } from "react";
import "./App.css";

// React Router Dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Material UI
import CssBaseline from "@material-ui/core/CssBaseline";

// Main Layout
import Layout from "./components/Layout";

// Admin Pages
import Dashboard from "./pages/Dashboard";

// Alumnis
import Alumnis from "./pages/Alumnis";
import PendingAlumnis from "./pages/Users/PendingAlumnis";

// Course
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";
import Events from "./pages/Events";

// Jobs
import Jobs from "./pages/Jobs";
import ArchieveJobs from "./pages/Jobs/ArchieveJobs";

import Logs from "./pages/Logs";
import User from "./pages/User";
import Subscribers from "./pages/Subscribers";
import Profile from "./pages/Profile";

// Create Pages
import CreateEvent from "./pages/CreateEvent";
import UpdateEvent from "./pages/UpdateEvent";

import CreateJob from "./pages/CreateJob";
import UpdateJob from "./pages/UpdateJob";

// 404 Page Not Found
import NotFound from "./pages/NotFound";

// Login Routes
import Login from "./pages/Login";
import AlumniForm from "./pages/AlumniForm";

// Private Route
import PrivateRoute from "./components/PrivateRoute";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

// Archieves
import ArchieveCourse from "./pages/ArchieveCourses";

// Context
import AuthContext from "./context/auth/authContext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#710000",
    },
    secondary: {
      main: "#DEA200",
    },
  },
});

function App() {
  const authContext = useContext(AuthContext);
  // Global Context
  // States on global context
  // const { isAuthenticatedLogin } = authContext;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Switch>
            <PrivateRoute exact path="/">
              <Dashboard />
            </PrivateRoute>
            <PrivateRoute exact path="/dashboard">
              <Dashboard />
            </PrivateRoute>
            {/* Alumnis */}
            <PrivateRoute exact path="/alumni">
              <Alumnis />
            </PrivateRoute>
            <PrivateRoute exact path="/alumni/pending-user">
              <PendingAlumnis />
            </PrivateRoute>
            <PrivateRoute path="/courses">
              <Courses />
            </PrivateRoute>
            <Route path="/archieve-course">
              <ArchieveCourse />
            </Route>
            <PrivateRoute path="/admin">
              <Admin />
            </PrivateRoute>
            <PrivateRoute path="/user">
              <User />
            </PrivateRoute>
            <PrivateRoute path="/subscriber">
              <Subscribers />
            </PrivateRoute>
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
            <PrivateRoute path="/logs">
              <Logs />
            </PrivateRoute>
            {/* Events */}
            <PrivateRoute path="/createEvent">
              <CreateEvent />
            </PrivateRoute>
            <PrivateRoute path="/events">
              <Events />
            </PrivateRoute>
            <PrivateRoute path="/event-edit/:id">
              <UpdateEvent />
            </PrivateRoute>
            {/* Job */}
            <PrivateRoute path="/createJob">
              <CreateJob />
            </PrivateRoute>
            <PrivateRoute exact path="/jobs">
              <Jobs />
            </PrivateRoute>
            <PrivateRoute path="/jobs/archieve-jobs">
              <ArchieveJobs />
            </PrivateRoute>
            <PrivateRoute path="/job-edit/:id">
              <UpdateJob />
            </PrivateRoute>
            {/* Not Protected Routes  */}
            <Route exact path="/login">
              <Login />
            </Route>
            {/* 404 Page Not Found */}
            <PrivateRoute exact path="*">
              <NotFound />
            </PrivateRoute>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
