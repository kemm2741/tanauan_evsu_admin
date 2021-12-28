import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";

// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";

// Modal
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import { AiFillCloseCircle } from "react-icons/ai";

// Card
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { pink } from "@material-ui/core/colors";

// UTILS function
import calculateAge from "../../utils/calculateAge";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// Import image grid
import Carousel from "react-material-ui-carousel";

const useStyles = makeStyles((theme) => ({
  paperCarousel: {
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
  avatar: {
    backgroundColor: pink[700],
  },
  modal: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginInline: "auto",
    overflow: "auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: "1px solid #111",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  card: {
    width: "100%",
    margin: "auto",
    border: "none",
    // boxShadow: "-5px 0px 20px -7px rgba(0,0,0,0.75)",
    // objectFit: "cover",
  },
  media: {
    height: 460,
    width: "100%",
    // objectFit: "contain",
    objectFit: "cover",
    paddingInline: "15px",
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
}));

const JobHelper = ({ rowdata }) => {
  const [data, setData] = useState([]);
  const classes = useStyles();
  //   Open Modal and Close
  const [openModal, setOpenModal] = useState(false);
  const [alumniData, setAlumniData] = useState(null);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    setData(
      rowdata.users.map(({ user, resume }) => {
        return {
          ...user,
          resume,
          age: calculateAge(user.dateOfBirth),
        };
      })
    );
  }, [rowdata]);

  useEffect(() => {
    setData(
      rowdata.users.map(({ user, resume }) => {
        return {
          ...user,
          resume,
          age: calculateAge(user.dateOfBirth),
        };
      })
    );
  }, []);

  // console.log(data);

  // const [photoIndex, setPhotoIndex] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  const [columns, setColumns] = useState([
    { title: "First Name", field: "firstname" },
    { title: "Middle Name", field: "middlename" },
    { title: "Last name", field: "lastname" },
    { title: "Age", field: "age" },
    { title: "Address", field: "address" },
    { title: "Gender", field: "sex" },
    { title: "Email Address", field: "email" },
    { title: "Contact", field: "phone" },
    { title: "Course", field: "course.courseName" },
    { title: "Year Graduated", field: "yearGraduated" },
    {
      title: "Resume",
      render: (rowData) => {
        return (
          <div
            onClick={() => {
              setAlumniData(rowData);
              setOpenModal(true);
            }}
          >
            <Carousel>
              {rowData.resume?.map((item, i) => (
                <Item key={i} item={item} />
              ))}
            </Carousel>
          </div>
        );
      },
    },
  ]);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <>
        {/* Modal */}
        {openModal && (
          <>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openModal}
              onClose={handleCloseModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 300,
              }}
            >
              <Fade in={openModal}>
                <Card className={classes.card} elevation={2}>
                  {/* No Content */}
                  <CardHeader
                    action={
                      <IconButton
                        onClick={() => {
                          setOpenModal(false);
                          setAlumniData(null);
                        }}
                      >
                        <AiFillCloseCircle size={27} />
                      </IconButton>
                    }
                  />
                  {/* <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    {alumniData?.firstname[0].toUpperCase()}
                  </Avatar>
                }
                title={`${alumniData?.firstname} ${alumniData?.middlename} ${alumniData?.lastname}`}
                subheader={`${alumniData?.course.courseName} batch of ${alumniData?.yearGraduated}`}
                action={
                  <IconButton
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    <AiFillCloseCircle size={30} />
                  </IconButton>
                }
              /> */}

                  {alumniData?.resume?.map((resums) => (
                    <CardMedia
                      component="img"
                      alt="Alumni Profile"
                      className={classes.media}
                      image={resums.url}
                      title="Alumni Resume"
                    />
                  ))}

                  {/* <CardMedia
                component="img"
                alt="Alumni Profile"
                className={classes.media}
                image={
                  alumniData
                    ? alumniData.profile.url !== ""
                      ? alumniData.profile.url
                      : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"'
                    : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"'
                }
                title="Alumni Profile"
              /> */}

                  <CardContent>
                    {/* <Typography variant="body2" color="textSecondary"></Typography> */}
                  </CardContent>
                </Card>
              </Fade>
            </Modal>
          </>
        )}

        <MaterialTable
          // onRowClick={(event, rowData, togglePanel) => {
          //   handleOpenModal();
          //   setAlumniData(rowData);
          // }}
          title={`Applied Users at ${rowdata.jobCompany}`}
          columns={columns}
          data={data}
          options={{
            exportButton: true,
            filtering: true,
            pageSize: 7,
            toolbar: true,
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        />
      </>
    </div>
  );
};

function Item(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.paperCarousel}>
      <img
        className={classes.carouselImage}
        style={{ width: "100%", height: "100%" }}
        src={props.item.url}
        alt={props.item}
      />
    </Paper>
  );
}

export default JobHelper;
