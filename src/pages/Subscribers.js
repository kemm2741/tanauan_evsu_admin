import React, { useState, useEffect } from "react";

// ! base URL
import { baseURL } from "../utils/baseURL";

// Sweet Alert
import Swal from "sweetalert2";

// Import Axios
import axios from "axios";

// Import matarial table
import MaterialTable from "material-table";

const Subscribers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    { title: "Subscribed Emails", field: "subscriberEmail" },
    {
      title: "Date Subscribed",
      field: "date",
      type: "date",
      editable: "never",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
    },
  ]);

  // fEtch Subscribers
  const fetchSubscriber = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${baseURL}/subscribe`);
      setIsLoading(false);
      // console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, []);

  return (
    <div>
      <MaterialTable
        isLoading={isLoading}
        title="Subscribed Emails"
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 10,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              const { subscriberEmail } = newData;
              axios
                .post(`${baseURL}/subscribe`, {
                  subscriberEmail,
                })
                .then((res) => {
                  setTimeout(() => {
                    fetchSubscriber();
                    Swal.fire(
                      "Success",
                      "New email added successfully",
                      "success"
                    );
                    resolve();
                  }, 1000);
                })
                .catch((err) => {
                  Swal.fire(
                    "Error",
                    "Please enter valid email address!",
                    "error"
                  );
                  resolve();
                });
            }),
          // onRowUpdate: (newData, oldData) =>
          //   new Promise((resolve, reject) => {
          //     const { subscriberEmail } = newData;
          //     axios
          //       .put(`${baseURL}/subscribe/${oldData._id}`, {
          //         subscriberEmail,
          //       })
          //       .then((res) => {
          //         setTimeout(() => {
          //           const dataUpdate = [...data];
          //           const index = oldData.tableData.id;
          //           dataUpdate[index] = newData;
          //           setData([...dataUpdate]);

          //           Swal.fire(
          //             "Success",
          //             "Email updated successfully",
          //             "success"
          //           );
          //           resolve();
          //         }, 1000);
          //       })
          //       .catch((err) => {
          //         console.log(err);
          //         resolve();
          //       });
          //   }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .delete(`${baseURL}/subscribe/${oldData._id}`)
                .then((res) => {
                  setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    Swal.fire("Success", "Email deleted", "success");
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

export default Subscribers;
