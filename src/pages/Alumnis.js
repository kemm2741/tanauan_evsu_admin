import React, { useState, useEffect } from "react";

// ! Import baseURL
import { baseURL } from "../utils/baseURL";

import Swal from "sweetalert2";

// Import Axios
import axios from "axios";

// Import matarial table
import MaterialTable from "material-table";

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
}));

const Alumnis = () => {
  const classes = useStyles();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [columns, setColumns] = useState([
    { title: "Name", field: "name" },
    { title: "Middle Name", field: "middleName" },
    { title: "Last Name", field: "lastName" },
    { title: "Email", field: "email" },
    { title: "Phone Number", field: "phoneNumber" },
    { title: "Age", field: "age" },
    {
      title: "Sex",
      field: "sex",
      lookup: { Male: "Male", Female: "Female" },
    },
    { title: "Batch", field: "batch" },
    { title: "Course", field: "course.courseName", editable: "never" },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Monthly Income",
      field: "monthlyIncome",
    },
    {
      title: "Yearly Income",
      field: "yearlyIncome",
    },
    { title: "Current Work", field: "currentWork" },
    // { title: "First Job Experience", field: "jobExperience" },
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
      const { data } = await axios.get(`${baseURL}/user`);
      setData(data);
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
                  {alumniData?.name[0].toUpperCase()}
                </Avatar>
              }
              title={`${alumniData?.name} ${alumniData?.middleName} ${alumniData?.lastName}`}
              subheader={` ${alumniData?.course.courseName} batch of ${alumniData?.batch}`}
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
                alumniData?.image
                  ? alumniData.image
                  : "https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
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
        title="Evsu Alumni User Lists"
        columns={columns}
        isLoading={isLoading}
        data={data}
        onRowClick={(event, rowData, togglePanel) => {
          handleOpenModal();
          setAlumniData(rowData);
        }}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 10,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        editable={{
          // onRowAdd: (newData) =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       setData([...data, newData]);
          //       resolve();
          //     }, 1000);
          //   }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              axios
                .put(`${baseURL}/user/${oldData._id}`, newData)
                .then((res) => {
                  setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    Swal.fire(
                      "Success",
                      "User updated successfully",
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
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .delete(`${baseURL}/user/${oldData._id}`)
                .then((res) => {
                  setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    Swal.fire("Success", "User deleted", "success");
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

export default Alumnis;
