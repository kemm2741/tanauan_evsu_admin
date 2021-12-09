import React, { useEffect, useState } from "react";

// ! Import base URL
import { baseURL } from "../utils/baseURL";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import NoteCard from "../components/NoteCard";

// Card
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import { makeStyles } from "@material-ui/core";
import { yellow, green, pink, blue } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";

//Import Axios
import axios from "axios";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: (data) => {
      // console.log(data);
      // if (data.batch == "2021") {
      //   return yellow[700];
      // }
      // if (data.batch == "2020") {
      //   return green[500];
      // }
      // if (data.batch == "2019") {
      //   return pink[500];
      // }
      return pink[700];
    },
  },
  card: {
    width: "100%",
    margin: "auto",
    boxShadow: "-5px 0px 20px -7px rgba(0,0,0,0.75)",
    // objectFit: "cover",
  },
  media: {
    height: 470,
    width: "100%",
    objectFit: "contain",
    padding: "10px",
  },
  loadingDiv: {
    width: "300px",
    margin: "140px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  alumniContainer: {
    marginTop: "20px",
  },
});

export default function User() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //   Fetch Users
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/user`);
      setIsLoading(false);
      setData(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const classes = useStyles(data);

  return (
    <>
      {isLoading ? (
        <div className={classes.loadingDiv}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Typography variant="h4" color="textSecondary" align="center">
            Alumnis Life Status
          </Typography>

          <Grid className={classes.alumniContainer} container spacing={3}>
            {data?.map((user) => (
              <Grid item xs={12} md={6} lg={4} key={user._id}>
                <Card className={classes.card} elevation={1}>
                  <CardHeader
                    avatar={
                      <Avatar className={classes.avatar}>
                        {user.name[0].toUpperCase()}
                      </Avatar>
                    }
                    // action={
                    //   <IconButton onClick={() => handleDelete(note.id)}>
                    //     <DeleteOutlined />
                    //   </IconButton>
                    // }
                    title={`${user.name} ${user.middleName} ${user.lastName}`}
                    subheader={` ${user.course.courseName} batch of ${user.batch}`}
                  />

                  <CardMedia
                    component="img"
                    alt="Alumni Profile"
                    className={classes.media}
                    image={
                      user.image
                        ? user.image
                        : "https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
                    }
                    title="Alumni Profile"
                  />

                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {user.jobExperience}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
