import React, { useState, useEffect } from "react";

// ! Import baseURL
import { baseURL } from "../../utils/baseURL";

import { useHistory } from "react-router-dom";

import Swal from "sweetalert2";

import { GrRevert } from "react-icons/gr";

// Import Axios
import axios from "axios";

// Import matarial table
import MaterialTable, { MTableToolbar } from "material-table";

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

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
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
  chipButton: {
    marginRight: "10px",
  },
}));

const PendingAlumnis = () => {
  const classes = useStyles();
  const history = useHistory();

  // Calcualte Age
  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date); // create a date object directly from dob1 argument
    let age_now = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    return age_now;
  };

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [columns, setColumns] = useState([
    {
      title: "Name",
      field: "firstname",
    },
    {
      title: "Middle Name",
      field: "middlename",
    },
    {
      title: "Last Name",
      field: "lastname",
    },
    {
      title: "Gender",
      field: "sex",
    },
    {
      title: "Age",
      field: "age",
    },
    {
      title: "Contact Number",
      field: "phone",
    },
    {
      title: "Email Address",
      field: "email",
    },
    {
      title: "Place of Birth",
      field: "placeOfBirth",
    },
    {
      title: "Course Graduated",
      field: "course.courseName",
    },

    {
      title: "Company Address",
      field: "companyAddress",
    },
    {
      title: "Present Occupation",
      field: "presentOccupation",
    },
    {
      title: "Year Graduated",
      field: "yearGraduated",
    },

    // {
    //   title: "Date Created",
    //   field: "date",
    //   type: "date",
    //   editable: "never",
    //   dateSetting: {
    //     format: "dd/MM/yyyy",
    //   },
    // },
  ]);

  //   Open Modal and Close
  const [openModal, setOpenModal] = useState(false);
  const [alumniData, setAlumniData] = useState(null);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  //  End Open Modal and Close

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/user/pending-user`);
      const withAge = data.map((user) => {
        return {
          ...user,
          age: calculateAge(user.dateOfBirth),
        };
      });
      setData(withAge);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {/* Modal */}
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
            <CardHeader
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
            />

            <CardMedia
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
            />

            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {alumniData?.jobExperience}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Modal>

      <MaterialTable
        title="EVSU Pending Alumnis"
        columns={columns}
        isLoading={isLoading}
        data={data}
        onRowClick={(event, rowData, togglePanel) => {
          handleOpenModal();
          setAlumniData(rowData);
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px" }}>
                <Button
                  onClick={() => {
                    history.push("/alumni");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Active
                </Button>
                <Button
                  onClick={() => {
                    history.push("/alumni/pending-user");
                  }}
                  className={classes.chipButton}
                  variant="contained"
                  color="primary"
                >
                  Pending
                </Button>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: () => <GrRevert size={24} />,
            tooltip: "Approved User",
            onClick: async (event, rowData) => {
              try {
                setIsLoading(true);
                const { data } = await axios.post(
                  `${baseURL}/user/update-status-user`,
                  {
                    userId: rowData._id,
                    status: "active",
                  }
                );
                fetchUsers();
                Swal.fire("Success", "User account is now approved", "success");
                setIsLoading(false);
              } catch (error) {
                fetchUsers();
                Swal.fire("Error", `${error.response.data.msg}`, "error");
                setIsLoading(false);
              }
            },
          },
        ]}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 10,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        editable={{
          onRowDelete: async (oldData) =>
            new Promise((resolve, reject) => {
              setIsLoading(true);
              axios
                .post(`${baseURL}/user/deleting-pending-request/`, {
                  userId: oldData._id,
                })
                .then(({ data }) => {
                  setIsLoading(false);
                  Swal.fire("Success", "User account deleted", "success");
                  fetchUsers();
                  resolve();
                })
                .catch((err) => {
                  setIsLoading(false);
                  fetchUsers();
                  Swal.fire("Error", `${err.response.data.msg}`, "error");
                  resolve();
                });
            }),
        }}
      />
    </div>
  );
};

export default PendingAlumnis;
