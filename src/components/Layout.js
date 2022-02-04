import React, { useContext, useEffect, useState } from "react";

// ! Base URL
import { baseURL } from "../utils/baseURL";

//
import moment from "moment";

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
import NotificationsIcon from "@material-ui/icons/Notifications";

// Material UI List
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";

// Material Icons
import { SubjectOutlined } from "@material-ui/icons";
// React Icons
import { AiFillDashboard } from "react-icons/ai";
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

// Notifaction paper
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import EmailIcon from "@material-ui/icons/Email";
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
  notifcationDiv: {
    marginRight: "8px",
    marginTop: "12px",
  },
  customBadge: {
    backgroundColor: "white",
    border: "1px #710000 solid",
    color: "#710000",
  },
  notificationDiv: {
    maxHeight: "600px",
    overflowY: "auto",
    paddingInline: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "550px",
      overflowX: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      width: "420px",
      overflowX: "auto",
    },
  },
  viewed: {
    backgroundColor: "#E7DEDE",
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
    // {
    //   text: "Alumni Form",
    //   icon: <AiOutlineForm size={26} />,
    //   path: "/alumniform",
    // },
    {
      text: "Activity Logs",
      icon: <FaRegCalendarTimes size={26} />,
      path: "/logs",
    },
  ];

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [notification, setNotification] = useState([]);
  const [notificationLength, setNotificationLength] = useState(0);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // Call Notifications
  const callNotfiaction = () => {
    setInterval(async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/admin/get-notification-info`
        );
        setNotification(data.notif);
        const notifLength = data.notif.filter((notif) => !notif.viewed);
        setNotificationLength(notifLength.length);
      } catch (error) {
        console.log(error);
      }
    }, 3000);
  };

  useEffect(() => {
    loadAdmin();
    callNotfiaction();
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
              Swal.fire({
                title: "Warning",
                text: "Are you sure you want to logout?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Log-out",
              }).then((result) => {
                if (result.isConfirmed) {
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
                }
              });
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

          <div className={classes.notifcationDiv}>
            <Tooltip arrow title="Notications">
              <IconButton
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                aria-label="show 4 new mails"
              >
                <Badge
                  classes={{ badge: classes.customBadge }}
                  badgeContent={notificationLength}
                  color="secondary"
                >
                  <NotificationsIcon color="secondary" />
                </Badge>
              </IconButton>
            </Tooltip>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper className={classes.notificationDiv}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        {notification.map((notif) => (
                          <div
                            style={{ width: "100%", height: "100%" }}
                            onClick={() => {
                              history.push(`${notif.link}`);
                            }}
                          >
                            <MenuItem
                              className={classes.menuItemNotContainer}
                              onClick={async () => {
                                try {
                                  const { data } = await axios.get(
                                    `${baseURL}/admin/update-viewed-notif/${notif._id}`
                                  );
                                  callNotfiaction();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                              style={{
                                marginBottom: "5px",
                              }}
                              className={!notif.viewed ? classes.viewed : null}
                            >
                              <ListItemIcon>
                                {notif.viewed ? (
                                  <DraftsIcon fontSize="small" />
                                ) : (
                                  <EmailIcon fontSize="small" />
                                )}
                              </ListItemIcon>

                              <Typography
                                style={{ width: "100%", overflowX: "auto" }}
                                variant="inherit"
                              >
                                <p
                                  className="p-2"
                                  dangerouslySetInnerHTML={{
                                    __html: notif.message,
                                  }}
                                />
                              </Typography>
                            </MenuItem>
                            <span style={{ fontWeight: "500" }}>
                              {moment(notif.createdAt)
                                .startOf("hour")
                                .fromNow()}
                            </span>
                          </div>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>

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
