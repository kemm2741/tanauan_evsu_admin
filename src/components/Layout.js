import React, { useContext, useEffect, useState } from "react";

// ! Base URL
import { baseURL } from "../utils/baseURL";

// Import Axios
import axios from "axios";

// React Router Dom
import { useHistory, useLocation } from "react-router-dom";

// Material UI
import { makeStyles } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";

// Material UI List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Material Icons
import { SubjectOutlined } from "@material-ui/icons";
// React Icons
import { AiOutlineForm, AiFillDashboard } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendarTimes } from "react-icons/fa";

// Appbar
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";

// Date Formater
import { format } from "date-fns";

import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

// Sweet Alert
import Swal from "sweetalert2/dist/sweetalert2.js";

// Context
import AuthContext from "../context/auth/authContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  page: {
    background: "#fff",
    minHeight: "100vh",
    width: "100%",
    padding: theme.spacing(3),
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#e7dede",
  },
  active: {
    background: "#710000",
    color: "#fff",
  },
  activeIcons: {
    color: "grey",
  },
  date: {
    flexGrow: 1,
  },
  title: {
    padding: theme.spacing(2),
  },
  hideDisplay: {
    display: "none",
  },
  logoContainer: {
    paddingInline: "30px",
    display: "flex",
    alignItems: "center",
  },
  loginNameUser: {
    textTransform: "capitalize",
  },
  menuText: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const authContext = useContext(AuthContext);
  const { loadAdmin, logout, admin } = authContext;

  // Mobile State Nav
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <AiFillDashboard size={26} />,
      path: "/dashboard",
    },
    {
      text: "Profile",
      icon: <CgProfile size={26} />,
      path: "/profile",
    },
    {
      text: "Alumni Form",
      icon: <AiOutlineForm size={26} />,
      path: "/alumniform",
    },
    {
      text: "Activity Logs",
      icon: <FaRegCalendarTimes size={26} />,
      path: "/logs",
    },
  ];

  useEffect(() => {
    loadAdmin();
  }, []);

  const drawer = (
    <>
      <Drawer
        className={
          location.pathname === "/login" ? classes.hideDisplay : classes.drawer
        }
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <div className={classes.logoContainer}>
          <Avatar
            alt="Remy Sharp"
            src="https://tanauan.evsu.edu.ph/wp-content/uploads/2017/08/favicon.png"
          />
          <Typography variant="h5" className={classes.title}>
            EVSU
          </Typography>
        </div>

        <Divider />

        {/* links/list section */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => history.push(item.path)}
              className={location.pathname == item.path ? classes.active : null}
            >
              <ListItemIcon className={classes.activeIcons}>
                {item.icon}
              </ListItemIcon>
              <ListItemText className={classes.menuText} primary={item.text} />
            </ListItem>
          ))}

          <ListItem
            button
            onClick={() => {
              setMobileOpen(false);
              logout();
              axios
                .post(`${baseURL}/log`, {
                  name: admin.userName,
                  logDescription: "Log-out",
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
              history.push("/login");
            }}
          >
            <ListItemIcon>
              <SubjectOutlined />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar
        position="fixed"
        className={
          location.pathname === "/login" ? classes.hideDisplay : classes.appBar
        }
        elevation={0}
        color="primary"
      >
        <Toolbar>
          {/* Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {/* Menu Icon */}

          <Typography className={classes.date}>
            Today is {format(new Date(), "do MMMM Y")}
          </Typography>

          <Typography className={classes.loginNameUser} variant="h6">
            Hello {admin?.userName}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="css">
        {drawer}
      </Hidden>

      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  );
}
